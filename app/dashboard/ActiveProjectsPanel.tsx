import Link from "next/link";

import { cn, formatDate } from "@/lib/utils";

import ProjectStatusBadge from "./projects/ProjectStatusBadge";

import type { ActiveProjectSummary } from "./getHomeData";

function formatHours(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function getDueDateTone(
  dueDate: Date | null,
  estimatedHours: number | null,
  actualHours: number,
) {
  if (!dueDate) return "muted";

  const referenceDate = new Date();
  const dueDay = new Date(dueDate);
  dueDay.setHours(23, 59, 59, 999);
  if (referenceDate.getTime() > dueDay.getTime()) return "red";

  if (estimatedHours === null) return "green";

  const remainingHours = Math.max(0, estimatedHours - actualHours);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.max(
    0,
    Math.ceil((dueDay.getTime() - referenceDate.getTime()) / msPerDay),
  );
  const capacityHours = daysRemaining * 8;

  return remainingHours <= capacityHours ? "green" : "orange";
}

function DueDateLabel({
  dueDate,
  estimatedHours,
  actualHours,
}: {
  dueDate: Date | null;
  estimatedHours: number | null;
  actualHours: number;
}) {
  if (!dueDate) return <span className="text-white/30">—</span>;

  const tone = getDueDateTone(dueDate, estimatedHours, actualHours);
  const bulletClassName =
    tone === "red"
      ? "bg-red-400"
      : tone === "orange"
        ? "bg-amber-400"
        : "bg-emerald-400";

  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/80">
      <span className={cn("h-2 w-2 rounded-full", bulletClassName)} aria-hidden />
      {formatDate(dueDate)}
    </span>
  );
}

export default function ActiveProjectsPanel({
  projects,
}: {
  projects: ActiveProjectSummary[];
}) {
  return (
    <div className="card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Active projects</h2>
          <p className="mt-1 text-sm text-white/50">
            Overview of projects currently in progress
          </p>
        </div>
        <Link
          href="/dashboard/projects"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          View all projects →
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">
          No active projects right now.
        </p>
      ) : (
        <div className="divide-y divide-white/10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white/80">{project.name}</p>
                <p className="mt-0.5 truncate text-sm text-white/40">
                  {project.companyName}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <ProjectStatusBadge status={project.status} />
                <div className="text-right">
                  <p className="text-white/40">Hours</p>
                  <p className="text-white/80">
                    {formatHours(project.actualHours)} /{" "}
                    {formatHours(project.estimatedHours)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/40">Due</p>
                  <DueDateLabel
                    dueDate={project.dueDate}
                    estimatedHours={project.estimatedHours}
                    actualHours={project.actualHours}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
