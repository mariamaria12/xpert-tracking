import { cookies } from "next/headers";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";

import { getProjectRows } from "./getProjectRows";
import ProjectsPageContent from "./ProjectsPageContent";

type ClientDbRow = { id: string; company_name: string };

type ProjectsPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

function resolveProjectsFilter(filter: string | string[] | undefined): string | undefined {
  if (Array.isArray(filter)) {
    return filter[0];
  }
  return filter;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { filter } = await searchParams;
  const initialFilterPreset = resolveProjectsFilter(filter);
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
    <Suspense fallback={null}>
      <ProjectsPageContent
        rows={rows}
        error={error}
        clients={clientOptions}
        initialFilterPreset={initialFilterPreset}
      />
    </Suspense>
  );
}
