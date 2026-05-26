"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/actions/auth";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400";

const buttonClassName =
  "w-full rounded-lg bg-[#22D3EE] py-2 font-semibold text-[#0B1220] transition hover:opacity-90";

type LoginFormProps = {
  headingId: string;
};

export default function LoginForm({ headingId }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <form
      // action={signIn}
      className="space-y-4"
      aria-labelledby={headingId}
    >
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-white/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-white/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClassName}
        />
      </div>
      <button type="submit" className={buttonClassName}>
        Sign In
      </button>
    </form>
  );
}
