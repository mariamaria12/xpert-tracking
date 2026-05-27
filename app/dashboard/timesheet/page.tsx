import TimesheetTable from "./TimesheetTable";
import { getTimesheetRows } from "./getTimesheetRows";
import AddTimesheetDialog from "./AddTimesheetDialog";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type EmployeeDbRow = { id: string; first_name: string; last_name: string };
type ProjectDbRow = { id: string; name: string; status: string | null };

export default async function TimesheetPage() {
  const { rows, error } = await getTimesheetRows();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: employees }, { data: projects }] = await Promise.all([
    supabase.from("employees").select("id, first_name, last_name").order("last_name"),
    supabase.from("projects").select("id, name, status").order("name"),
  ]);

  const employeeOptions =
    ((employees ?? []) as EmployeeDbRow[]).map((e) => ({
      id: String(e.id),
      label: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim() || "—",
    })) ?? [];

  const projectOptionsRaw =
    ((projects ?? []) as ProjectDbRow[]).map((p) => ({
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

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Timesheet</h1>
        <AddTimesheetDialog employees={employeeOptions} projects={projectOptions} />
      </div>
      <TimesheetTable
        rows={rows}
        error={error}
        employees={employeeOptions}
        projects={projectOptions}
      />
    </div>
  );
}
