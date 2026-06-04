"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import {
  compareSortValues,
  nextSortDirection,
  type SortDirection,
  type SortState,
} from "./dataTableSort";

export type { SortDirection, SortState };

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  visibleByDefault?: boolean;
  align?: "left" | "right";
  /** When set, clicking the header sorts by this value. */
  getSortValue?: (row: T) => string | number | null | undefined;
  /** Screen-reader label when `header` is not plain text. */
  sortLabel?: string;
};

export type DataTableEmptyState = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  emptyState?: DataTableEmptyState;
  className?: string;
  getRowId?: (row: T, index: number) => string;
  /** When set, paginates client-side. Pagination UI appears only if `data.length` exceeds this. */
  pageSize?: number;
  /** Initial sort (client-side). */
  initialSort?: SortState;
};

function formatResultsLabel(total: number, start: number, end: number, paginated: boolean) {
  if (total === 0) {
    return "0 results";
  }
  if (total === 1) {
    return "1 result";
  }
  if (paginated) {
    return `Showing ${start}–${end} of ${total} results`;
  }
  return `${total} results`;
}

function getColumnSortLabel<T>(column: DataTableColumn<T>) {
  if (column.sortLabel) {
    return column.sortLabel;
  }
  if (typeof column.header === "string") {
    return column.header;
  }
  return column.id;
}

const SORT_ICON_GUTTER_CLASS = "w-5 shrink-0";
const ACTIONS_COLUMN_ID = "actions";

/** Default data column width; primary label columns are 30% wider. */
const TABLE_COL_WIDTH_CLASS = "w-[14%]";
/** Fits the “Actions” label plus edit icon; shared by all tables. */
const ACTIONS_COLUMN_WIDTH_CLASS = "w-[4rem] min-w-[4rem] max-w-[4rem]";
const ACTIONS_COLUMN_SIZE_STYLE = {
  width: "4rem",
  minWidth: "4rem",
  maxWidth: "4rem",
} as const;
const ACTIONS_COLUMN_CELL_CLASS = cn(
  ACTIONS_COLUMN_WIDTH_CLASS,
  "whitespace-nowrap px-2 py-4 text-right"
);
const ACTIONS_COLUMN_HEADER_CLASS = cn(ACTIONS_COLUMN_WIDTH_CLASS, "whitespace-nowrap px-2 py-4");

function isActionsColumn(columnId: string) {
  return columnId === ACTIONS_COLUMN_ID;
}

function SortDirectionIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") {
    return <ArrowUp className="h-3.5 w-3.5" aria-hidden />;
  }
  if (direction === "desc") {
    return <ArrowDown className="h-3.5 w-3.5" aria-hidden />;
  }
  return <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />;
}

function ColumnHeader<T>({
  column,
  sortState,
  onSort,
}: {
  column: DataTableColumn<T>;
  sortState: SortState | null;
  onSort: (columnId: string) => void;
}) {
  const label = getColumnSortLabel(column);
  const isSortable = Boolean(column.getSortValue);
  const isActive = sortState?.columnId === column.id;
  const direction = isActive ? sortState.direction : null;

  if (isActionsColumn(column.id)) {
    return (
      <span className="block whitespace-nowrap text-left uppercase tracking-wider text-white/50">
        {column.header}
      </span>
    );
  }

  const headerLayoutClass =
    "flex w-full min-w-0 flex-row items-center text-left uppercase tracking-wider";

  const labelContent = (
    <span
      className={cn(
        "block min-w-0 flex-1 truncate text-left",
        isSortable && isActive ? "text-white/80" : "text-white/50"
      )}
    >
      {column.header}
    </span>
  );

  const reserveSortGutter = isSortable;
  const iconSlot = reserveSortGutter ? (
    <span
      className={cn(
        SORT_ICON_GUTTER_CLASS,
        "inline-flex shrink-0 items-center justify-center text-white/40",
        "group-hover:text-white/60",
        isActive && "text-white/70"
      )}
      aria-hidden
    >
      <SortDirectionIcon direction={direction} />
    </span>
  ) : null;

  if (!isSortable) {
    return <div className={headerLayoutClass}>{labelContent}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSort(column.id)}
      className={cn(headerLayoutClass, "group hover:text-white/80")}
      aria-label={
        direction
          ? `Sort by ${label}, ${direction === "asc" ? "ascending" : "descending"}`
          : `Sort by ${label}`
      }
    >
      {labelContent}
      {iconSlot}
    </button>
  );
}

function getColumnWidthClass(columnId: string) {
  if (isActionsColumn(columnId)) {
    return undefined;
  }

  switch (columnId) {
    /** No fixed % — absorbs leftover width under `table-fixed`. */
    case "name":
    case "company":
    case "employee":
      return undefined;
    case "estimatedHours":
    case "actualHours":
      return TABLE_COL_WIDTH_CLASS;
    case "dueDate":
      return "w-[12%]";
    case "workers":
    case "projectCount":
    case "hoursPerWeek":
      return "w-[11%]";
    case "status":
    case "lastLog":
    case "assignedProject":
      return "w-[12%]";
    case "contact":
    case "deliveryAddress":
    case "project":
    case "date":
    case "hours":
      return TABLE_COL_WIDTH_CLASS;
    default:
      return undefined;
  }
}

export default function DataTable<T>({
  data,
  columns,
  emptyState,
  className,
  getRowId,
  pageSize,
  initialSort,
}: DataTableProps<T>) {
  const initialVisible = useMemo(() => {
    const visible = columns.filter((c) => c.visibleByDefault ?? true).map((c) => c.id);
    if (visible.length > 0) {
      return visible;
    }
    if (columns.length > 0) {
      return [columns[0]?.id].filter(Boolean) as string[];
    }
    return [];
  }, [columns]);

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(initialVisible);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [sortState, setSortState] = useState<SortState | null>(initialSort ?? null);
  const columnsMenuRef = useRef<HTMLDivElement>(null);

  const sortedData = useMemo(() => {
    if (!sortState) {
      return data;
    }

    const column = columns.find((col) => col.id === sortState.columnId);
    if (!column?.getSortValue) {
      return data;
    }

    const getSortValue = column.getSortValue;
    return [...data].sort((rowA, rowB) =>
      compareSortValues(getSortValue(rowA), getSortValue(rowB), sortState.direction)
    );
  }, [columns, data, sortState]);

  const paginationEnabled = pageSize !== undefined && pageSize > 0 && sortedData.length > pageSize;
  const pageCount = paginationEnabled ? Math.ceil(sortedData.length / pageSize) : 1;
  const clampedPage = paginationEnabled ? Math.min(page, Math.max(0, pageCount - 1)) : 0;
  const pageStart = paginationEnabled ? clampedPage * pageSize : 0;
  const pageEnd = paginationEnabled
    ? Math.min(pageStart + pageSize, sortedData.length)
    : sortedData.length;
  const tableData = paginationEnabled ? sortedData.slice(pageStart, pageEnd) : sortedData;

  function goToPage(next: number) {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
  }

  function handleSort(columnId: string) {
    setSortState((current) => ({
      columnId,
      direction: nextSortDirection(current, columnId),
    }));
    setPage(0);
  }

  useEffect(() => {
    if (!columnsOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setColumnsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [columnsOpen]);

  const visibleColumns = useMemo(() => {
    const visibleSet = new Set(visibleColumnIds);
    return columns.filter((c) => visibleSet.has(c.id));
  }, [columns, visibleColumnIds]);

  function toggleColumn(id: string) {
    setVisibleColumnIds((prev) => {
      const isVisible = prev.includes(id);
      if (isVisible) {
        if (prev.length <= 1) {
          return prev;
        }
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  }

  const empty = emptyState ?? { title: "No results" };

  const showColumnToggle = columns.length > 1;
  const columnCount = visibleColumns.length + (showColumnToggle ? 1 : 0);

  const columnToggleMenu = showColumnToggle ? (
    <div ref={columnsMenuRef} className="relative">
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white/80"
        aria-label="Toggle columns"
        aria-expanded={columnsOpen}
        onClick={() => setColumnsOpen((open) => !open)}
      >
        <Columns3 className="h-4 w-4" aria-hidden />
      </button>
      {columnsOpen ? (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-white/10 bg-[#111827] p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
            Column visibility
          </p>
          <div className="space-y-2">
            {columns.map((col) => {
              const isVisible = visibleColumnIds.includes(col.id);
              const isLastVisible = isVisible && visibleColumnIds.length <= 1;
              return (
                <label
                  key={col.id}
                  className={cn(
                    "flex items-center gap-2 text-sm text-white/70",
                    isLastVisible ? "opacity-50" : "cursor-pointer"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    disabled={isLastVisible}
                    onChange={() => toggleColumn(col.id)}
                    className="h-4 w-4 accent-cyan-400"
                  />
                  <span className="truncate">{getColumnSortLabel(col)}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

  const resultsLabel = formatResultsLabel(
    sortedData.length,
    paginationEnabled ? pageStart + 1 : 1,
    pageEnd,
    paginationEnabled
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-white/50">{resultsLabel}</div>
        {paginationEnabled ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(clampedPage - 1)}
              disabled={clampedPage === 0}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="min-w-[5.5rem] text-center text-sm text-white/60">
              Page {clampedPage + 1} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => goToPage(clampedPage + 1)}
              disabled={clampedPage >= pageCount - 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[36rem] table-fixed border-collapse text-left">
          <colgroup>
            {visibleColumns.map((col) => (
              <col
                key={col.id}
                style={isActionsColumn(col.id) ? ACTIONS_COLUMN_SIZE_STYLE : undefined}
                className={getColumnWidthClass(col.id)}
              />
            ))}
            {showColumnToggle ? <col className="w-12" /> : null}
          </colgroup>
          <thead>
            <tr className="bg-white/5 text-xs font-medium tracking-wider text-white/50">
              {visibleColumns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    isActionsColumn(col.id) ? ACTIONS_COLUMN_HEADER_CLASS : "overflow-hidden p-4"
                  )}
                >
                  <ColumnHeader column={col} sortState={sortState} onSort={handleSort} />
                </th>
              ))}
              {showColumnToggle ? (
                <th className="w-12 p-4 font-medium">
                  <div className="flex justify-end">{columnToggleMenu}</div>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr className="border-t border-white/10 text-white/20">
                <td colSpan={Math.max(1, columnCount)}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    {empty.icon ? (
                      <div className="mb-4 inline-flex rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
                        {empty.icon}
                      </div>
                    ) : null}
                    <p className="text-base font-medium text-white">{empty.title}</p>
                    {empty.description ? (
                      <p className="mt-1 text-sm text-white/40">{empty.description}</p>
                    ) : null}
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((row, rowIndex) => (
                <tr
                  key={getRowId ? getRowId(row, pageStart + rowIndex) : pageStart + rowIndex}
                  className="border-t border-white/10 text-white/20 transition hover:bg-white/5"
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={col.id}
                      className={cn(
                        isActionsColumn(col.id)
                          ? ACTIONS_COLUMN_CELL_CLASS
                          : cn("overflow-hidden p-4", col.align === "right" && "text-right")
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                  {showColumnToggle ? <td className="w-12 p-4" aria-hidden /> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
