"use client";

import { Pencil } from "lucide-react";

import { updateTimesheet } from "./actions";
import { timesheetFormValuesFromRow } from "./TimesheetFormFields";
import { useTimesheetFormDialog } from "./useTimesheetFormDialog";

import type {
  EmployeeOption,
  ProjectOption,
  TimesheetRow,
} from "@/lib/services/timesheet/timesheet.types";

export default function EditTimesheetDialog({
  row,
  employees,
  projects,
}: {
  row: TimesheetRow;
  employees: EmployeeOption[];
  projects: ProjectOption[];
}) {
  const { openDialog, dialog } = useTimesheetFormDialog({
    title: "Edit timesheet",
    description: "Update this time log.",
    submitLabel: "Save changes",
    employees,
    projects,
    action: updateTimesheet,
    idPrefix: row.id,
    values: timesheetFormValuesFromRow(row),
    prepareFormOnOpen: true,
    extraHiddenFields: <input type="hidden" name="id" value={row.id} />,
  });

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        aria-label={`Edit timesheet for ${row.employeeName}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
      {dialog}
    </>
  );
}
