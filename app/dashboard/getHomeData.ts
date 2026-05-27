import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export type ActiveProjectSummary = {
  id: string;
  name: string;
  companyName: string;
  estimatedHours: number | null;
  actualHours: number;
  dueDate: Date | null;
};

type ActiveProjectDbRow = {
  id: string;
  name: string;
  estimated_hours: number | null;
  due_date: string | null;
  clients?: { company_name: string | null } | { company_name: string | null }[] | null;
};

type TimeLogDbRow = {
  project_id: string;
  duration_minutes: number | null;
};

function pickCompanyName(value: ActiveProjectDbRow["clients"]) {
  if (!value) return "—";
  const item = Array.isArray(value) ? value[0] : value;
  return item?.company_name?.trim() || "—";
}

export type HomeDashboardData = {
  teamMembersCount: number | null;
  hoursLogged: number | null;
  activeProjectsCount: number | null;
  activeProjects: ActiveProjectSummary[];
};

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { count: teamMembersCount, error: teamMembersError },
    { data: timeLogs, error: timeLogsError },
    { data: activeProjects, error: activeProjectsError },
  ] = await Promise.all([
    supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("time_logs").select("project_id, duration_minutes"),
    supabase
      .from("projects")
      .select("id, name, estimated_hours, due_date, clients(company_name)")
      .eq("status", "active")
      .order("due_date", { ascending: true }),
  ]);

  const actualMinutesByProjectId = new Map<string, number>();
  for (const log of (timeLogs ?? []) as TimeLogDbRow[]) {
    actualMinutesByProjectId.set(
      log.project_id,
      (actualMinutesByProjectId.get(log.project_id) ?? 0) +
        Number(log.duration_minutes ?? 0),
    );
  }

  const totalMinutes =
    timeLogsError || !timeLogs
      ? null
      : timeLogs.reduce((sum, row) => sum + Number(row.duration_minutes ?? 0), 0);

  const projects: ActiveProjectSummary[] = activeProjectsError
    ? []
    : ((activeProjects ?? []) as ActiveProjectDbRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    companyName: pickCompanyName(p.clients),
    estimatedHours:
      p.estimated_hours === null ? null : Number(p.estimated_hours),
    actualHours: (actualMinutesByProjectId.get(p.id) ?? 0) / 60,
    dueDate: p.due_date ? new Date(p.due_date) : null,
  }));

  return {
    teamMembersCount:
      teamMembersError || teamMembersCount === null ? null : teamMembersCount,
    hoursLogged: totalMinutes === null ? null : totalMinutes / 60,
    // Keep count in sync with the list below (same filter).
    activeProjectsCount: activeProjectsError ? null : projects.length,
    activeProjects: projects,
  };
}
