import { cookies } from "next/headers";

import type { Database } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";

import { parseDueDate, parseEstimatedHours } from "./projects.schema";
import type {
  ProjectCreateInput,
  ProjectRow,
  ProjectRowsResult,
  ProjectUpdateInput,
} from "./projects.types";

type ProjectDbRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "id"
  | "name"
  | "client_id"
  | "status"
  | "estimated_hours"
  | "due_date"
  | "description"
> & {
  clients?: { company_name: string | null } | { company_name: string | null }[] | null;
};

type TimeLogDbRow = Pick<
  Database["public"]["Tables"]["time_logs"]["Row"],
  "project_id" | "employee_id" | "duration_minutes" | "started_at" | "ended_at"
>;

function pickCompanyName(value: ProjectDbRow["clients"]) {
  if (!value) return "—";
  const item = Array.isArray(value) ? value[0] : value;
  return item?.company_name?.trim() || "—";
}

function toNullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

export async function getProjectRows(): Promise<ProjectRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: projects, error: projectsError }, { data: timeLogs, error: timeLogsError }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id, name, client_id, status, estimated_hours, due_date, description, clients(company_name)")
        .order("name", { ascending: true }),
      supabase.from("time_logs").select("project_id, employee_id, duration_minutes, started_at, ended_at"),
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

export async function createProjectRecord({
  input,
  createdBy,
}: {
  input: ProjectCreateInput;
  createdBy?: string | null;
}): Promise<{ error?: string; validationErrors?: { estimatedHours?: string[]; dueDate?: string[] } }> {
  const estimated = parseEstimatedHours(input.estimatedHours);
  const due = parseDueDate(input.dueDate);

  if (input.estimatedHours?.trim() && estimated === null) {
    return { validationErrors: { estimatedHours: ["Enter a valid number."] } };
  }
  if (input.dueDate?.trim() && due === null) {
    return { validationErrors: { dueDate: ["Enter a valid date."] } };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let resolvedUserId = createdBy ?? null;
  if (!resolvedUserId) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Failed to resolve user:", error);
    }
    resolvedUserId = user?.id ?? null;
  }

  if (!resolvedUserId) {
    return { error: "You must be signed in to add projects." };
  }

  const { error } = await supabase.from("projects").insert({
    name: input.name,
    client_id: input.clientId,
    status: input.status,
    estimated_hours: estimated,
    due_date: due,
    description: toNullIfEmpty(input.description),
    created_by: resolvedUserId,
  } satisfies Database["public"]["Tables"]["projects"]["Insert"]);

  if (error) {
    console.error("Failed to create project:", error);
    return { error: error.message };
  }

  return {};
}

export async function updateProjectRecord({
  input,
}: {
  input: ProjectUpdateInput;
}): Promise<{ error?: string; validationErrors?: { estimatedHours?: string[]; dueDate?: string[] } }> {
  const estimated = parseEstimatedHours(input.estimatedHours);
  const due = parseDueDate(input.dueDate);

  if (input.estimatedHours?.trim() && estimated === null) {
    return { validationErrors: { estimatedHours: ["Enter a valid number."] } };
  }
  if (input.dueDate?.trim() && due === null) {
    return { validationErrors: { dueDate: ["Enter a valid date."] } };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("projects")
    .update({
      name: input.name,
      client_id: input.clientId,
      status: input.status,
      estimated_hours: estimated,
      due_date: due,
      description: toNullIfEmpty(input.description),
    } satisfies Database["public"]["Tables"]["projects"]["Update"])
    .eq("id", input.id);

  if (error) {
    console.error("Failed to update project:", error);
    return { error: error.message };
  }

  return {};
}

