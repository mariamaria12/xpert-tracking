"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDate } from "@/lib/utils";

import AnalyticsCard from "./AnalyticsCard";
import AnalyticsEmpty from "./AnalyticsEmpty";
import { chartAxisStyle, chartGridStroke, chartTooltipStyle } from "./chartTheme";
import ProjectStatusBadge from "../projects/ProjectStatusBadge";

import type { ProjectsAnalyticsData } from "@/lib/services/home/projectsAnalytics.types";

function formatHours(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm shadow-lg shadow-black/30"
      style={chartTooltipStyle.contentStyle}
    >
      {label ? <p className="mb-1 text-white/60">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} className="text-white/90" style={{ color: entry.color }}>
          {entry.name}: <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function ProjectsAnalyticsCharts({ data }: { data: ProjectsAnalyticsData }) {
  if (data.totalProjects === 0) {
    return (
      <section className="mt-10">
        <header className="mb-6">
          <h2 className="text-lg font-semibold text-white">Projects analytics</h2>
          <p className="mt-1 text-sm text-white/50">
            Production pipeline, deadlines, and client workload
          </p>
        </header>
        <AnalyticsEmpty message="No projects in the system yet. Add projects to see analytics." />
      </section>
    );
  }

  return (
    <section className="mt-10">
      <header className="mb-6">
        <h2 className="text-lg font-semibold text-white">Projects analytics</h2>
        <p className="mt-1 text-sm text-white/50">
          Production pipeline, deadlines, and client workload across {data.totalProjects} projects
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AnalyticsCard
          title="Projects by status"
          description="Current distribution across the production lifecycle"
        >
          {data.projectsByStatus.length === 0 ? (
            <AnalyticsEmpty message="No status data available." />
          ) : (
            <>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.projectsByStatus}
                      dataKey="count"
                      nameKey="label"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={2}
                      stroke="transparent"
                    >
                      {data.projectsByStatus.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-4 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
                {data.projectsByStatus.map((item) => (
                  <li
                    key={item.status}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5"
                  >
                    <ProjectStatusBadge status={item.status} />
                    <span className="text-xs font-medium text-white/70">{item.count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </AnalyticsCard>

        <AnalyticsCard
          title="Estimated hours by status"
          description="Planned capacity grouped by project status"
        >
          {data.estimatedHoursByStatus.length === 0 ? (
            <AnalyticsEmpty message="No estimated hours recorded on projects." />
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.estimatedHoursByStatus}
                  margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
                >
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={chartAxisStyle}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <ChartTooltip
                        active={active}
                        label={label != null ? String(label) : undefined}
                        payload={payload?.map((p) => ({
                          name: "Hours",
                          value: p.value as number,
                          color: (p.payload as { color: string }).color,
                        }))}
                      />
                    )}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {data.estimatedHoursByStatus.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </AnalyticsCard>

        <AnalyticsCard
          title="Overdue projects"
          description="Past due date and not completed or cancelled"
        >
          {data.overdue.count === 0 ? (
            <AnalyticsEmpty message="No overdue projects — schedule is on track." />
          ) : (
            <>
              <p className="mb-4 text-3xl font-bold tabular-nums text-red-300">
                {data.overdue.count}
              </p>
              <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {data.overdue.projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white/90">{project.name}</p>
                      <p className="truncate text-xs text-white/45">{project.companyName}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <ProjectStatusBadge status={project.status} />
                      <span className="text-xs text-red-300/90">
                        Due {formatDate(new Date(project.dueDateIso))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </AnalyticsCard>

        <AnalyticsCard
          title="Client workload"
          description="Projects and estimated hours per client"
        >
          {data.clientWorkload.length === 0 ? (
            <AnalyticsEmpty message="No client-linked projects to display." />
          ) : (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.clientWorkload.slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid stroke={chartGridStroke} horizontal={false} />
                  <XAxis type="number" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="companyName"
                    tick={chartAxisStyle}
                    axisLine={false}
                    tickLine={false}
                    width={108}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) {
                        return null;
                      }
                      const row = payload[0]?.payload as {
                        companyName: string;
                        projectCount: number;
                        totalEstimatedHours: number;
                      };
                      return (
                        <div className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm shadow-lg">
                          <p className="font-medium text-white">{row.companyName}</p>
                          <p className="text-white/70">{row.projectCount} projects</p>
                          <p className="text-cyan-400">
                            {formatHours(row.totalEstimatedHours)} h estimated
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="totalEstimatedHours"
                    name="Est. hours"
                    fill="#38bdf8"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-3 text-xs text-white/40">
                Showing top {Math.min(10, data.clientWorkload.length)} clients by estimated hours.
                Project counts:{" "}
                {data.clientWorkload
                  .slice(0, 10)
                  .map((c) => `${c.companyName} (${c.projectCount})`)
                  .join(" · ")}
              </p>
            </div>
          )}
        </AnalyticsCard>
      </div>
    </section>
  );
}
