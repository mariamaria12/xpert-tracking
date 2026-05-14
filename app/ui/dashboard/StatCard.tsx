import type { StatCardProps } from "@/lib/definitions";

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="card">
      <div className="inline-flex rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/50">{title}</p>
    </div>
  );
}
