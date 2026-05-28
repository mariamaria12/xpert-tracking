import Link from "next/link";
import { Clock, FolderKanban, Users, Building2 } from "lucide-react";
import StatCard from "@/ui/dashboard/StatCard";

import ActiveClientsPanel from "./ActiveClientsPanel";
import ActiveProjectsPanel from "./ActiveProjectsPanel";
import { getHomeDashboardData } from "./getHomeData";

function formatHours(hours: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(hours);
}

export default async function DashboardHomePage() {
  const {
    teamMembersCount,
    hoursLogged,
    activeProjectsCount,
    activeClientsCount,
    activeClients,
    activeProjects,
  } = await getHomeDashboardData();

  const activeProjectsValue =
    activeProjectsCount === null ? "—" : activeProjectsCount;

  const teamMembersValue =
    teamMembersCount === null ? "—" : teamMembersCount;

  const hoursLoggedValue =
    hoursLogged === null ? "—" : formatHours(hoursLogged);

  const activeClientsValue =
    activeClientsCount === null ? "—" : activeClientsCount;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Home</h1>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/projects" className="block">
          <StatCard title="Active Projects" value={activeProjectsValue} icon={FolderKanban} />
        </Link>
        <Link href="/dashboard/people" className="block">
          <StatCard title="Team Members" value={teamMembersValue} icon={Users} />
        </Link>
        <Link href="/dashboard/timesheet" className="block">
          <StatCard title="Hours Logged" value={hoursLoggedValue} icon={Clock} />
        </Link>
        <Link href="/dashboard/clients" className="block">
          <StatCard title="Active Clients" value={activeClientsValue} icon={Building2} />
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveProjectsPanel projects={activeProjects} />
        <ActiveClientsPanel clients={activeClients} />
      </div>
    </div>
  );
}
