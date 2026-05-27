import React from "react";

import type { DataTableColumn } from "@/ui/table/DataTable";
import EditEmployeeDialog from "./EditEmployeeDialog";
import HoursWeekCard from "./HoursWeekCard";
import LastLogCard from "./LastLogCard";
import type { HoursWeekDisplay } from "./hoursWeekDisplay";
import type { LastLogDisplay } from "./lastLogDisplay";

export type PeopleRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  assignedProject: string | null;
  lastLog: LastLogDisplay | null;
  hoursWeek: HoursWeekDisplay | null;
};

export const peopleColumns: DataTableColumn<PeopleRow>[] = [
  {
    id: "name",
    header: "Name",
    cell: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-white/80">
          {row.firstName} {row.lastName}
        </span>
        <span className="text-white/50 text-sm">
          {row.role ?? "—"}
        </span>
      </div>
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
    id: "lastLog",
    header: "Last log",
    cell: (row) => <LastLogCard display={row.lastLog} />,
  },
  {
    id: "hoursPerWeek",
    header: "Hours/week",
    cell: (row) => <HoursWeekCard display={row.hoursWeek} />,
  },
  {
    id: "actions",
    header: "Actions",
    align: "right",
    cell: (row) => <EditEmployeeDialog row={row} />,
  },
];

