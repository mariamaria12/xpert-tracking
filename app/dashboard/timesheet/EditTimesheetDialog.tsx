"use client";

import { Pencil } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import type { TimesheetRow } from "./columns";
import type { EmployeeOption, ProjectOption } from "./AddTimesheetDialog";
import { updateTimesheet, type TimesheetFormState } from "./actions";
import SelectPicker from "./SelectPicker";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

function isoToDateTimeLocal(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditTimesheetDialog({
  row,
  employees,
  projects,
}: {
  row: TimesheetRow;
  employees: EmployeeOption[];
  projects: ProjectOption[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const initialValues = useMemo(
    () => ({
      employeeId: row.employeeId,
      projectId: row.projectId,
      startedAt: isoToDateTimeLocal(row.startedAtIso),
      endedAt: row.endedAtIso ? isoToDateTimeLocal(row.endedAtIso) : "",
      activity: row.activity ?? "",
      notes: row.notes ?? "",
    }),
    [row],
  );

  const [projectId, setProjectId] = useState(initialValues.projectId);
  const [employeeId, setEmployeeId] = useState(initialValues.employeeId);

  const [state, formAction, isPending] = useActionState<TimesheetFormState, FormData>(
    updateTimesheet,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close();
    }
  }, [state?.success]);

  function openDialog() {
    setProjectId(initialValues.projectId);
    setEmployeeId(initialValues.employeeId);
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
        aria-label="Edit timesheet"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
      >
        <form action={formAction} className="p-6">
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="employeeId" value={employeeId} />

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Edit timesheet</h2>
              <p className="mt-1 text-sm text-white/50">Update this time log.</p>
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
                <label htmlFor={`employeeId-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Employee
                </label>
                <SelectPicker
                  id={`employeePicker-${row.id}`}
                  options={employees.map((e) => ({ id: e.id, label: e.label }))}
                  value={employeeId}
                  onChange={setEmployeeId}
                  placeholder="Select employee"
                />
                <FieldError messages={state?.errors?.employeeId} />
              </div>

              <div>
                <label htmlFor={`projectPicker-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Project
                </label>
                <SelectPicker
                  id={`projectPicker-${row.id}`}
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
                <label htmlFor={`startedAt-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Started at
                </label>
                <input
                  id={`startedAt-${row.id}`}
                  name="startedAt"
                  type="datetime-local"
                  className={`${inputClassName} datetime-picker`}
                  defaultValue={initialValues.startedAt}
                  required
                />
                <FieldError messages={state?.errors?.startedAt} />
              </div>
              <div>
                <label htmlFor={`endedAt-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Ended at (optional)
                </label>
                <input
                  id={`endedAt-${row.id}`}
                  name="endedAt"
                  type="datetime-local"
                  className={`${inputClassName} datetime-picker`}
                  defaultValue={initialValues.endedAt}
                />
                <FieldError messages={state?.errors?.endedAt} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`activity-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Activity (optional)
                </label>
                <input
                  id={`activity-${row.id}`}
                  name="activity"
                  className={inputClassName}
                  defaultValue={initialValues.activity}
                />
                <FieldError messages={state?.errors?.activity} />
              </div>
              <div>
                <label htmlFor={`notes-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Notes (optional)
                </label>
                <input
                  id={`notes-${row.id}`}
                  name="notes"
                  className={inputClassName}
                  defaultValue={initialValues.notes}
                />
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
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

