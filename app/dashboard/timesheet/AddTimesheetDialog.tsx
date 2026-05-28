"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import type {
  EmployeeOption,
  ProjectOption,
  TimesheetFormState,
} from "@/lib/services/timesheet/timesheet.types";
import { createTimesheet } from "./actions";
import SelectPicker from "./SelectPicker";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

function nowDateTimeLocal() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AddTimesheetDialog({
  employees,
  projects,
}: {
  employees: EmployeeOption[];
  projects: ProjectOption[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<TimesheetFormState, FormData>(
    createTimesheet,
    undefined,
  );

  const defaultProjectId = projects[0]?.id ?? "";
  const [projectId, setProjectId] = useState(defaultProjectId);
  const defaultEmployeeId = employees[0]?.id ?? "";
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      dialogRef.current?.close();
    }
  }, [state?.success]);

  function openDialog() {
    setProjectId(defaultProjectId);
    setEmployeeId(defaultEmployeeId);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  const defaultStartedAt = useMemo(() => nowDateTimeLocal(), []);

  return (
    <>
      <button type="button" className="btn-accent inline-flex items-center gap-2" onClick={openDialog}>
        <Plus className="h-4 w-4" aria-hidden />
        Add timesheet
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
        onClose={() => formRef.current?.reset()}
      >
        <form ref={formRef} action={formAction} className="p-6">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="employeeId" value={employeeId} />

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Add timesheet</h2>
              <p className="mt-1 text-sm text-white/50">Log work time for an employee.</p>
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
                <label htmlFor="employeeId" className="mb-1 block text-sm text-white/70">
                  Employee
                </label>
                <SelectPicker
                  id="employeeId"
                  options={employees.map((e) => ({ id: e.id, label: e.label }))}
                  value={employeeId}
                  onChange={setEmployeeId}
                  placeholder="Select employee"
                />
                <FieldError messages={state?.errors?.employeeId} />
              </div>

              <div>
                <label htmlFor="projectPicker" className="mb-1 block text-sm text-white/70">
                  Project
                </label>
                <SelectPicker
                  id="projectPicker"
                  options={projects.map((p) => ({
                    id: p.id,
                    label: p.label,
                    rightLabel:
                      (p.status ?? "").toLowerCase() === "completed" ? "Completed" : undefined,
                    rightLabelClassName:
                      (p.status ?? "").toLowerCase() === "completed"
                        ? "text-emerald-400"
                        : undefined,
                    isDimmed: (p.status ?? "").toLowerCase() === "completed",
                  }))}
                  value={projectId}
                  onChange={setProjectId}
                  placeholder="Select project"
                />
                <FieldError messages={state?.errors?.projectId} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startedAt" className="mb-1 block text-sm text-white/70">
                  Started at
                </label>
                <input
                  id="startedAt"
                  name="startedAt"
                  type="datetime-local"
                  className={`${inputClassName} datetime-picker`}
                  defaultValue={defaultStartedAt}
                  required
                />
                <FieldError messages={state?.errors?.startedAt} />
              </div>

              <div>
                <label htmlFor="endedAt" className="mb-1 block text-sm text-white/70">
                  Ended at (optional)
                </label>
                <input
                  id="endedAt"
                  name="endedAt"
                  type="datetime-local"
                  className={`${inputClassName} datetime-picker`}
                />
                <FieldError messages={state?.errors?.endedAt} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="activity" className="mb-1 block text-sm text-white/70">
                  Activity (optional)
                </label>
                <input id="activity" name="activity" className={inputClassName} placeholder="Welding" />
                <FieldError messages={state?.errors?.activity} />
              </div>
              <div>
                <label htmlFor="notes" className="mb-1 block text-sm text-white/70">
                  Notes (optional)
                </label>
                <input id="notes" name="notes" className={inputClassName} placeholder="Column welding" />
                <FieldError messages={state?.errors?.notes} />
              </div>
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
              {isPending ? "Saving…" : "Add timesheet"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

