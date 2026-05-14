"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

function titleFromPath(pathname: string): string {
  if (pathname === "/dashboard") return "Home";
  if (pathname.startsWith("/dashboard/projects")) return "Projects";
  if (pathname.startsWith("/dashboard/people")) return "People";
  if (pathname.startsWith("/dashboard/timesheet")) return "Timesheet";
  if (pathname.startsWith("/dashboard/tools")) return "Tools";
  return "Dashboard";
}

export default function Topbar() {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#111827] px-6">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search…"
          aria-label="Search"
          className="w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
