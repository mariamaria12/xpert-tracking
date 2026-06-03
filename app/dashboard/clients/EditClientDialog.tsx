"use client";

import { Pencil } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef } from "react";

import { updateCompany } from "./actions";

import type { ClientRow, ClientFormState } from "@/lib/services/client/clients.types";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export default function EditClientDialog({ row }: { row: ClientRow }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const initialValues = useMemo(
    () => ({
      companyName: row.companyName ?? "",
      industry: row.industry ?? "",
      contactPerson: row.contactPerson ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      billingAddress: row.billingAddress ?? "",
      deliveryAddress: row.deliveryAddress ?? "",
      status: row.status ?? "",
      notes: row.notes ?? "",
    }),
    [
      row.billingAddress,
      row.companyName,
      row.contactPerson,
      row.deliveryAddress,
      row.email,
      row.industry,
      row.notes,
      row.phone,
      row.status,
    ]
  );

  const [state, formAction, isPending] = useActionState<ClientFormState, FormData>(
    updateCompany,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close();
    }
  }, [state]);

  function openDialog() {
    // Reset the form to defaults and clear any previous field errors.
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
        aria-label={`Edit ${row.companyName}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
      >
        <form ref={formRef} action={formAction} className="p-6">
          <input type="hidden" name="id" value={row.id} />

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Edit company</h2>
              <p className="mt-1 text-sm text-white/50">Update this client company’s details.</p>
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
                  htmlFor={`companyName-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Company name
                </label>
                <input
                  id={`companyName-${row.id}`}
                  name="companyName"
                  className={inputClassName}
                  required
                  defaultValue={initialValues.companyName}
                />
                <FieldError messages={state?.errors?.companyName} />
              </div>
              <div>
                <label htmlFor={`industry-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Industry
                </label>
                <input
                  id={`industry-${row.id}`}
                  name="industry"
                  className={inputClassName}
                  defaultValue={initialValues.industry}
                />
                <FieldError messages={state?.errors?.industry} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`contactPerson-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Contact person
                </label>
                <input
                  id={`contactPerson-${row.id}`}
                  name="contactPerson"
                  className={inputClassName}
                  defaultValue={initialValues.contactPerson}
                />
                <FieldError messages={state?.errors?.contactPerson} />
              </div>
              <div>
                <label htmlFor={`email-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Contact email
                </label>
                <input
                  id={`email-${row.id}`}
                  name="email"
                  type="email"
                  className={inputClassName}
                  defaultValue={initialValues.email}
                  autoComplete="email"
                />
                <FieldError messages={state?.errors?.email} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`phone-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Phone
                </label>
                <input
                  id={`phone-${row.id}`}
                  name="phone"
                  type="tel"
                  className={inputClassName}
                  defaultValue={initialValues.phone}
                  autoComplete="tel"
                />
                <FieldError messages={state?.errors?.phone} />
              </div>
              <div>
                <label htmlFor={`status-${row.id}`} className="mb-1 block text-sm text-white/70">
                  Status
                </label>
                <input
                  id={`status-${row.id}`}
                  name="status"
                  className={inputClassName}
                  defaultValue={initialValues.status}
                />
                <FieldError messages={state?.errors?.status} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`billingAddress-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Billing address
                </label>
                <input
                  id={`billingAddress-${row.id}`}
                  name="billingAddress"
                  className={inputClassName}
                  defaultValue={initialValues.billingAddress}
                />
                <FieldError messages={state?.errors?.billingAddress} />
              </div>
              <div>
                <label
                  htmlFor={`deliveryAddress-${row.id}`}
                  className="mb-1 block text-sm text-white/70"
                >
                  Delivery address
                </label>
                <input
                  id={`deliveryAddress-${row.id}`}
                  name="deliveryAddress"
                  className={inputClassName}
                  defaultValue={initialValues.deliveryAddress}
                />
                <FieldError messages={state?.errors?.deliveryAddress} />
              </div>
            </div>

            <div>
              <label htmlFor={`notes-${row.id}`} className="mb-1 block text-sm text-white/70">
                Notes
              </label>
              <textarea
                id={`notes-${row.id}`}
                name="notes"
                className={inputClassName}
                rows={3}
                defaultValue={initialValues.notes}
              />
              <FieldError messages={state?.errors?.notes} />
            </div>
          </div>

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
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
