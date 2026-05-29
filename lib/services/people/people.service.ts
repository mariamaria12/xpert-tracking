import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

import { getHoursWeekDisplay } from "@/dashboard/people/hoursWeekDisplay";
import { getLastLogDisplay } from "@/dashboard/people/lastLogDisplay";

import type {
  EmployeeCreateInput,
  EmployeeUpdateInput,
  PeopleRow,
  PeopleRowsResult,
} from "./people.types";

type TimeLogRow = {
  employee_id: Database["public"]["Tables"]["time_logs"]["Row"]["employee_id"];
  duration_minutes: Database["public"]["Tables"]["time_logs"]["Row"]["duration_minutes"];
  project_id: Database["public"]["Tables"]["time_logs"]["Row"]["project_id"];
  projects?: { name: string | null } | { name: string | null }[] | null;
  started_at?: string | null;
};

type EmployeeDbRow = Pick<
  Database["public"]["Tables"]["employees"]["Row"],
  "id" | "first_name" | "last_name" | "email" | "phone" | "role"
>;

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

type EmployeeLastLogRow = {
  employee_id: string;
  started_at: string;
};

export async function getPeopleRows(): Promise<PeopleRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { weekStart, weekEnd } = getCurrentWeekRange();

  const [
    { data: employees, error: employeesError },
    { data: timeLogs, error: timeLogsError },
    { data: lastLogs, error: lastLogsError },
  ] = await Promise.all([
    supabase
      .from("employees")
      .select("id, first_name, last_name, email, phone, role")
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true }),
    supabase
      .from("time_logs")
      .select("employee_id, duration_minutes, project_id, projects(name)")
      .gte("started_at", weekStart.toISOString())
      .lt("started_at", weekEnd.toISOString()),
    supabase.rpc("get_employee_last_logs"),
  ]);

  if (employeesError) {
    console.error("Failed to load employees:", employeesError);
    return { rows: [], error: employeesError.message };
  }

  if (timeLogsError) {
    console.error("Failed to load time logs:", timeLogsError);
  }

  if (lastLogsError) {
    console.error("Failed to load last logs:", lastLogsError);
  }

  const logs = (timeLogs ?? []) as TimeLogRow[];

  const totalMinutesByEmployee = new Map<string, number>();
  const projectMinutesByEmployee = new Map<string, Map<string, number>>();

  for (const log of logs) {
    const employeeId = log.employee_id;
    const minutes = Number(log.duration_minutes ?? 0);

    totalMinutesByEmployee.set(
      employeeId,
      (totalMinutesByEmployee.get(employeeId) ?? 0) + minutes,
    );

    const projects = log.projects ?? null;
    const projectName = Array.isArray(projects)
      ? (projects[0]?.name ?? null)
      : (projects?.name ?? null);

    if (!projectName) continue;

    let perProject = projectMinutesByEmployee.get(employeeId);
    if (!perProject) {
      perProject = new Map<string, number>();
      projectMinutesByEmployee.set(employeeId, perProject);
    }

    perProject.set(projectName, (perProject.get(projectName) ?? 0) + minutes);
  }

  const lastLogAtByEmployee = new Map<string, string>();
  for (const row of (lastLogs ?? []) as EmployeeLastLogRow[]) {
    if (!row.employee_id || !row.started_at) continue;
    lastLogAtByEmployee.set(row.employee_id, row.started_at);
  }

  const now = new Date();

  const rows: PeopleRow[] = ((employees ?? []) as EmployeeDbRow[]).map((emp) => {
    const employeeId = String(emp.id);
    const totalMinutes = totalMinutesByEmployee.get(employeeId) ?? 0;

    const perProject = projectMinutesByEmployee.get(employeeId);
    let assignedProject: string | null = null;

    if (perProject && perProject.size > 0) {
      let bestName: string | null = null;
      let bestMinutes = -1;
      for (const [name, mins] of perProject.entries()) {
        if (mins > bestMinutes) {
          bestMinutes = mins;
          bestName = name;
        }
      }
      assignedProject = bestName;
    }

    return {
      id: employeeId,
      firstName: String(emp.first_name ?? ""),
      lastName: String(emp.last_name ?? ""),
      email: emp.email ? String(emp.email) : null,
      phone: emp.phone ? String(emp.phone) : null,
      role: emp.role ? String(emp.role) : null,
      assignedProject,
      lastLog: getLastLogDisplay(lastLogAtByEmployee.get(employeeId) ?? null, now),
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

