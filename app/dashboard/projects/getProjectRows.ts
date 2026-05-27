import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

import type { ProjectRow } from "./columns";

type ProjectDbRow = {
  id: string;
  name: string;
  client_id: string;
  status: string;
  estimated_hours: number | null;
  due_date: string | null;
  description: string | null;
  clients?: { company_name: string | null } | { company_name: string | null }[] | null;
};

type TimeLogDbRow = {
  project_id: string;
  employee_id: string;
  duration_minutes: number | null;
  started_at: string;
  ended_at: string | null;
};

function pickCompanyName(value: ProjectDbRow["clients"]) {
  if (!value) return "—";
  const item = Array.isArray(value) ? value[0] : value;
  return item?.company_name?.trim() || "—";
}

export type ProjectRowsResult =
  | { rows: ProjectRow[]; error?: undefined }
  | { rows: ProjectRow[]; error: string };

export async function getProjectRows(): Promise<ProjectRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: projects, error: projectsError }, { data: timeLogs, error: timeLogsError }] =
    await Promise.all([
      supabase
        .from("projects")
        .select(
          "id, name, client_id, status, estimated_hours, due_date, description, clients(company_name)",
        )
        .order("name", { ascending: true }),
      supabase
        .from("time_logs")
        .select("project_id, employee_id, duration_minutes, started_at, ended_at"),
    ]);

  if (projectsError) {
    console.error("Failed to load projects:", projectsError);
    return { rows: [], error: projectsError.message };
  }

  if (timeLogsError) {
    console.error("Failed to load time logs:", timeLogsError);
    // still render projects even if actual hours fail
  }

  const actualMinutesByProjectId = new Map<string, number>();
  const workersByProjectId = new Map<string, Set<string>>();

  for (const log of (timeLogs ?? []) as TimeLogDbRow[]) {
    const minutes = Number(log.duration_minutes ?? 0);
    actualMinutesByProjectId.set(
      log.project_id,
      (actualMinutesByProjectId.get(log.project_id) ?? 0) + minutes,
    );

    let workers = workersByProjectId.get(log.project_id);
    if (!workers) {
      workers = new Set<string>();
      workersByProjectId.set(log.project_id, workers);
    }
    workers.add(log.employee_id);
  }

  const rows: ProjectRow[] = ((projects ?? []) as ProjectDbRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    clientId: p.client_id,
    companyName: pickCompanyName(p.clients),
    estimatedHours: p.estimated_hours === null ? null : Number(p.estimated_hours),
    actualHours: (actualMinutesByProjectId.get(p.id) ?? 0) / 60,
    workers: workersByProjectId.get(p.id)?.size ?? 0,
    status: p.status,
    dueDate: p.due_date ? new Date(p.due_date) : null,
    dueDateIso: p.due_date,
    description: p.description,
  }));

  return { rows };
}

