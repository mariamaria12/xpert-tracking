"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { projectStatusOptions } from "@/lib/services/projects/projectStatuses";
import { formDialogClassName } from "@/ui/forms/formClasses";

import ProjectFormFields, { type ProjectFormValues } from "./ProjectFormFields";
import { initialProjectStatus, projectStatusOptionsForRow } from "./projectFormUtils";

import type { ClientOption, ProjectFormState } from "@/lib/services/projects/projects.types";

type UseProjectFormDialogOptions = {
  title: string;
  description: string;
  submitLabel: string;
  clients: ClientOption[];
  action: (prevState: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  idPrefix?: string;
  values?: ProjectFormValues;
  extraHiddenFields?: ReactNode;
  resetOnClose?: boolean;
  resetOnSuccess?: boolean;
  prepareFormOnOpen?: boolean;
};

export type UseProjectFormDialogResult = {
  openDialog: () => void;
  closeDialog: () => void;
  dialog: ReactNode;
  isPending: boolean;
};

export function useProjectFormDialog({
  title,
  description,
  submitLabel,
  clients,
  action,
  idPrefix,
  values,
  extraHiddenFields,
  resetOnClose = false,
  resetOnSuccess = false,
  prepareFormOnOpen = false,
}: UseProjectFormDialogOptions): UseProjectFormDialogResult {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const defaultClientId = values?.clientId ?? clients[0]?.id ?? "";
  const defaultStatus = values ? initialProjectStatus(values.status) : "draft";

  const statusOptions = useMemo(
    () => (values ? projectStatusOptionsForRow(values.status) : projectStatusOptions),
    [values]
  );

  const [clientId, setClientId] = useState(defaultClientId);
  const [status, setStatus] = useState(defaultStatus);

  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    action,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      if (resetOnSuccess) {
        formRef.current?.reset();
      }
      dialogRef.current?.close();
    }
  }, [state, resetOnSuccess]);

  const resetPickerState = useCallback(() => {
    setClientId(defaultClientId);
    setStatus(defaultStatus);
  }, [defaultClientId, defaultStatus]);

  const openDialog = useCallback(() => {
    if (prepareFormOnOpen) {
      formRef.current?.reset();
    }
    resetPickerState();
    dialogRef.current?.showModal();
  }, [prepareFormOnOpen, resetPickerState]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const dialog = (
    <dialog
      ref={dialogRef}
      className={formDialogClassName}
      onClose={
        resetOnClose
          ? () => {
              formRef.current?.reset();
              resetPickerState();
            }
          : undefined
      }
    >
      <form ref={formRef} action={formAction} className="p-6">
        {extraHiddenFields}
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="status" value={status} />

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

        <ProjectFormFields
          clients={clients}
          statusOptions={statusOptions}
          clientId={clientId}
          onClientIdChange={setClientId}
          status={status}
          onStatusChange={setStatus}
          idPrefix={idPrefix}
          errors={state?.errors}
          values={values}
        />

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
