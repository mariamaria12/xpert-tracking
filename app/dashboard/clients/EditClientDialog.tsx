"use client";

import { Pencil } from "lucide-react";

import { updateCompany } from "./actions";
import { clientFormValuesFromRow } from "./ClientFormFields";
import { useClientFormDialog } from "./useClientFormDialog";

import type { ClientRow } from "@/lib/services/client/clients.types";

export default function EditClientDialog({ row }: { row: ClientRow }) {
  const { openDialog, dialog } = useClientFormDialog({
    title: "Edit company",
    description: "Update this client company's details.",
    submitLabel: "Save changes",
    action: updateCompany,
    idPrefix: row.id,
    values: clientFormValuesFromRow(row),
    prepareFormOnOpen: true,
    hiddenFields: <input type="hidden" name="id" value={row.id} />,
  });

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        aria-label={`Edit ${row.companyName}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
      {dialog}
    </>
  );
}
