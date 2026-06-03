import { cn } from "@/lib/utils";

import type { LastLogDisplay } from "./lastLogDisplay";

const statusStyles = {
  green: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 [&_.time]:text-emerald-200/90",
  yellow: "border-amber-500/50 bg-amber-500/10 text-amber-300 [&_.time]:text-amber-200/90",
  red: "border-red-500/50 bg-red-500/10 text-red-300 [&_.time]:text-red-200/90",
} as const;

export default function LastLogCard({ display }: { display: LastLogDisplay | null }) {
  if (!display) {
    return <span className="text-white/30">—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-[4.75rem] flex-col items-center rounded-2xl border px-3 py-1 text-center leading-tight",
        statusStyles[display.status]
      )}
      title={display.title}
    >
      <span className="text-[11px] font-semibold">{display.dayLabel}</span>
      <span className="time mt-0.5 text-xs font-medium tabular-nums leading-tight">
        at {display.timeLabel}
      </span>
    </span>
  );
}
