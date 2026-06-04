export type SortDirection = "asc" | "desc";

export type SortState = {
  columnId: string;
  direction: SortDirection;
};

export function compareSortValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
  direction: SortDirection
): number {
  const factor = direction === "asc" ? 1 : -1;

  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return 1;
  }
  if (b == null) {
    return -1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * factor;
  }

  return (
    String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" }) * factor
  );
}

export function nextSortDirection(current: SortState | null, columnId: string): SortDirection {
  if (current?.columnId === columnId) {
    return current.direction === "asc" ? "desc" : "asc";
  }
  return "asc";
}
