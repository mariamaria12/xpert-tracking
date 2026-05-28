"use client";

import { Pencil } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import SelectPicker from "../timesheet/SelectPicker";
import type { ClientOption } from "./AddProjectDialog";
import type { ProjectRow, ProjectFormState } from "@/lib/services/projects/projects.types";
import { updateProject } from "./actions";
import {
  formatProjectStatusLabel,
  PROJECT_STATUSES,
  projectStatusOptions,
  type ProjectStatus,
} from "@/lib/services/projects/projectStatuses";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export default function EditProjectDialog({
  row,
  clients,
}: {
  row: ProjectRow;
  clients: ClientOption[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const initialValues = useMemo(
    () => ({
      name: row.name ?? "",
      clientId: row.clientId,
      status: row.status ?? "",
      estimatedHours:
        row.estimatedHours === null ? "" : String(row.estimatedHours),
      dueDate: row.dueDateIso ?? "",
      description: row.description ?? "",
    }),
    [row],
  );

  const [clientId, setClientId] = useState(initialValues.clientId);

  const statusOptions = useMemo(() => {
    const current = initialValues.status.trim().toLowerCase();
    if (
      current &&
      !PROJECT_STATUSES.includes(current as ProjectStatus)
    ) {
      return [
        { id: current, label: formatProjectStatusLabel(current) },
        ...projectStatusOptions,
      ];
    }
    return projectStatusOptions;
  }, [initialValues.status]);

  const currentStatus = initialValues.status.trim().toLowerCase();
  const initialStatus = statusOptions.some((o) => o.id === currentStatus)
    ? currentStatus
    : (statusOptions[0]?.id ?? "draft");

  const [status, setStatus] = useState(initialStatus);

  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    updateProject,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close();
    }
  }, [state]);

  function openDialog() {
    setClientId(initialValues.clientId);
    setStatus(initialStatus);
    // Reset any previous field errors and restore default values.
    formRef.current?.reset();
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

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

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
      >
        <form ref={formRef} action={formAction} className="p-6">
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="clientId" value={clientId} />
          <input type="hidden" name="status" value={status} />

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Edit project</h2>
              <p className="mt-1 text-sm text-white/50">Update this project.</p>
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

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`name-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Project name
                </label>
                <input
                  id={`name-${row.id}`}
                  name="name"
                  className={inputClassName}
                  defaultValue={initialValues.name}
                  required
                />
                <FieldError messages={state?.errors?.name} />
              </div>
              <div>
                <label
                  htmlFor={`clientPicker-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Client
                </label>
                <SelectPicker
                  id={`clientPicker-${row.id}`}
                  options={clients.map((c) => ({ id: c.id, label: c.label }))}
                  value={clientId}
                  onChange={setClientId}
                  placeholder="Select client"
                />
                <FieldError messages={state?.errors?.clientId} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`status-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Status
                </label>
                <SelectPicker
                  id={`statusPicker-${row.id}`}
                  options={statusOptions}
                  value={status}
                  onChange={setStatus}
                  placeholder="Select status"
                />
                <FieldError messages={state?.errors?.status} />
              </div>
              <div>
                <label
                  htmlFor={`estimatedHours-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Estimated hours
                </label>
                <input
                  id={`estimatedHours-${row.id}`}
                  name="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  className={`${inputClassName} number-input-no-spinner`}
                  defaultValue={initialValues.estimatedHours}
                />
                <FieldError messages={state?.errors?.estimatedHours} />
              </div>
            </div>

            <div>
              <label
                htmlFor={`dueDate-${row.id}`}
                className="mb-1 block text-sm text-white/70"
              >
                Due date
              </label>
              <input
                id={`dueDate-${row.id}`}
                name="dueDate"
                type="date"
                className={`${inputClassName} date-picker`}
                defaultValue={initialValues.dueDate}
              />
              <FieldError messages={state?.errors?.dueDate} />
            </div>

            <div>
              <label
                htmlFor={`description-${row.id}`}
                className="mb-1 block text-sm text-white/70"
              >
                Description (optional)
              </label>
              <textarea
                id={`description-${row.id}`}
                name="description"
                className={inputClassName}
                rows={3}
                defaultValue={initialValues.description}
              />
              <FieldError messages={state?.errors?.description} />
            </div>
          </div>

          {state?.message ? (
            <p className="mt-4 text-sm text-red-400">{state.message}</p>
          ) : null}

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
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
