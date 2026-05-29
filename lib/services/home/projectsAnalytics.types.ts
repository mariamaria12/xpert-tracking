export type ProjectsByStatusItem = {
  status: string;
  label: string;
  count: number;
  color: string;
  badgeClassName: string;
};

export type OverdueProjectItem = {
  id: string;
  name: string;
  companyName: string;
  status: string;
  dueDateIso: string;
};

export type EstimatedHoursByStatusItem = {
  status: string;
  label: string;
  hours: number;
  color: string;
};

export type ClientWorkloadItem = {
  clientId: string;
  companyName: string;
  projectCount: number;
  totalEstimatedHours: number;
};

export type ProjectsAnalyticsData = {
  projectsByStatus: ProjectsByStatusItem[];
  overdue: {
    count: number;
    projects: OverdueProjectItem[];
  };
  estimatedHoursByStatus: EstimatedHoursByStatusItem[];
  clientWorkload: ClientWorkloadItem[];
  totalProjects: number;
};
