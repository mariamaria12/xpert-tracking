"use client";

import { Bell, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";

function titleFromPath(pathname: string): string {
  if (pathname === "/dashboard") return "Home";
  if (pathname.startsWith("/dashboard/projects")) return "Projects";
  if (pathname.startsWith("/dashboard/people")) return "People";
  if (pathname.startsWith("/dashboard/timesheet")) return "Timesheet";
  if (pathname.startsWith("/dashboard/tools")) return "Tools";
  return "Dashboard";
}

type TopbarProps = {
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
};

export default function Topbar({
  onToggleSidebar,
  sidebarExpanded,
}: TopbarProps) {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#111827] px-4 sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          onClick={onToggleSidebar}
          aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={sidebarExpanded}
        >
          <PanelLeft className="h-5 w-5" aria-hidden />
        </button>
        <h1 className="truncate text-base font-semibold text-white sm:text-lg">
          {title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <input
          type="search"
          placeholder="Search…"
          aria-label="Search"
          className="hidden w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:block lg:w-48"
        />
        <button
          type="button"
          className="text-white/70 transition hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-bold text-cyan-400"
          aria-hidden
        >
          T
        </div>
      </div>
    </header>
  );
}
