"use client";

import { cn } from "@/lib/utils";
import { Columns3 } from "lucide-react";
import React, { useMemo, useState } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  visibleByDefault?: boolean;
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
};

export default function DataTable<T>({
  data,
  columns,
  emptyState,
  className,
  getRowId,
}: DataTableProps<T>) {
  const initialVisible = useMemo(() => {
    const visible = columns
      .filter((c) => c.visibleByDefault ?? true)
      .map((c) => c.id);
    if (visible.length > 0) return visible;
    if (columns.length > 0) return [columns[0]?.id].filter(Boolean) as string[];
    return [];
  }, [columns]);

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(initialVisible);

  const visibleColumns = useMemo(() => {
    const visibleSet = new Set(visibleColumnIds);
    return columns.filter((c) => visibleSet.has(c.id));
  }, [columns, visibleColumnIds]);

  function toggleColumn(id: string) {
    setVisibleColumnIds((prev) => {
      const isVisible = prev.includes(id);
      if (isVisible) {
        // Prevent a "no columns" table.
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  }

  const empty = emptyState ?? { title: "No results" };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-white/50">
          {data.length === 1 ? "1 result" : `${data.length} results`}
        </div>

        {columns.length > 1 ? (
          <details className="relative">
            <summary className="btn-accent cursor-pointer select-none list-none inline-flex items-center gap-2">
              <Columns3 className="h-4 w-4" aria-hidden />
              Columns
            </summary>
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
                        isLastVisible ? "opacity-50" : "cursor-pointer",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isVisible}
                        disabled={isLastVisible}
                        onChange={() => toggleColumn(col.id)}
                        className="h-4 w-4 accent-cyan-400"
                      />
                      <span className="truncate">{col.header}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </details>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wider text-white/50">
              {visibleColumns.map((col) => (
                <th key={col.id} className="p-4 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="border-t border-white/10 text-white/20">
                <td colSpan={Math.max(1, visibleColumns.length)}>
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
              data.map((row, rowIndex) => (
                <tr
                  key={getRowId ? getRowId(row, rowIndex) : rowIndex}
                  className="border-t border-white/10 text-white/20 transition hover:bg-white/5"
                >
                  {visibleColumns.map((col) => (
                    <td key={col.id} className="p-4">
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

