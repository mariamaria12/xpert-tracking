"use client";

import { Plus } from "lucide-react";

import { createEmployee } from "./actions";
import { useEmployeeFormDialog } from "./useEmployeeFormDialog";

export default function AddEmployeeDialog() {
  const { openDialog, dialog } = useEmployeeFormDialog({
    title: "Add employee",
    description: "Add a team member to your organization.",
    submitLabel: "Add employee",
    action: createEmployee,
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
        Add people
      </button>
      {dialog}
    </>
  );
}
