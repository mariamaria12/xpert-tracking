import { cookies } from "next/headers";
import { cache } from "react";

import { AUTH_REQUIRED_ERROR } from "@/lib/auth/insertErrors";
import { createClient } from "@/lib/supabase/server";

export type SupabaseAuthUser = {
  id: string;
  email: string | null;
};

export const getUser = cache(async (): Promise<SupabaseAuthUser | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }
  if (!data.user) {
    return null;
  }

  return { id: data.user.id, email: data.user.email ?? null };
});

export async function requireUserId(): Promise<string> {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("Not authenticated");
  }
  return user.id;
}

/** One cached getUser() per request — use for create inserts (DB default auth.uid() is unreliable via PostgREST). */
export async function resolveCreatedByUserId(): Promise<{ userId: string } | { error: string }> {
  const user = await getUser();
  if (!user?.id) {
    return { error: AUTH_REQUIRED_ERROR };
  }
  return { userId: user.id };
}

export async function signInWithPassword(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.auth.signOut();
}
