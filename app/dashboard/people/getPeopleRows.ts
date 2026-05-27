import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

import type { PeopleRow } from "./columns";
import { getHoursWeekDisplay } from "./hoursWeekDisplay";
import { getLastLogDisplay } from "./lastLogDisplay";

type TimeLogRow = {
  employee_id: string;
  duration_minutes: number | null;
  project_id: string;
  projects?: { name: string | null } | { name: string | null }[] | null;
  started_at?: string | null;
};

type EmployeeRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
};

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

export type PeopleRowsResult =
  | { rows: PeopleRow[]; error?: undefined }
  | { rows: PeopleRow[]; error: string };

export async function getPeopleRows(): Promise<PeopleRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("id, first_name, last_name, email, phone, role");


  if (employeesError) {
    console.error("Failed to load employees:", employeesError);
    return { rows: [], error: employeesError.message };
  }

  const { weekStart, weekEnd } = getCurrentWeekRange();

  const { data: timeLogs, error: timeLogsError } = await supabase
    .from("time_logs")
    .select("employee_id, duration_minutes, project_id, projects(name)")
    .gte("started_at", weekStart.toISOString())
    .lt("started_at", weekEnd.toISOString());

  if (timeLogsError) {
    console.error("Failed to load time logs:", timeLogsError);
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

  const employeeIds = ((employees ?? []) as EmployeeRow[]).map((e) => String(e.id));
  const lastLogAtByEmployee = new Map<string, string>();

  if (employeeIds.length > 0) {
    const { data: lastLogs, error: lastLogsError } = await supabase
      .from("time_logs")
      .select("employee_id, started_at")
      .in("employee_id", employeeIds)
      .order("started_at", { ascending: false })
      .limit(5000);

    if (lastLogsError) {
      console.error("Failed to load last logs:", lastLogsError);
    } else {
      for (const row of (lastLogs ?? []) as { employee_id: string; started_at: string }[]) {
        if (!row.employee_id || !row.started_at) continue;
        if (!lastLogAtByEmployee.has(row.employee_id)) {
          lastLogAtByEmployee.set(row.employee_id, row.started_at);
        }
      }
    }
  }

  const now = new Date();

  const rows: PeopleRow[] = ((employees ?? []) as EmployeeRow[]).map((emp) => {
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
      lastLog: getLastLogDisplay(
        lastLogAtByEmployee.get(employeeId) ?? null,
        now,
      ),
      hoursWeek: getHoursWeekDisplay(
        totalMinutes > 0 ? totalMinutes / 60 : 0,
        now,
      ),
    };
  });

  return { rows };
}
