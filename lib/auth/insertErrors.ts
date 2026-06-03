import type { PostgrestError } from "@supabase/supabase-js";

export const AUTH_REQUIRED_ERROR = "You must be signed in to perform this action.";

export function insertErrorMessage(error: PostgrestError): string {
  if (
    error.code === "42501" ||
    error.code === "PGRST301" ||
    /jwt|auth|row-level security|not authenticated/i.test(error.message)
  ) {
    return AUTH_REQUIRED_ERROR;
  }

  return error.message;
}
