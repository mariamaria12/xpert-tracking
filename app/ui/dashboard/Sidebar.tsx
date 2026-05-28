"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings2,
  Truck,
  Users,
  Handshake,
  Wrench
} from "lucide-react";
import { NavItem } from "@/ui/types";

const mainNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "People", href: "/dashboard/people", icon: Users },
  { label: "Clients", href: "/dashboard/clients", icon: Handshake },
  { label: "Timesheet", href: "/dashboard/timesheet", icon: Clock },
  { label: "Tools", href: "/dashboard/tools", icon: Wrench },
] as const;

type SidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

function navLinkClass(active: boolean, expanded: boolean) {
  return cn(
    "flex items-center rounded-lg py-2 transition",
    expanded ? "gap-3 px-3" : "justify-center px-2",
    active
      ? expanded
        ? "nav-active"
        : "bg-cyan-400/10 text-cyan-400"
      : expanded
        ? "nav-idle"
        : "text-white/70 hover:bg-white/5 hover:text-white",
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/10 bg-[#111827] transition-[width] duration-200",
        expanded ? "w-64" : "w-20",
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-3">
        <Truck className="h-7 w-7 shrink-0 text-[#22D3EE]" aria-hidden />
        {expanded ? (
          <span className="min-w-0 flex-1 truncate font-bold text-[#22D3EE]">
            trackingXpert
          </span>
        ) : (
          <span className="sr-only">trackingXpert</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronLeft className="h-5 w-5" aria-hidden />
          ) : (
            <ChevronRight className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {mainNav.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={expanded ? undefined : label}
              aria-label={label}
              className={navLinkClass(active, expanded)}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {expanded ? <span>{label}</span> : null}
            </Link>
          );
        })}
        <div className="mt-auto flex flex-col gap-1 pt-4">
          <Link
            href="/dashboard/settings"
            title={expanded ? undefined : "Settings"}
            aria-label="Settings"
            className={navLinkClass(
              pathname.startsWith("/dashboard/settings"),
              expanded,
            )}
          >
            <Settings2 className="h-5 w-5 shrink-0" aria-hidden />
            {expanded ? <span>Settings</span> : null}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              title={expanded ? undefined : "Logout"}
              aria-label="Logout"
              className={cn(navLinkClass(false, expanded), "w-full")}
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden />
              {expanded ? <span>Logout</span> : null}
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
