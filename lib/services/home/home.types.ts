export type ActiveProjectSummary = {
  id: string;
  name: string;
  companyName: string;
  status: string;
  estimatedHours: number | null;
  actualHours: number;
  dueDate: Date | null;
};

export type HomeDashboardData = {
  teamMembersCount: number | null;
  hoursLogged: number | null;
  activeProjectsCount: number | null;
  activeProjects: ActiveProjectSummary[];
};

