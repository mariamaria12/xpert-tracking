import React from "react";

import type { DataTableColumn } from "@/ui/table/DataTable";

export type PeopleRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  assignedProject: string | null;
  hoursPerWeek: number | null;
};

function formatHoursPerWeek(hours: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(hours);
}

export const peopleColumns: DataTableColumn<PeopleRow>[] = [
  {
    id: "name",
    header: "First name & Last name",
    cell: (row) => (
      <span className="font-medium text-white/80">
        {row.firstName} {row.lastName}
      </span>
    ),
  },
  {
    id: "role",
    header: "Role",
    cell: (row) => (
      <span className="text-white/80">{row.role ?? "—"}</span>
    ),
  },
  {
    id: "email",
    header: "Email",
    visibleByDefault: false,
    cell: (row) => (
      <span className="text-white/80">{row.email ?? "—"}</span>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    visibleByDefault: false,
    cell: (row) => (
      <span className="text-white/80">{row.phone ?? "—"}</span>
    ),
  },
  {
    id: "assignedProject",
    header: "Assigned project",
    cell: (row) => (
      <span className="text-white/80">{row.assignedProject ?? "—"}</span>
    ),
  },
  {
    id: "hoursPerWeek",
    header: "Hours/week",
    cell: (row) =>
      row.hoursPerWeek === null ? (
        <span className="text-white/30">—</span>
      ) : (
        <span className="text-white/80">{formatHoursPerWeek(row.hoursPerWeek)}</span>
      ),
  },
];

