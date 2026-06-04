import type { ProjectRow } from "@/lib/services/projects/projects.types";

export function filterProjectRows(rows: ProjectRow[], query: string): ProjectRow[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return rows;
  }

  return rows.filter((row) => row.name.toLowerCase().includes(normalized));
}
