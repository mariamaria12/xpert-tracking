'use server';

import { signIn, signOut } from "auth";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      return 'Invalid credentials.';
    }

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/dashboard',
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  await signOut({ redirectTo: "/login" });
}
