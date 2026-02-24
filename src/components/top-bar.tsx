"use client";

import { useUserSession } from "@/components/providers/SessionProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/users") return "Users";
  if (pathname === "/admin/projects") return "Projects";
  if (pathname === "/admin/keys") return "API Keys";
  if (pathname === "/admin/settings") return "Settings";

  const projectMatch = pathname.match(/^\/projects\/\d+(.*)$/);
  if (projectMatch) {
    const sub = projectMatch[1];
    if (!sub || sub === "/") return "Dashboard";
    if (sub === "/users") return "Users";
    if (sub === "/services/email") return "Email";
    if (sub === "/services/files") return "Files";
    if (sub === "/settings") return "Settings";
  }

  return "Dashboard";
}

export function TopBar() {
  const session = useUserSession();
  const user = session?.user;
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-sidebar shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {user && <UserDropdown name={user.name} />}
    </header>
  );
}
