import { Clock, FolderKanban, Users, Wrench } from "lucide-react";
import StatCard from "@/ui/dashboard/StatCard";

import ActiveProjectsPanel from "./ActiveProjectsPanel";
import { getHomeDashboardData } from "./getHomeData";

function formatHours(hours: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(hours);
}

export default async function DashboardHomePage() {
  const { teamMembersCount, hoursLogged, activeProjectsCount, activeProjects } =
    await getHomeDashboardData();

  const activeProjectsValue =
    activeProjectsCount === null ? "—" : activeProjectsCount;

  const teamMembersValue =
    teamMembersCount === null ? "—" : teamMembersCount;

  const hoursLoggedValue =
    hoursLogged === null ? "—" : formatHours(hoursLogged);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Home</h1>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Projects" value={activeProjectsValue} icon={FolderKanban} />
        <StatCard title="Team Members" value={teamMembersValue} icon={Users} />
        <StatCard title="Hours Logged" value={hoursLoggedValue} icon={Clock} />
        <StatCard title="Tools Available" value="—" icon={Wrench} />
      </div>
      <ActiveProjectsPanel projects={activeProjects} />
    </div>
  );
}
