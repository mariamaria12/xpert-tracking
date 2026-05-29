import { getProjectsAnalyticsData } from "@/lib/services/home/projectsAnalytics.service";

import dynamic from "next/dynamic";

import { ProjectsAnalyticsSkeleton } from "./skeletons";

const ProjectsAnalyticsCharts = dynamic(() => import("./projects-analytics/ProjectsAnalyticsCharts"), {
  loading: () => <ProjectsAnalyticsSkeleton />,
});

export default async function ProjectsAnalyticsSection() {
  const data = await getProjectsAnalyticsData();
  return <ProjectsAnalyticsCharts data={data} />;
}
