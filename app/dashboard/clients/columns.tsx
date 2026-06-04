import React from "react";

import EditClientDialog from "./EditClientDialog";

import type { ClientRow } from "@/lib/services/client/clients.types";
import type { DataTableColumn } from "@/ui/table/DataTable";

export const clientColumns: DataTableColumn<ClientRow>[] = [
  {
    id: "company",
    header: "Company",
    getSortValue: (row) => row.companyName,
    cell: (row) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-white/80">{row.companyName}</div>
        <div className="mt-0.5 truncate text-xs text-white/40">{row.industry ?? "—"}</div>
      </div>
    ),
  },
  {
    id: "contact",
    header: "Contact person",
    cell: (row) => (
      <div className="min-w-0">
        <div className="truncate text-white/80">{row.contactPerson ?? "—"}</div>
        <div className="mt-0.5 truncate text-xs text-white/40">{row.email ?? "—"}</div>
      </div>
    ),
  },
  {
    id: "deliveryAddress",
    header: "Delivery address",
    cell: (row) => <span className="text-white/80">{row.deliveryAddress ?? "—"}</span>,
  },
  {
    id: "projectCount",
    header: "Projects",
    align: "right",
    getSortValue: (row) => row.projectCount,
    cell: (row) => <span className="text-white/80">{row.projectCount}</span>,
  },

  // Optional columns
  {
    id: "phone",
    header: "Phone",
    visibleByDefault: false,
    cell: (row) => <span className="text-white/80">{row.phone ?? "—"}</span>,
  },
  {
    id: "billingAddress",
    header: "Billing address",
    visibleByDefault: false,
    cell: (row) => <span className="text-white/80">{row.billingAddress ?? "—"}</span>,
  },
  {
    id: "status",
    header: "Status",
    visibleByDefault: false,
    cell: (row) => <span className="text-white/80">{row.status ?? "—"}</span>,
  },
  {
    id: "notes",
    header: "Notes",
    visibleByDefault: false,
    cell: (row) => <span className="text-white/80">{row.notes?.trim() ? row.notes : "—"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    align: "right",
    cell: (row) => <EditClientDialog row={row} />,
  },
];
