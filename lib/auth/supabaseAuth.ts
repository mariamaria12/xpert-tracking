import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

export type SupabaseAuthUser = {
  id: string;
  email: string | null;
};

export async function getUser(): Promise<SupabaseAuthUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  if (!data.user) return null;

  return { id: data.user.id, email: data.user.email ?? null };
}

export async function requireUserId(): Promise<string> {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("Not authenticated");
  }
  return user.id;
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

