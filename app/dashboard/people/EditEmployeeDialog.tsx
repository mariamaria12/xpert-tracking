"use client";

import { Pencil } from "lucide-react";

import { updateEmployee } from "./actions";
import { employeeFormValuesFromRow } from "./EmployeeFormFields";
import { useEmployeeFormDialog } from "./useEmployeeFormDialog";

import type { PeopleRow } from "@/lib/services/people/people.types";

export default function EditEmployeeDialog({ row }: { row: PeopleRow }) {
  const employeeName = `${row.firstName} ${row.lastName}`.trim();
  const { openDialog, dialog } = useEmployeeFormDialog({
    title: "Edit employee",
    description: "Update this team member's details.",
    submitLabel: "Save changes",
    action: updateEmployee,
    idPrefix: row.id,
    values: employeeFormValuesFromRow(row),
    prepareFormOnOpen: true,
    hiddenFields: <input type="hidden" name="id" value={row.id} />,
  });

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        aria-label={`Edit ${employeeName}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
      {dialog}
    </>
  );
}
