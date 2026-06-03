import { cookies } from "next/headers";

import {
  getProjectStatusChartColor,
  getProjectStatusLabel,
  getProjectStatusStyle,
} from "@/lib/services/projects/projectStatusStyles";
import { createClient } from "@/lib/supabase/server";

import type {
  ClientWorkloadItem,
  EstimatedHoursByStatusItem,
  OverdueProjectItem,
  ProjectsAnalyticsData,
  ProjectsByStatusItem,
} from "./projectsAnalytics.types";
import type { Database } from "@/lib/types/database";

type ProjectAnalyticsDbRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  "id" | "name" | "status" | "estimated_hours" | "due_date" | "client_id"
> & {
  client?: { company_name: string | null } | { company_name: string | null }[] | null;
};

function pickCompanyName(value: ProjectAnalyticsDbRow["client"]) {
  if (!value) {
    return "—";
  }
  const item = Array.isArray(value) ? value[0] : value;
  return item?.company_name?.trim() || "—";
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isTerminalStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  return normalized === "completed" || normalized === "cancelled";
}

export async function getProjectsAnalyticsData(): Promise<ProjectsAnalyticsData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const today = startOfToday();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status, estimated_hours, due_date, client_id, client:clients(company_name)");

  if (error) {
    console.error("Failed to load projects analytics:", error);
    return emptyAnalytics();
  }

  const rows = (projects ?? []) as ProjectAnalyticsDbRow[];
  if (rows.length === 0) {
    return emptyAnalytics();
  }

  const statusCounts = new Map<string, number>();
  const hoursByStatus = new Map<string, number>();
  const workloadByClient = new Map<string, ClientWorkloadItem>();
  const overdueProjects: OverdueProjectItem[] = [];

  for (const project of rows) {
    const status = project.status?.trim() || "unknown";

    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);

    const estimated = project.estimated_hours === null ? 0 : Number(project.estimated_hours);
    if (estimated > 0) {
      hoursByStatus.set(status, (hoursByStatus.get(status) ?? 0) + estimated);
    }

    if (project.due_date) {
      const dueDate = new Date(project.due_date);
      if (!Number.isNaN(dueDate.getTime()) && dueDate < today && !isTerminalStatus(status)) {
        overdueProjects.push({
          id: project.id,
          name: project.name,
          companyName: pickCompanyName(project.client),
          status,
          dueDateIso: project.due_date,
        });
      }
    }

    const clientId = project.client_id;
    if (clientId) {
      const existing = workloadByClient.get(clientId);
      workloadByClient.set(clientId, {
        clientId,
        companyName: pickCompanyName(project.client),
        projectCount: (existing?.projectCount ?? 0) + 1,
        totalEstimatedHours: (existing?.totalEstimatedHours ?? 0) + Math.max(0, estimated),
      });
    }
  }

  const projectsByStatus: ProjectsByStatusItem[] = Array.from(statusCounts.entries())
    .map(([status, count]) => {
      const style = getProjectStatusStyle(status);
      return {
        status,
        label: getProjectStatusLabel(status),
        count,
        color: style.chartColor,
        badgeClassName: style.badgeClassName,
      };
    })
    .sort((a, b) => b.count - a.count);

  const estimatedHoursByStatus: EstimatedHoursByStatusItem[] = Array.from(hoursByStatus.entries())
    .map(([status, hours]) => ({
      status,
      label: getProjectStatusLabel(status),
      hours,
      color: getProjectStatusChartColor(status),
    }))
    .sort((a, b) => b.hours - a.hours);

  const clientWorkload = Array.from(workloadByClient.values()).sort(
    (a, b) => b.totalEstimatedHours - a.totalEstimatedHours || b.projectCount - a.projectCount
  );

  overdueProjects.sort((a, b) => a.dueDateIso.localeCompare(b.dueDateIso));

  return {
    projectsByStatus,
    overdue: {
      count: overdueProjects.length,
      projects: overdueProjects,
    },
    estimatedHoursByStatus,
    clientWorkload,
    totalProjects: rows.length,
  };
}

function emptyAnalytics(): ProjectsAnalyticsData {
  return {
    projectsByStatus: [],
    overdue: { count: 0, projects: [] },
    estimatedHoursByStatus: [],
    clientWorkload: [],
    totalProjects: 0,
  };
}
