import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

import AddProjectDialog from "./AddProjectDialog";
import { getProjectRows } from "./getProjectRows";
import ProjectsTable from "./ProjectsTable";

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

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <AddProjectDialog clients={clientOptions} />
      </div>
      <ProjectsTable rows={rows} error={error} clients={clientOptions} />
    </div>
  );
}
