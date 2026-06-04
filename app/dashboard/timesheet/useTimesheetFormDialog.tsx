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

import { formDialogClassName } from "@/ui/forms/formClasses";

import TimesheetFormFields, { type TimesheetFormValues } from "./TimesheetFormFields";
import { nowDateTimeLocal } from "./timesheetFormUtils";

import type {
  EmployeeOption,
  ProjectOption,
  TimesheetFormState,
} from "@/lib/services/timesheet/timesheet.types";

type UseTimesheetFormDialogOptions = {
  title: string;
  description: string;
  submitLabel: string;
  employees: EmployeeOption[];
  projects: ProjectOption[];
  action: (prevState: TimesheetFormState, formData: FormData) => Promise<TimesheetFormState>;
  idPrefix?: string;
  values?: TimesheetFormValues;
  extraHiddenFields?: ReactNode;
  resetOnClose?: boolean;
  resetOnSuccess?: boolean;
  prepareFormOnOpen?: boolean;
};

export type UseTimesheetFormDialogResult = {
  openDialog: () => void;
  closeDialog: () => void;
  dialog: ReactNode;
  isPending: boolean;
};

export function useTimesheetFormDialog({
  title,
  description,
  submitLabel,
  employees,
  projects,
  action,
  idPrefix,
  values,
  extraHiddenFields,
  resetOnClose = false,
  resetOnSuccess = false,
  prepareFormOnOpen = false,
}: UseTimesheetFormDialogOptions): UseTimesheetFormDialogResult {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const defaultProjectId = values?.projectId ?? projects[0]?.id ?? "";
  const defaultEmployeeId = values?.employeeId ?? employees[0]?.id ?? "";
  const defaultStartedAt = useMemo(() => (values ? undefined : nowDateTimeLocal()), [values]);

  const [projectId, setProjectId] = useState(defaultProjectId);
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);

  const [state, formAction, isPending] = useActionState<TimesheetFormState, FormData>(
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
  }, [state?.success, resetOnSuccess]);

  const resetPickerState = useCallback(() => {
    setProjectId(defaultProjectId);
    setEmployeeId(defaultEmployeeId);
  }, [defaultProjectId, defaultEmployeeId]);

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
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="employeeId" value={employeeId} />

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

        <TimesheetFormFields
          employees={employees}
          projects={projects}
          employeeId={employeeId}
          onEmployeeIdChange={setEmployeeId}
          projectId={projectId}
          onProjectIdChange={setProjectId}
          idPrefix={idPrefix}
          errors={state?.errors}
          values={values}
          defaultStartedAt={defaultStartedAt}
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
