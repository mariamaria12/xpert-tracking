"use client";

import { useActionState, useCallback, useEffect, useRef, type ReactNode } from "react";

import { formDialogClassName } from "@/ui/forms/formClasses";

import ClientFormFields from "./ClientFormFields";

import type { ClientFormValues } from "./ClientFormFields";
import type { ClientFormState } from "@/lib/services/client/clients.types";

type UseClientFormDialogOptions = {
  title: string;
  description: string;
  submitLabel: string;
  action: (prevState: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  idPrefix?: string;
  values?: ClientFormValues;
  hiddenFields?: ReactNode;
  resetOnClose?: boolean;
  resetOnSuccess?: boolean;
  prepareFormOnOpen?: boolean;
};

export type UseClientFormDialogResult = {
  openDialog: () => void;
  closeDialog: () => void;
  dialog: ReactNode;
  isPending: boolean;
};

export function useClientFormDialog({
  title,
  description,
  submitLabel,
  action,
  idPrefix,
  values,
  hiddenFields,
  resetOnClose = false,
  resetOnSuccess = false,
  prepareFormOnOpen = false,
}: UseClientFormDialogOptions): UseClientFormDialogResult {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<ClientFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) {
      if (resetOnSuccess) {
        formRef.current?.reset();
      }
      dialogRef.current?.close();
    }
  }, [state?.success, resetOnSuccess]);

  const openDialog = useCallback(() => {
    if (prepareFormOnOpen) {
      formRef.current?.reset();
    }
    dialogRef.current?.showModal();
  }, [prepareFormOnOpen]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const dialog = (
    <dialog
      ref={dialogRef}
      className={formDialogClassName}
      onClose={resetOnClose ? () => formRef.current?.reset() : undefined}
    >
      <form ref={formRef} action={formAction} className="p-6">
        {hiddenFields}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-white/50">{description}</p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-lg px-2 py-1 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ClientFormFields idPrefix={idPrefix} errors={state?.errors} values={values} />

        {state?.message ? <p className="mt-4 text-sm text-red-400">{state.message}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-lg px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#22D3EE] px-4 py-2 text-sm font-semibold text-[#0B1220] transition hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );

  return { openDialog, closeDialog, dialog, isPending };
}
