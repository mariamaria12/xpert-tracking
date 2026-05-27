"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { createCompany, type ClientFormState } from "./actions";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export default function AddClientDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<ClientFormState, FormData>(
    createCompany,
    undefined,
  );

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
      <button
        type="button"
        className="btn-accent inline-flex items-center gap-2"
        onClick={openDialog}
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add company
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-0 text-white shadow-xl shadow-black/40 backdrop:bg-black/60 open:backdrop:bg-black/60"
        onClose={() => formRef.current?.reset()}
      >
        <form ref={formRef} action={formAction} className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Add company</h2>
              <p className="mt-1 text-sm text-white/50">
                Create a client company record.
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
                  htmlFor="companyName"
                  className="mb-1 block text-sm text-white/70"
                >
                  Company name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  className={inputClassName}
                  placeholder="Metal Construct SRL"
                  required
                />
                <FieldError messages={state?.errors?.companyName} />
              </div>
              <div>
                <label htmlFor="industry" className="mb-1 block text-sm text-white/70">
                  Industry
                </label>
                <input
                  id="industry"
                  name="industry"
                  className={inputClassName}
                  placeholder="Construction"
                />
                <FieldError messages={state?.errors?.industry} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactPerson"
                  className="mb-1 block text-sm text-white/70"
                >
                  Contact person
                </label>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  className={inputClassName}
                  placeholder="Andrei Pop"
                />
                <FieldError messages={state?.errors?.contactPerson} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-white/70">
                  Contact email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={inputClassName}
                  placeholder="office@company.com"
                  autoComplete="email"
                />
                <FieldError messages={state?.errors?.email} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm text-white/70">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={inputClassName}
                  placeholder="+40740111001"
                  autoComplete="tel"
                />
                <FieldError messages={state?.errors?.phone} />
              </div>
              <div>
                <label htmlFor="status" className="mb-1 block text-sm text-white/70">
                  Status
                </label>
                <input
                  id="status"
                  name="status"
                  className={inputClassName}
                  placeholder="active"
                />
                <FieldError messages={state?.errors?.status} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="billingAddress"
                  className="mb-1 block text-sm text-white/70"
                >
                  Billing address
                </label>
                <input
                  id="billingAddress"
                  name="billingAddress"
                  className={inputClassName}
                  placeholder="Cluj-Napoca, Str. Fabricii 12"
                />
                <FieldError messages={state?.errors?.billingAddress} />
              </div>
              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="mb-1 block text-sm text-white/70"
                >
                  Delivery address
                </label>
                <input
                  id="deliveryAddress"
                  name="deliveryAddress"
                  className={inputClassName}
                  placeholder="Cluj-Napoca, Industrial Park"
                />
                <FieldError messages={state?.errors?.deliveryAddress} />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="mb-1 block text-sm text-white/70">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className={inputClassName}
                rows={3}
                placeholder="Optional internal notes..."
              />
              <FieldError messages={state?.errors?.notes} />
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
              {isPending ? "Saving…" : "Add company"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

