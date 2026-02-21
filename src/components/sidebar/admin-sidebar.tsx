"use client";
import {
  ChevronDown,
  LayoutDashboard,
  ListTodo,
  Settings,
  User,
  KeyRound,
  Shield,
  FolderKanban,
} from "lucide-react";
import Image from "next/image";

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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { useUserSession } from "../providers/SessionProvider";
import { useEffect, useState } from "react";
import { getProjects } from "@/lib/sdkActions";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Projects",
    url: "/admin/projects",
    icon: ListTodo,
  },
  {
    title: "API Keys",
    url: "/admin/keys",
    icon: KeyRound,
  },
  {
    title: "Settings",
    url: "/admin/projects",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { user } = useUserSession();

  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>(
    [],
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getProjects();
        const projectsList =
          result.projects?.map((project) => ({
            id: project.id,
            name: project.name,
          })) || [];

        setProjects(projectsList);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <Sidebar className="border-transparent">
      <SidebarHeader className="p-0 gap-0">
        <div className="flex items-center h-14 px-4 shrink-0">
          <Image src="/infra_logo.png" alt="Infra" height={21} width={75} />
        </div>
        <div className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-12 px-4 hover:bg-accent/50 data-[state=open]:bg-accent/50 border border-white/10 rounded-lg font-semibold">
                    {"Admin Dashboard"}
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem asChild key={"admin"}>
                    <a href={"/admin"} className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </a>
                  </DropdownMenuItem>

                  {projects.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Projects</DropdownMenuLabel>
                      {projects.map((project) => (
                        <DropdownMenuItem asChild key={project.id}>
                          <a
                            href={`/projects/${project.id}`}
                            className="flex items-center gap-2"
                          >
                            <FolderKanban className="h-4 w-4" />
                            <span>{project.name}</span>
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
