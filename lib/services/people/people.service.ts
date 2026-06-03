import { cookies } from "next/headers";

import { getHoursWeekDisplay } from "@/dashboard/people/hoursWeekDisplay";
import { getLastLogDisplay } from "@/dashboard/people/lastLogDisplay";
import { createClient } from "@/lib/supabase/server";

import type {
  EmployeeCreateInput,
  EmployeeUpdateInput,
  PeopleRow,
  PeopleRowsResult,
} from "./people.types";
import type { Database } from "@/lib/types/database";

type EmployeeTimeLogEmbed = Pick<
  Database["public"]["Tables"]["time_logs"]["Row"],
  "duration_minutes" | "started_at"
> & {
  project?: { name: string | null } | { name: string | null }[] | null;
};

type EmployeeDbRow = Pick<
  Database["public"]["Tables"]["employees"]["Row"],
  "id" | "first_name" | "last_name" | "email" | "phone" | "role"
> & {
  time_logs?: EmployeeTimeLogEmbed[] | null;
};

function toNullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return { weekStart, weekEnd };
}

function pickProjectName(value: EmployeeTimeLogEmbed["project"]) {
  if (!value) {
    return null;
  }
  const item = Array.isArray(value) ? value[0] : value;
  return item?.name?.trim() || null;
}

function aggregateEmployeeTimeLogs(
  logs: EmployeeTimeLogEmbed[] | null | undefined,
  weekStart: Date,
  weekEnd: Date
) {
  let totalMinutes = 0;
  const projectMinutes = new Map<string, number>();
  let lastLogAt: string | null = null;

  for (const log of logs ?? []) {
    if (log.started_at && (!lastLogAt || log.started_at > lastLogAt)) {
      lastLogAt = log.started_at;
    }

    const started = new Date(log.started_at);
    if (Number.isNaN(started.getTime()) || started < weekStart || started >= weekEnd) {
      continue;
    }

    const minutes = Number(log.duration_minutes ?? 0);
    totalMinutes += minutes;

    const projectName = pickProjectName(log.project);
    if (!projectName) {
      continue;
    }

    projectMinutes.set(projectName, (projectMinutes.get(projectName) ?? 0) + minutes);
  }

  let assignedProject: string | null = null;
  let bestMinutes = -1;
  for (const [name, mins] of projectMinutes.entries()) {
    if (mins > bestMinutes) {
      bestMinutes = mins;
      assignedProject = name;
    }
  }

  return { totalMinutes, assignedProject, lastLogAt };
}

export async function getPeopleRows(): Promise<PeopleRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { weekStart, weekEnd } = getCurrentWeekRange();
  const now = new Date();

  const { data: employees, error } = await supabase
    .from("employees")
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      phone,
      role,
      time_logs(duration_minutes, started_at, project:projects(name))
    `
    )
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Failed to load employees:", error);
    return { rows: [], error: error.message };
  }

  const rows: PeopleRow[] = ((employees ?? []) as EmployeeDbRow[]).map((emp) => {
    const { totalMinutes, assignedProject, lastLogAt } = aggregateEmployeeTimeLogs(
      emp.time_logs,
      weekStart,
      weekEnd
    );

    return {
      id: String(emp.id),
      firstName: String(emp.first_name ?? ""),
      lastName: String(emp.last_name ?? ""),
      email: emp.email ? String(emp.email) : null,
      phone: emp.phone ? String(emp.phone) : null,
      role: emp.role ? String(emp.role) : null,
      assignedProject,
      lastLog: getLastLogDisplay(lastLogAt, now),
      hoursWeek: getHoursWeekDisplay(totalMinutes > 0 ? totalMinutes / 60 : 0, now),
    };
  });

  return { rows };
}

export async function createEmployeeRecord({
  input,
  createdBy,
}: {
  input: EmployeeCreateInput;
  createdBy?: string | null;
}): Promise<{ error?: string }> {
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
    return { error: "You must be signed in to add people." };
  }

  const { error } = await supabase.from("employees").insert({
    first_name: input.firstName,
    last_name: input.lastName,
    email: toNullIfEmpty(input.email),
    phone: toNullIfEmpty(input.phone),
    role: toNullIfEmpty(input.role),
    created_by: resolvedUserId,
  } satisfies Database["public"]["Tables"]["employees"]["Insert"]);

  if (error) {
    console.error("Failed to create employee:", error);
    return { error: error.message };
  }

  return {};
}

export async function updateEmployeeRecord({
  input,
}: {
  input: EmployeeUpdateInput;
}): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("employees")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      email: toNullIfEmpty(input.email),
      phone: toNullIfEmpty(input.phone),
      role: toNullIfEmpty(input.role),
    } satisfies Database["public"]["Tables"]["employees"]["Update"])
    .eq("id", input.id);

  if (error) {
    console.error("Failed to update employee:", error);
    return { error: error.message };
  }

  return {};
}
