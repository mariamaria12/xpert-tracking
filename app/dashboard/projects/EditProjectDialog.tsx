"use client";

import { Pencil } from "lucide-react";

import { updateProject } from "./actions";
import { projectFormValuesFromRow } from "./ProjectFormFields";
import { useProjectFormDialog } from "./useProjectFormDialog";

import type { ClientOption, ProjectRow } from "@/lib/services/projects/projects.types";

export default function EditProjectDialog({
  row,
  clients,
}: {
  row: ProjectRow;
  clients: ClientOption[];
}) {
  const { openDialog, dialog } = useProjectFormDialog({
    title: "Edit project",
    description: "Update this project.",
    submitLabel: "Save changes",
    clients,
    action: updateProject,
    idPrefix: row.id,
    values: projectFormValuesFromRow(row),
    prepareFormOnOpen: true,
    extraHiddenFields: <input type="hidden" name="id" value={row.id} />,
  });

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        aria-label={`Edit ${row.name}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
      {dialog}
    </>
  );
}
