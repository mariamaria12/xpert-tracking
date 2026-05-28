import TimesheetTable from "./TimesheetTable";
import { getTimesheetRows } from "./getTimesheetRows";
import AddTimesheetDialog from "./AddTimesheetDialog";
import { getTimesheetPickerOptions } from "@/lib/services/timesheet/timesheet.service";

export default async function TimesheetPage() {
  const { rows, error } = await getTimesheetRows();
  const { employees: employeeOptions, projects: projectOptions } =
    await getTimesheetPickerOptions();

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
