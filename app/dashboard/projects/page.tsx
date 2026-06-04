import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

import { getProjectRows } from "./getProjectRows";
import ProjectsPageContent from "./ProjectsPageContent";

type ClientDbRow = { id: string; company_name: string };

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ rows, error }, { data: clients }] = await Promise.all([
    getProjectRows(),
    supabase.from("clients").select("id, company_name").order("company_name", { ascending: true }),
  ]);

  const clientOptions =
    ((clients ?? []) as ClientDbRow[]).map((c) => ({
      id: String(c.id),
      label: c.company_name?.trim() || "—",
    })) ?? [];

  return <ProjectsPageContent rows={rows} error={error} clients={clientOptions} />;
}
