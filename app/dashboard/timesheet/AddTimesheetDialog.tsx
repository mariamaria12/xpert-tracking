"use client";

import { Plus } from "lucide-react";

import { createTimesheet } from "./actions";
import { useTimesheetFormDialog } from "./useTimesheetFormDialog";

import type { EmployeeOption, ProjectOption } from "@/lib/services/timesheet/timesheet.types";

export default function AddTimesheetDialog({
  employees,
  projects,
}: {
  employees: EmployeeOption[];
  projects: ProjectOption[];
}) {
  const { openDialog, dialog } = useTimesheetFormDialog({
    title: "Add timesheet",
    description: "Log work time for an employee.",
    submitLabel: "Add timesheet",
    employees,
    projects,
    action: createTimesheet,
    resetOnClose: true,
    resetOnSuccess: true,
  });

  return (
    <>
      <button
        type="button"
        className="btn-accent inline-flex items-center gap-2"
        onClick={openDialog}
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add timesheet
      </button>
      {dialog}
    </>
  );
}
