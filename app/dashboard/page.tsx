import { Clock, FolderKanban, Users, Wrench } from "lucide-react";
import StatCard from "@/ui/dashboard/StatCard";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

function formatHours(hours: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(hours);
}

export default async function DashboardHomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ count: teamMembersCount, error: teamMembersError }, { data: timeLogs, error: timeLogsError }] =
    await Promise.all([
      supabase
        .from("employees")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("time_logs").select("duration_minutes"),
    ]);

  const teamMembersValue =
    teamMembersError || teamMembersCount === null ? "—" : teamMembersCount;

  const totalMinutes =
    timeLogsError || !timeLogs
      ? null
      : timeLogs.reduce((sum, row) => sum + Number(row.duration_minutes ?? 0), 0);

  const hoursLoggedValue =
    totalMinutes === null ? "—" : formatHours(totalMinutes / 60);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Home</h1>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Projects" value="—" icon={FolderKanban} />
        <StatCard title="Team Members" value={teamMembersValue} icon={Users} />
        <StatCard title="Hours Logged" value={hoursLoggedValue} icon={Clock} />
        <StatCard title="Tools Available" value="—" icon={Wrench} />
      </div>
      <div className="card py-12 text-center text-sm text-white/40">
        Recent activity will appear here
      </div>
    </div>
  );
}
