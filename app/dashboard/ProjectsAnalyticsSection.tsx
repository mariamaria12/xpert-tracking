import { getProjectsAnalyticsData } from "@/lib/services/home/projectsAnalytics.service";

import ProjectsAnalyticsCharts from "./projects-analytics/ProjectsAnalyticsCharts";

export default async function ProjectsAnalyticsSection() {
  const data = await getProjectsAnalyticsData();
  return <ProjectsAnalyticsCharts data={data} />;
}
