"use client";

import { Plus } from "lucide-react";

import { createProject } from "./actions";
import { useProjectFormDialog } from "./useProjectFormDialog";

import type { ClientOption } from "@/lib/services/projects/projects.types";

export default function AddProjectDialog({ clients }: { clients: ClientOption[] }) {
  const { openDialog, dialog } = useProjectFormDialog({
    title: "Add project",
    description: "Create a new project.",
    submitLabel: "Add project",
    clients,
    action: createProject,
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
        Add project
      </button>
      {dialog}
    </>
  );
}
