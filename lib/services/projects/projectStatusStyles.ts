import { formatProjectStatusLabel } from "./projectStatuses";

export type ProjectStatusStyle = {
  badgeClassName: string;
  chartColor: string;
};

const completedStyle: ProjectStatusStyle = {
  badgeClassName: "bg-emerald-400/10 text-emerald-400",
  chartColor: "#34d399",
};

const cancelledStyle: ProjectStatusStyle = {
  badgeClassName: "bg-red-400/10 text-red-300",
  chartColor: "#f87171",
};

const onHoldStyle: ProjectStatusStyle = {
  badgeClassName: "bg-amber-400/10 text-amber-300",
  chartColor: "#fbbf24",
};

const preProductionStyle: ProjectStatusStyle = {
  badgeClassName: "bg-white/10 text-white/50",
  chartColor: "#9ca3af",
};

const productionStyle: ProjectStatusStyle = {
  badgeClassName: "bg-cyan-400/10 text-cyan-400",
  chartColor: "#22d3ee",
};

export function getProjectStatusStyle(status: string): ProjectStatusStyle {
  const normalized = status.trim().toLowerCase();

  if (normalized === "completed") {
    return completedStyle;
  }
  if (normalized === "cancelled") {
    return cancelledStyle;
  }
  if (normalized === "on_hold") {
    return onHoldStyle;
  }
  if (normalized === "draft" || normalized === "quoted" || normalized === "approved") {
    return preProductionStyle;
  }

  return productionStyle;
}

export function getProjectStatusBadgeClassName(status: string) {
  return getProjectStatusStyle(status).badgeClassName;
}

export function getProjectStatusChartColor(status: string) {
  return getProjectStatusStyle(status).chartColor;
}

export function getProjectStatusLabel(status: string) {
  return status.trim() ? formatProjectStatusLabel(status) : "—";
}
