import { PROJECTS_PAGE_FILTER_PRESETS } from "./projectsPageFilter";

import type { ProjectRow } from "@/lib/services/projects/projects.types";

export type ProjectRowsFilter = {
  nameQuery: string;
  presets: string[];
  statuses: string[];
};

function rowMatchesStatusFilter(
  status: string,
  presets: string[],
  statusSet: Set<string>
): boolean {
  if (presets.length === 0 && statusSet.size === 0) {
    return true;
  }

  // Presets (e.g. Active) and explicit statuses are mutually exclusive.
  if (presets.length > 0) {
    return presets.some((presetId) => {
      const preset = PROJECTS_PAGE_FILTER_PRESETS[presetId];
      return preset?.matchesStatus(status) ?? false;
    });
  }

  const normalizedStatus = status.trim().toLowerCase();
  return statusSet.has(normalizedStatus);
}

export function filterProjectRows(rows: ProjectRow[], filter: ProjectRowsFilter): ProjectRow[] {
  const normalizedName = filter.nameQuery.trim().toLowerCase();
  const statusSet = new Set(
    filter.statuses.map((status) => status.trim().toLowerCase()).filter(Boolean)
  );

  return rows.filter((row) => {
    if (normalizedName && !row.name.toLowerCase().includes(normalizedName)) {
      return false;
    }

    return rowMatchesStatusFilter(row.status, filter.presets, statusSet);
  });
}

export function hasActiveProjectFilters(filter: ProjectRowsFilter): boolean {
  return filter.nameQuery.trim().length > 0 || filter.presets.length > 0 || filter.statuses.length > 0;
}
