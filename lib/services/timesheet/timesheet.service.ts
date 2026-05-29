import { cookies } from "next/headers";

import type { Database } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

import { formatHoursMinutes } from "@/dashboard/people/formatDuration";
import { getTimesheetStatusDisplay } from "@/dashboard/timesheet/timesheetStatus";

import { computeDurationMinutes, parseDateTimeLocal } from "./timesheet.schema";
import type {
  EmployeeOption,
  ProjectOption,
  TimesheetCreateInput,
  TimesheetRow,
  TimesheetRowsResult,
  TimesheetUpdateInput,
} from "./timesheet.types";

type NestedName =
  | { first_name?: string | null; last_name?: string | null; name?: string | null }
  | { first_name?: string | null; last_name?: string | null; name?: string | null }[]
  | null;

type TimeLogJoinedRow = Pick<
  Database["public"]["Tables"]["time_logs"]["Row"],
  | "id"
  | "employee_id"
  | "project_id"
  | "started_at"
  | "ended_at"
  | "duration_minutes"
  | "activity"
  | "notes"
> & {
  employee?: NestedName;
  project?: NestedName;
};

function toNullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

function pickNested<T extends Record<string, unknown>>(
  value: NestedName,
  format: (item: T) => string,
): string {
  if (!value) return "—";
  const item = (Array.isArray(value) ? value[0] : value) as T | undefined;
  if (!item) return "—";
  return format(item);
}

function formatEmployeeName(value: NestedName) {
  return pickNested<{ first_name?: string | null; last_name?: string | null }>(value, (emp) => {
    const full = `${emp.first_name?.trim() ?? ""} ${emp.last_name?.trim() ?? ""}`.trim();
    return full || "—";
  });
}

function formatProjectName(value: NestedName) {
  return pickNested<{ name?: string | null }>(value, (project) => project.name?.trim() || "—");
}

export async function getTimesheetRows(): Promise<TimesheetRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const referenceDate = new Date();

  const { data: timeLogs, error } = await supabase
    .from("time_logs")
    .select(
      `
      id,
      employee_id,
      project_id,
      started_at,
      ended_at,
      duration_minutes,
      activity,
      notes,
      employee:employees(first_name, last_name),
      project:projects(name)
    `,
    )
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Failed to load time logs:", error);
    return { rows: [], error: error.message };
  }

  const rows: TimesheetRow[] = ((timeLogs ?? []) as TimeLogJoinedRow[]).map((log) => {
    const startedAt = new Date(log.started_at);
    const endedAt = log.ended_at ? new Date(log.ended_at) : null;

    const statusDisplay =
      getTimesheetStatusDisplay(log.started_at, log.ended_at, referenceDate) ?? {
        status: "InProgress" as const,
        label: "In progress",
      };

    let durationMinutes: number | null =
      log.duration_minutes === null || log.duration_minutes === undefined
        ? null
        : Number(log.duration_minutes);

    if (durationMinutes === null) {
      if (!Number.isNaN(startedAt.getTime()) && endedAt && !Number.isNaN(endedAt.getTime())) {
        durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
      }
    }

    if (statusDisplay.status === "InProgress") {
      if (!Number.isNaN(startedAt.getTime())) {
        durationMinutes = Math.max(
          0,
          Math.round((referenceDate.getTime() - startedAt.getTime()) / 60000),
        );
      }
    }

    const hours = durationMinutes === null ? null : durationMinutes / 60;

    return {
      id: log.id,
      employeeId: log.employee_id,
      projectId: log.project_id,
      employeeName: formatEmployeeName(log.employee ?? null),
      projectName: formatProjectName(log.project ?? null),
      dateLabel: Number.isNaN(startedAt.getTime()) ? "—" : formatDate(startedAt),
      hoursLabel: hours === null ? "—" : formatHoursMinutes(hours),
      status: statusDisplay,
      activity: log.activity,
      notes: log.notes,
      startedAtLabel: Number.isNaN(startedAt.getTime())
        ? "—"
        : startedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      endedAtLabel: log.ended_at
        ? new Date(log.ended_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
      startedAtIso: log.started_at,
      endedAtIso: log.ended_at,
    };
  });

  return { rows };
}

export async function getTimesheetPageData(): Promise<
  TimesheetRowsResult & {
    employees: EmployeeOption[];
    projects: ProjectOption[];
  }
> {
  const [rowsResult, pickerOptions] = await Promise.all([
    getTimesheetRows(),
    getTimesheetPickerOptions(),
  ]);

  return {
    ...rowsResult,
    employees: pickerOptions.employees,
    projects: pickerOptions.projects,
  };
}

export async function getTimesheetPickerOptions(): Promise<{
  employees: EmployeeOption[];
  projects: ProjectOption[];
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: employees }, { data: projects }] = await Promise.all([
    supabase
      .from("employees")
      .select("id, first_name, last_name")
      .order("last_name", { ascending: true }),
    supabase.from("projects").select("id, name, status").order("name", { ascending: true }),
  ]);

  const employeeOptions =
    ((employees ?? []) as Pick<
      Database["public"]["Tables"]["employees"]["Row"],
      "id" | "first_name" | "last_name"
    >[]).map((e) => ({
      id: String(e.id),
      label: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim() || "—",
    })) ?? [];

  const projectOptionsRaw =
    ((projects ?? []) as Pick<
      Database["public"]["Tables"]["projects"]["Row"],
      "id" | "name" | "status"
    >[]).map((p) => ({
      id: String(p.id),
      label: String(p.name ?? "—"),
      status: p.status ? String(p.status) : null,
    })) ?? [];

  const projectOptions = [...projectOptionsRaw].sort((a, b) => {
    const aCompleted = (a.status ?? "").toLowerCase() === "completed";
    const bCompleted = (b.status ?? "").toLowerCase() === "completed";
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    return a.label.localeCompare(b.label);
  });

  return { employees: employeeOptions, projects: projectOptions };
}

export async function createTimesheetRecord({
  input,
  createdBy,
}: {
  input: TimesheetCreateInput;
  createdBy?: string | null;
}): Promise<{ error?: string; validationErrors?: { startedAt?: string[]; endedAt?: string[] } }> {
  const started = parseDateTimeLocal(input.startedAt);
  const ended = input.endedAt ? parseDateTimeLocal(input.endedAt) : null;

  if (!started) {
    return { validationErrors: { startedAt: ["Enter a valid start time."] } };
  }
  if (input.endedAt && !ended) {
    return { validationErrors: { endedAt: ["Enter a valid end time."] } };
  }

  const durationMinutes = ended ? computeDurationMinutes(started, ended) : null;

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
    return { error: "You must be signed in to add time logs." };
  }

  const { error } = await supabase.from("time_logs").insert({
    employee_id: input.employeeId,
    project_id: input.projectId,
    started_at: started.toISOString(),
    ended_at: ended ? ended.toISOString() : null,
    duration_minutes: durationMinutes,
    activity: toNullIfEmpty(input.activity),
    notes: toNullIfEmpty(input.notes),
    created_by: resolvedUserId,
  } satisfies Database["public"]["Tables"]["time_logs"]["Insert"]);

  if (error) {
    console.error("Failed to create time log:", error);
    return { error: error.message };
  }

  return {};
}

export async function updateTimesheetRecord({
  input,
}: {
  input: TimesheetUpdateInput;
}): Promise<{ error?: string; validationErrors?: { startedAt?: string[]; endedAt?: string[] } }> {
  const started = parseDateTimeLocal(input.startedAt);
  const ended = input.endedAt ? parseDateTimeLocal(input.endedAt) : null;

  if (!started) {
    return { validationErrors: { startedAt: ["Enter a valid start time."] } };
  }
  if (input.endedAt && !ended) {
    return { validationErrors: { endedAt: ["Enter a valid end time."] } };
  }

  const durationMinutes = ended ? computeDurationMinutes(started, ended) : null;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("time_logs")
    .update({
      employee_id: input.employeeId,
      project_id: input.projectId,
      started_at: started.toISOString(),
      ended_at: ended ? ended.toISOString() : null,
      duration_minutes: durationMinutes,
      activity: toNullIfEmpty(input.activity),
      notes: toNullIfEmpty(input.notes),
    } satisfies Database["public"]["Tables"]["time_logs"]["Update"])
    .eq("id", input.id);

  if (error) {
    console.error("Failed to update time log:", error);
    return { error: error.message };
  }

  return {};
}

