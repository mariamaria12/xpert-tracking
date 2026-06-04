import { cookies } from "next/headers";

import { insertErrorMessage } from "@/lib/auth/insertErrors";
import { resolveCreatedByUserId } from "@/lib/auth/supabaseAuth";
import { createClient } from "@/lib/supabase/server";

import { parseDueDate, parseEstimatedHours } from "./projects.schema";

import type {
  ProjectCreateInput,
  ProjectRow,
  ProjectRowsResult,
  ProjectUpdateInput,
} from "./projects.types";
import type { Database } from "@/lib/types/database";

type ProjectTimeLogEmbed = Pick<
  Database["public"]["Tables"]["time_logs"]["Row"],
  "employee_id" | "duration_minutes"
>;

type ProjectDbRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  "id" | "name" | "client_id" | "status" | "estimated_hours" | "due_date" | "description"
> & {
  client?: { company_name: string | null } | { company_name: string | null }[] | null;
  time_logs?: ProjectTimeLogEmbed[] | null;
};

function pickCompanyName(value: ProjectDbRow["client"]) {
  if (!value) {
    return "—";
  }
  const item = Array.isArray(value) ? value[0] : value;
  return item?.company_name?.trim() || "—";
}

function aggregateTimeLogs(logs: ProjectTimeLogEmbed[] | null | undefined) {
  let totalMinutes = 0;
  const workers = new Set<string>();

  for (const log of logs ?? []) {
    totalMinutes += Number(log.duration_minutes ?? 0);
    if (log.employee_id) {
      workers.add(log.employee_id);
    }
  }

  return { totalMinutes, workerCount: workers.size };
}

function toNullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

export async function getProjectRows(): Promise<ProjectRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: projects, error } = await supabase.from("projects").select(
    `
      id,
      name,
      client_id,
      status,
      estimated_hours,
      due_date,
      description,
      client:clients(company_name),
      time_logs(duration_minutes, employee_id)
    `
  );

  if (error) {
    console.error("Failed to load projects:", error);
    return { rows: [], error: error.message };
  }

  const rows: ProjectRow[] = ((projects ?? []) as ProjectDbRow[]).map((p) => {
    const { totalMinutes, workerCount } = aggregateTimeLogs(p.time_logs);

    return {
      id: p.id,
      name: p.name,
      clientId: p.client_id,
      companyName: pickCompanyName(p.client),
      estimatedHours: p.estimated_hours === null ? null : Number(p.estimated_hours),
      actualHours: totalMinutes / 60,
      workers: workerCount,
      status: p.status,
      dueDate: p.due_date ? new Date(p.due_date) : null,
      dueDateIso: p.due_date,
      description: p.description,
    };
  });

  return { rows };
}

export async function createProjectRecord({ input }: { input: ProjectCreateInput }): Promise<{
  error?: string;
  validationErrors?: { estimatedHours?: string[]; dueDate?: string[] };
}> {
  const estimated = parseEstimatedHours(input.estimatedHours);
  const due = parseDueDate(input.dueDate);

  if (input.estimatedHours?.trim() && estimated === null) {
    return { validationErrors: { estimatedHours: ["Enter a valid number."] } };
  }
  if (input.dueDate?.trim() && due === null) {
    return { validationErrors: { dueDate: ["Enter a valid date."] } };
  }

  const createdBy = await resolveCreatedByUserId();
  if ("error" in createdBy) {
    return { error: createdBy.error };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("projects").insert({
    name: input.name,
    client_id: input.clientId,
    status: input.status,
    estimated_hours: estimated,
    due_date: due,
    description: toNullIfEmpty(input.description),
    created_by: createdBy.userId,
  } satisfies Database["public"]["Tables"]["projects"]["Insert"]);

  if (error) {
    console.error("Failed to create project:", error);
    return { error: insertErrorMessage(error) };
  }

  return {};
}

export async function updateProjectRecord({ input }: { input: ProjectUpdateInput }): Promise<{
  error?: string;
  validationErrors?: { estimatedHours?: string[]; dueDate?: string[] };
}> {
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
