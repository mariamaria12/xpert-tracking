import { cn } from "@/lib/utils";

import type { HoursWeekDisplay } from "./hoursWeekDisplay";

const dotStyles = {
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-red-400",
} as const;

export default function HoursWeekCard({
  display,
}: {
  display: HoursWeekDisplay | null;
}) {
  if (!display) {
    return <span className="text-white/30">—</span>;
  }

  return (
    <span
      className="inline-flex items-center gap-2"
      title={display.title}
    >
      <span
        className={cn("size-2 shrink-0 rounded-full", dotStyles[display.status])}
        aria-hidden
      />
      <span className="text-sm font-medium tabular-nums text-white/80">
        {display.label}
      </span>
    </span>
  );
}
