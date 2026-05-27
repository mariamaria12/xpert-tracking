"use client";

import { Pencil } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef } from "react";

import type { PeopleRow } from "./columns";
import {
  updateEmployee,
  type UpdateEmployeeFormState,
} from "./actions";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export default function EditEmployeeDialog({ row }: { row: PeopleRow }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const initialValues = useMemo(
    () => ({
      firstName: row.firstName ?? "",
      lastName: row.lastName ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      role: row.role ?? "",
    }),
    [row.email, row.firstName, row.lastName, row.phone, row.role],
  );

  const [state, formAction, isPending] = useActionState<
    UpdateEmployeeFormState,
    FormData
  >(updateEmployee, undefined);

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close();
    }
  }, [state?.success]);

  function openDialog() {
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
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
      >
        <form ref={formRef} action={formAction} className="p-6">
          <input type="hidden" name="id" value={row.id} />

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Edit employee</h2>
              <p className="mt-1 text-sm text-white/50">
                Update this team member’s details.
              </p>
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
                  htmlFor={`firstName-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  First name
                </label>
                <input
                  id={`firstName-${row.id}`}
                  name="firstName"
                  className={inputClassName}
                  required
                  autoComplete="given-name"
                  defaultValue={initialValues.firstName}
                />
                <FieldError messages={state?.errors?.firstName} />
              </div>
              <div>
                <label
                  htmlFor={`lastName-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Last name
                </label>
                <input
                  id={`lastName-${row.id}`}
                  name="lastName"
                  className={inputClassName}
                  required
                  autoComplete="family-name"
                  defaultValue={initialValues.lastName}
                />
                <FieldError messages={state?.errors?.lastName} />
              </div>
            </div>

            <div>
              <label
                htmlFor={`email-${row.id}`}
                className="mb-1 block text-sm text-white/70"
              >
                Email
              </label>
              <input
                id={`email-${row.id}`}
                name="email"
                type="email"
                className={inputClassName}
                autoComplete="email"
                defaultValue={initialValues.email}
              />
              <FieldError messages={state?.errors?.email} />
            </div>

            <div>
              <label
                htmlFor={`phone-${row.id}`}
                className="mb-1 block text-sm text-white/70"
              >
                Phone
              </label>
              <input
                id={`phone-${row.id}`}
                name="phone"
                type="tel"
                className={inputClassName}
                autoComplete="tel"
                defaultValue={initialValues.phone}
              />
              <FieldError messages={state?.errors?.phone} />
            </div>

            <div>
              <label
                htmlFor={`role-${row.id}`}
                className="mb-1 block text-sm text-white/70"
              >
                Role
              </label>
              <input
                id={`role-${row.id}`}
                name="role"
                className={inputClassName}
                defaultValue={initialValues.role}
              />
              <FieldError messages={state?.errors?.role} />
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

