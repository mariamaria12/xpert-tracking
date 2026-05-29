import { getTimesheetPageData } from "@/lib/services/timesheet/timesheet.service";

import AddTimesheetDialog from "./AddTimesheetDialog";
import TimesheetTable from "./TimesheetTable";

export default async function TimesheetPage() {
  const {
    rows,
    error,
    employees: employeeOptions,
    projects: projectOptions,
  } = await getTimesheetPageData();

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
