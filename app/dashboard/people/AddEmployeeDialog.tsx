"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import {
  createEmployee,
  type CreateEmployeeFormState,
} from "./actions";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export default function AddEmployeeDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<
    CreateEmployeeFormState,
    FormData
  >(createEmployee, undefined);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
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
      <button type="button" className="btn-accent inline-flex items-center gap-2" onClick={openDialog}>
        <Plus className="h-4 w-4" aria-hidden />
        Add people
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
        onClose={() => formRef.current?.reset()}
      >
        <form ref={formRef} action={formAction} className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Add employee</h2>
              <p className="mt-1 text-sm text-white/50">
                Add a team member to your organization.
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
                <label htmlFor="firstName" className="mb-1 block text-sm text-white/70">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  className={inputClassName}
                  placeholder="Ion"
                  required
                  autoComplete="given-name"
                />
                <FieldError messages={state?.errors?.firstName} />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm text-white/70">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  className={inputClassName}
                  placeholder="Pop"
                  required
                  autoComplete="family-name"
                />
                <FieldError messages={state?.errors?.lastName} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-white/70">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={inputClassName}
                placeholder="ion.pop@company.com"
                autoComplete="email"
              />
              <FieldError messages={state?.errors?.email} />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm text-white/70">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={inputClassName}
                placeholder="+40740111222"
                autoComplete="tel"
              />
              <FieldError messages={state?.errors?.phone} />
            </div>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm text-white/70">
                Role
              </label>
              <input
                id="role"
                name="role"
                className={inputClassName}
                placeholder="Welder"
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
              {isPending ? "Saving…" : "Add employee"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
