"use client";

import { Users } from "lucide-react";

import DataTable from "@/ui/table/DataTable";

import { peopleColumns, type PeopleRow } from "./columns";

type PeopleTableProps = {
  rows: PeopleRow[];
  error?: string;
};

export default function PeopleTable({ rows, error }: PeopleTableProps) {
  const emptyState = error
    ? {
        title: "Could not load people",
        description: error,
        icon: <Users className="h-6 w-6" aria-hidden />,
      }
    : {
        title: "No people added yet",
        description: "Team members will appear here once added.",
        icon: <Users className="h-6 w-6" aria-hidden />,
      };

  return (
    <DataTable<PeopleRow>
      columns={peopleColumns}
      data={rows}
      emptyState={emptyState}
      getRowId={(row) => row.id}
    />
  );
}
