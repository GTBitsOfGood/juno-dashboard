"use client";

import { useUserSession } from "@/components/providers/SessionProvider";
import Image from "next/image";

import { UserDropdown } from "@/components/user-dropdown";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";

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
    <header className="flex items-center h-14 pr-6 bg-black border-b border-white/10 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center h-14 shrink-0 p-5 w-[--sidebar-width]">
        <Image src="/InfraJuno.png" alt="Infra" height={30} width={180} />
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-1 pl-5 items-center">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">{title}</h1>
          <h1 className="text-md font-extralight ml-4">Documentation</h1>
        </div>

        {user && <UserDropdown name={user.name} />}
      </div>
    </header>
  );
}
