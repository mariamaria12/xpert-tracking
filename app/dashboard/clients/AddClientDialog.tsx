"use client";

import { Plus } from "lucide-react";

import { createCompany } from "./actions";
import { useClientFormDialog } from "./useClientFormDialog";

export default function AddClientDialog() {
  const { openDialog, dialog } = useClientFormDialog({
    title: "Add company",
    description: "Create a client company record.",
    submitLabel: "Add company",
    action: createCompany,
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
        Add company
      </button>
      {dialog}
    </>
  );
}
