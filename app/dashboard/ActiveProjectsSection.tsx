import { getActiveHomePanelsData } from "@/lib/services/home/home.service";

import ActiveProjectsPanel from "./ActiveProjectsPanel";

export default async function ActiveProjectsSection() {
  const { activeProjects } = await getActiveHomePanelsData();
  return <ActiveProjectsPanel projects={activeProjects} />;
}
