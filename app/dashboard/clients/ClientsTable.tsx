"use client";

import { Users } from "lucide-react";

import DataTable from "@/ui/table/DataTable";

import type { ClientRow } from "@/lib/services/client/clients.types";
import { clientColumns } from "./columns";

type ClientsTableProps = {
  rows: ClientRow[];
  error?: string;
};

export default function ClientsTable({ rows, error }: ClientsTableProps) {
  const emptyState = error
    ? {
        title: "Could not load clients",
        description: error,
        icon: <Users className="h-6 w-6" aria-hidden />,
      }
    : {
        title: "No clients added yet",
        description: "Clients will appear here once added.",
        icon: <Users className="h-6 w-6" aria-hidden />,
      };

  return (
    <DataTable<ClientRow>
      columns={clientColumns}
      data={rows}
      emptyState={emptyState}
      getRowId={(row) => row.id}
    />
  );
}

