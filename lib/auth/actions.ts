'use server';

import { redirect } from "next/navigation";

import { signInWithPassword, signOut } from "./supabaseAuth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      return 'Invalid credentials.';
    }

    const { data, error } = await signInWithPassword(email, password);

    if (error || !data.user) {
      return "Invalid credentials.";
    }

    redirect("/dashboard");
  }

export async function logout() {
  await signOut();
  redirect("/login");
}
