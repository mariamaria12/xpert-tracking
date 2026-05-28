"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import SelectPicker from "../timesheet/SelectPicker";
import type { ProjectFormState } from "@/lib/services/projects/projects.types";
import { createProject } from "./actions";
import { projectStatusOptions } from "@/lib/services/projects/projectStatuses";

export type ClientOption = { id: string; label: string };

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export default function AddProjectDialog({ clients }: { clients: ClientOption[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    createProject,
    undefined,
  );

  const defaultClientId = clients[0]?.id ?? "";
  const defaultStatus = "draft";
  const [clientId, setClientId] = useState(defaultClientId);
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      dialogRef.current?.close();
    }
  }, [state?.success]);

  function openDialog() {
    setClientId(defaultClientId);
    setStatus(defaultStatus);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

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

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
        onClose={() => formRef.current?.reset()}
      >
        <form ref={formRef} action={formAction} className="p-6">
          <input type="hidden" name="clientId" value={clientId} />
          <input type="hidden" name="status" value={status} />

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Add project</h2>
              <p className="mt-1 text-sm text-white/50">Create a new project.</p>
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
                <label htmlFor="name" className="mb-1 block text-sm text-white/70">
                  Project name
                </label>
                <input
                  id="name"
                  name="name"
                  className={inputClassName}
                  placeholder="Warehouse steel frame"
                  required
                />
                <FieldError messages={state?.errors?.name} />
              </div>
              <div>
                <label htmlFor="clientPicker" className="mb-1 block text-sm text-white/70">
                  Client
                </label>
                <SelectPicker
                  id="clientPicker"
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
                <label htmlFor="statusPicker" className="mb-1 block text-sm text-white/70">
                  Status
                </label>
                <SelectPicker
                  id="statusPicker"
                  options={projectStatusOptions}
                  value={status}
                  onChange={setStatus}
                  placeholder="Select status"
                />
                <FieldError messages={state?.errors?.status} />
              </div>
              <div>
                <label htmlFor="estimatedHours" className="mb-1 block text-sm text-white/70">
                  Estimated hours
                </label>
                <input
                  id="estimatedHours"
                  name="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  className={`${inputClassName} number-input-no-spinner`}
                  placeholder="180"
                />
                <FieldError messages={state?.errors?.estimatedHours} />
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="mb-1 block text-sm text-white/70">
                Due date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className={`${inputClassName} date-picker`}
              />
              <FieldError messages={state?.errors?.dueDate} />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm text-white/70">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                className={inputClassName}
                rows={3}
                placeholder="Project details..."
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
              {isPending ? "Saving…" : "Add project"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
