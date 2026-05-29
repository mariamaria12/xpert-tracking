import { cache } from "react";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

import { isActiveHomeProject } from "@/lib/services/projects/projectStatuses";

import type {
  ActiveClientSummary,
  ActiveProjectSummary,
  HomeDashboardData,
} from "./home.types";

type ActiveProjectDbRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  "id" | "name" | "status" | "estimated_hours" | "due_date" | "client_id"
> & {
  clients?: { company_name: string | null } | { company_name: string | null }[] | null;
};

type TimeLogDbRow = Pick<
  Database["public"]["Tables"]["time_logs"]["Row"],
  "project_id" | "duration_minutes"
>;

function pickCompanyName(value: ActiveProjectDbRow["clients"]) {
  if (!value) return "—";
  const item = Array.isArray(value) ? value[0] : value;
  return item?.company_name?.trim() || "—";
}

type ActiveHomePanelsData = Pick<HomeDashboardData, "activeProjects" | "activeClients">;

async function fetchActiveHomePanelsData(): Promise<ActiveHomePanelsData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: timeLogs, error: timeLogsError }, { data: activeProjects, error: activeProjectsError }] =
    await Promise.all([
      supabase.from("time_logs").select("project_id, duration_minutes"),
      supabase
        .from("projects")
        .select("id, name, status, estimated_hours, due_date, client_id, clients(company_name)")
        .order("due_date", { ascending: true }),
    ]);

  const actualMinutesByProjectId = new Map<string, number>();
  for (const log of (timeLogs ?? []) as TimeLogDbRow[]) {
    actualMinutesByProjectId.set(
      log.project_id,
      (actualMinutesByProjectId.get(log.project_id) ?? 0) + Number(log.duration_minutes ?? 0),
    );
  }

  const activeProjectsList: ActiveProjectSummary[] = activeProjectsError
    ? []
    : ((activeProjects ?? []) as ActiveProjectDbRow[])
        .filter((p) => isActiveHomeProject(p.status))
        .map((p) => ({
          id: p.id,
          name: p.name,
          companyName: pickCompanyName(p.clients),
          status: p.status,
          estimatedHours: p.estimated_hours === null ? null : Number(p.estimated_hours),
          actualHours: (actualMinutesByProjectId.get(p.id) ?? 0) / 60,
          dueDate: p.due_date ? new Date(p.due_date) : null,
        }));

  const activeClients: ActiveClientSummary[] = activeProjectsError
    ? []
    : (() => {
        const byClientId = new Map<string, ActiveClientSummary>();
        for (const p of (activeProjects ?? []) as ActiveProjectDbRow[]) {
          if (!isActiveHomeProject(p.status)) continue;
          const clientId = p.client_id;
          if (!clientId) continue;
          const companyName = pickCompanyName(p.clients);
          const current = byClientId.get(clientId);
          byClientId.set(clientId, {
            id: clientId,
            companyName,
            activeProjectsCount: (current?.activeProjectsCount ?? 0) + 1,
          });
        }
        return Array.from(byClientId.values()).sort((a, b) =>
          a.companyName.localeCompare(b.companyName),
        );
      })();

  void timeLogsError;

  return {
    activeProjects: activeProjectsList,
    activeClients,
  };
}

export const getActiveHomePanelsData = cache(fetchActiveHomePanelsData);

export async function getHomeStatCardsData(): Promise<
  Pick<
    HomeDashboardData,
    "teamMembersCount" | "hoursLogged" | "activeProjectsCount" | "activeClientsCount"
  >
> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { count: teamMembersCount, error: teamMembersError },
    { data: timeLogs, error: timeLogsError },
    { data: projects, error: projectsError },
  ] = await Promise.all([
    supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("time_logs").select("project_id, duration_minutes"),
    supabase.from("projects").select("id, status, client_id"),
  ]);

  const totalMinutes =
    timeLogsError || !timeLogs
      ? null
      : timeLogs.reduce((sum, row) => sum + Number(row.duration_minutes ?? 0), 0);

  let activeProjectsCount: number | null = null;
  let activeClientsCount: number | null = null;

  if (!projectsError && projects) {
    const activeClientIds = new Set<string>();
    let activeCount = 0;

    for (const project of projects) {
      if (!isActiveHomeProject(project.status)) continue;
      activeCount += 1;
      if (project.client_id) {
        activeClientIds.add(project.client_id);
      }
    }

    activeProjectsCount = activeCount;
    activeClientsCount = activeClientIds.size;
  }

  return {
    teamMembersCount: teamMembersError || teamMembersCount === null ? null : teamMembersCount,
    hoursLogged: totalMinutes === null ? null : totalMinutes / 60,
    activeProjectsCount,
    activeClientsCount,
  };
}

/** @deprecated Use getHomeStatCardsData + getActiveHomePanelsData */
export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const [stats, panels] = await Promise.all([getHomeStatCardsData(), getActiveHomePanelsData()]);

  return {
    ...stats,
    ...panels,
  };
}

