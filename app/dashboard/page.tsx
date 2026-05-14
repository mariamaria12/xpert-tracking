import { Clock, FolderKanban, Users, Wrench } from "lucide-react";
import StatCard from "@/ui/dashboard/StatCard";

export default function DashboardHomePage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Home</h1>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Projects" value="—" icon={FolderKanban} />
        <StatCard title="Team Members" value="—" icon={Users} />
        <StatCard title="Hours Logged" value="—" icon={Clock} />
        <StatCard title="Tools Available" value="—" icon={Wrench} />
      </div>
      <div className="card py-12 text-center text-sm text-white/40">
        Recent activity will appear here
      </div>
    </div>
  );
}
