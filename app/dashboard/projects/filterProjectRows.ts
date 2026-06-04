import type { ProjectRow } from "@/lib/services/projects/projects.types";

export const ALL_PROJECT_STATUSES_FILTER = "";

export type ProjectRowsFilter = {
  nameQuery: string;
  status: string;
};

export function filterProjectRows(rows: ProjectRow[], filter: ProjectRowsFilter): ProjectRow[] {
  const normalizedName = filter.nameQuery.trim().toLowerCase();
  const normalizedStatus = filter.status.trim().toLowerCase();

  return rows.filter((row) => {
    if (normalizedName && !row.name.toLowerCase().includes(normalizedName)) {
      return false;
    }
    if (normalizedStatus && row.status.trim().toLowerCase() !== normalizedStatus) {
      return false;
    }
    return true;
  });
}

export function hasActiveProjectFilters(filter: ProjectRowsFilter): boolean {
  return filter.nameQuery.trim().length > 0 || filter.status.trim().length > 0;
}
