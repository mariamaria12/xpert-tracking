"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import AddProjectDialog from "./AddProjectDialog";
import { filterProjectRows, hasActiveProjectFilters } from "./filterProjectRows";
import {
  resolveInitialProjectsPageFilter,
  toProjectRowsFilter,
  type ProjectsPageFilterState,
} from "./projectsPageFilter";
import ProjectsTable from "./ProjectsTable";
import ProjectStatusFilter from "./ProjectStatusFilter";

import type { ClientOption, ProjectRow } from "@/lib/services/projects/projects.types";

type ProjectsPageContentProps = {
  rows: ProjectRow[];
  error?: string;
  clients: ClientOption[];
  /** One-time preset from `?filter=` (e.g. `active`). Not synced after mount. */
  initialFilterPreset?: string;
};

export default function ProjectsPageContent({
  rows,
  error,
  clients,
  initialFilterPreset,
}: ProjectsPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consumedInitialUrl = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectsPageFilterState>(() =>
    resolveInitialProjectsPageFilter(initialFilterPreset)
  );

  // Apply initial preset from the URL once, then drop `filter` so edits stay local.
  useEffect(() => {
    if (consumedInitialUrl.current || !initialFilterPreset) {
      return;
    }
    consumedInitialUrl.current = true;

    if (searchParams.get("filter") !== initialFilterPreset) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [initialFilterPreset, pathname, router, searchParams]);

  const filter = useMemo(
    () => toProjectRowsFilter(searchQuery, statusFilter),
    [searchQuery, statusFilter]
  );
  const filteredRows = useMemo(() => filterProjectRows(rows, filter), [rows, filter]);
  const hasActiveFilters = hasActiveProjectFilters(filter);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <label className="relative min-w-[12rem] max-w-md">
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
          <ProjectStatusFilter filter={statusFilter} onFilterChange={setStatusFilter} />
        </div>
        <AddProjectDialog clients={clients} />
      </div>
      <ProjectsTable
        rows={filteredRows}
        error={error}
        clients={clients}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}
