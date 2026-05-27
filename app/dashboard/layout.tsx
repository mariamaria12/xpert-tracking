import { redirect } from "next/navigation";

import DashboardShell from "@/ui/dashboard/DashboardShell";
import { auth } from "auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
