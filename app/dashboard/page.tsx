import Link from "next/link";
import { Suspense } from "react";
import { Clock, FolderKanban, Users, Building2 } from "lucide-react";
import StatCard from "@/ui/dashboard/StatCard";

import ActiveClientsSection from "./ActiveClientsSection";
import ActiveProjectsSection from "./ActiveProjectsSection";
import ProjectsAnalyticsSection from "./ProjectsAnalyticsSection";
import {
  ActiveClientsPanelSkeleton,
  ActiveProjectsPanelSkeleton,
  ProjectsAnalyticsSkeleton,
} from "./skeletons";
import { getHomeStatCardsData } from "@/lib/services/home/home.service";

function formatHours(hours: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(hours);
}

export default async function DashboardHomePage() {
  const { teamMembersCount, hoursLogged, activeProjectsCount, activeClientsCount } =
    await getHomeStatCardsData();

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
        <Link href="/dashboard/projects" prefetch={false} className="block">
          <StatCard title="Active Projects" value={activeProjectsValue} icon={FolderKanban} />
        </Link>
        <Link href="/dashboard/people" prefetch={false} className="block">
          <StatCard title="Team Members" value={teamMembersValue} icon={Users} />
        </Link>
        <Link href="/dashboard/timesheet" prefetch={false} className="block">
          <StatCard title="Hours Logged" value={hoursLoggedValue} icon={Clock} />
        </Link>
        <Link href="/dashboard/clients" prefetch={false} className="block">
          <StatCard title="Active Clients" value={activeClientsValue} icon={Building2} />
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ActiveProjectsPanelSkeleton />}>
          <ActiveProjectsSection />
        </Suspense>
        <Suspense fallback={<ActiveClientsPanelSkeleton />}>
          <ActiveClientsSection />
        </Suspense>
      </div>

      <Suspense fallback={<ProjectsAnalyticsSkeleton />}>
        <ProjectsAnalyticsSection />
      </Suspense>
    </div>
  );
}
