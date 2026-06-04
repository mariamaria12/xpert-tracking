"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { projectStatusOptions } from "@/lib/services/projects/projectStatuses";

import SelectPicker from "../timesheet/SelectPicker";
import AddProjectDialog from "./AddProjectDialog";
import {
  ALL_PROJECT_STATUSES_FILTER,
  filterProjectRows,
  hasActiveProjectFilters,
} from "./filterProjectRows";
import ProjectsTable from "./ProjectsTable";

import type { ClientOption, ProjectRow } from "@/lib/services/projects/projects.types";

const statusFilterOptions = [
  { id: ALL_PROJECT_STATUSES_FILTER, label: "All statuses" },
  ...projectStatusOptions,
];

type ProjectsPageContentProps = {
  rows: ProjectRow[];
  error?: string;
  clients: ClientOption[];
};

export default function ProjectsPageContent({ rows, error, clients }: ProjectsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_PROJECT_STATUSES_FILTER);

  const filter = useMemo(
    () => ({ nameQuery: searchQuery, status: statusFilter }),
    [searchQuery, statusFilter]
  );
  const filteredRows = useMemo(() => filterProjectRows(rows, filter), [rows, filter]);
  const hasActiveFilters = hasActiveProjectFilters(filter);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
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
          <div className="w-full min-w-[12rem] max-w-xs sm:w-52">
            <SelectPicker
              id="projectStatusFilter"
              options={statusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All statuses"
            />
          </div>
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
