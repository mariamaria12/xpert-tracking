"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import AddProjectDialog from "./AddProjectDialog";
import { filterProjectRows } from "./filterProjectRows";
import ProjectsTable from "./ProjectsTable";

import type { ClientOption, ProjectRow } from "@/lib/services/projects/projects.types";

type ProjectsPageContentProps = {
  rows: ProjectRow[];
  error?: string;
  clients: ClientOption[];
};

export default function ProjectsPageContent({ rows, error, clients }: ProjectsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = useMemo(
    () => filterProjectRows(rows, searchQuery),
    [rows, searchQuery]
  );
  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <label className="relative min-w-[12rem] flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name…"
            aria-label="Search projects by name"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </label>
        <AddProjectDialog clients={clients} />
      </div>
      <ProjectsTable
        rows={filteredRows}
        error={error}
        clients={clients}
        isSearchActive={isSearchActive}
      />
    </div>
  );
}
