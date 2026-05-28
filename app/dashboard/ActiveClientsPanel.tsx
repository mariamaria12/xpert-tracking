import Link from "next/link";

import type { ActiveClientSummary } from "@/lib/services/home/home.types";

export default function ActiveClientsPanel({
  clients,
}: {
  clients: ActiveClientSummary[];
}) {
  return (
    <div className="card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Active clients</h2>
          <p className="mt-1 text-sm text-white/50">
            Clients that currently have projects in progress
          </p>
        </div>
        <Link
          href="/dashboard/clients"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          View all clients →
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">
          No active clients right now.
        </p>
      ) : (
        <div className="divide-y divide-white/10">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white/80">
                  {client.companyName}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-white/40">Active projects</p>
                <p className="text-white/80">{client.activeProjectsCount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

