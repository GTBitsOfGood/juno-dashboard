"use client";

import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  User,
  Mail,
  Files,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteJWT } from "@/lib/actions";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type ProjectSidebarProps = {
  projectId: number;
};

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/projects",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: `/projects/${projectId}/users`,
      icon: User,
    },
    {
      title: "Email",
      url: `/projects/${projectId}/services/email`,
      icon: Mail,
    },
    {
      title: "Files",
      url: `/projects/${projectId}/services/files`,
      icon: Files,
    },
    {
      title: "Settings",
      url: `/projects/${projectId}/settings`,
      icon: Settings,
    },
  ];

  const router = useRouter();
  async function logOut() {
    await deleteJWT();
    router.push("/admin");
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                defaultValue={"Acme Inc"}
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={logOut}>
                    <LogOut className="text-red-300 h-6 w-6" />

                    <div className="text-red-300">Logout</div>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
