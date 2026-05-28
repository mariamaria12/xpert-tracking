import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { cookies } from "next/headers";

import type { TimesheetRow } from "./columns";
import { formatHoursMinutes } from "../people/formatDuration";
import { getTimesheetStatusDisplay } from "./timesheetStatus";

type NestedName =
  | { first_name?: string | null; last_name?: string | null; name?: string | null }
  | { first_name?: string | null; last_name?: string | null; name?: string | null }[]
  | null;

type EmployeeName = { first_name?: string | null; last_name?: string | null };
type ProjectName = { name?: string | null };

type TimeLogDbRow = {
  id: string;
  employee_id: string;
  project_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  activity: string | null;
  notes: string | null;
  employees?: NestedName;
  projects?: NestedName;
};

function pickNested<T extends Record<string, unknown>>(
  value: NestedName,
  format: (item: T) => string,
): string | null {
  if (!value) return null;
  const item = (Array.isArray(value) ? value[0] : value) as T | undefined;
  if (!item) return null;
  return format(item);
}

function formatEmployeeName(value: NestedName) {
  return pickNested<EmployeeName>(value, (emp) => {
    const first = emp.first_name?.trim() ?? "";
    const last = emp.last_name?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || "—";
  });
}

function formatProjectName(value: NestedName) {
  return pickNested<ProjectName>(value, (project) => project.name?.trim() || "—");
}

export type TimesheetRowsResult =
  | { rows: TimesheetRow[]; error?: undefined }
  | { rows: TimesheetRow[]; error: string };

export async function getTimesheetRows(): Promise<TimesheetRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const referenceDate = new Date();

  const { data: timeLogs, error } = await supabase
    .from("time_logs")
    .select(
      "id, employee_id, project_id, started_at, ended_at, duration_minutes, activity, notes, employees(first_name, last_name), projects(name)",
    )
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Failed to load time logs:", error);
    return { rows: [], error: error.message };
  }

  const rows: TimesheetRow[] = ((timeLogs ?? []) as TimeLogDbRow[]).map((log) => {
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
      employeeName: formatEmployeeName(log.employees ?? null) ?? "—",
      projectName: formatProjectName(log.projects ?? null) ?? "—",
      dateLabel: Number.isNaN(startedAt.getTime())
        ? "—"
        : formatDate(startedAt),
      hoursLabel: hours === null ? "—" : formatHoursMinutes(hours),
      status: statusDisplay,
      activity: log.activity,
      notes: log.notes,
      startedAtLabel: Number.isNaN(startedAt.getTime())
        ? "—"
        : startedAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
