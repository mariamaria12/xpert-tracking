"use client";

import { authenticate } from "@/lib/auth/actions";
import { useActionState } from "react";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

const buttonClassName =
  "w-full rounded-lg bg-[#22D3EE] py-2 font-semibold text-[#0B1220] transition hover:opacity-90";

type LoginFormProps = {
  headingId: string;
};

export default function LoginForm({ headingId }: LoginFormProps) {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <form
      action={formAction}
      className="space-y-4"
      aria-labelledby={headingId}
    >
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-white/70">
          Email
        </label>
        <input
          className={inputClassName}
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-white/70">
          Password
        </label>
        <input
          className={inputClassName}
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>
      <button type="submit" className={buttonClassName} aria-disabled={isPending}>
        Sign In
      </button>
      <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
    </form>
  );
}
