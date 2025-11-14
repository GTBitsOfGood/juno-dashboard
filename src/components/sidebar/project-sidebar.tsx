"use client";

import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  User,
  Mail,
  Files,
  LogOut,
  Shield,
  FolderKanban,
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getProjects } from "@/lib/sdkActions";
import { UserType, useUserSession } from "../providers/SessionProvider";

type ProjectSidebarProps = {
  projectId: number;
  currProjName?: string;
};

export function ProjectSidebar({
  currProjName,
  projectId,
}: ProjectSidebarProps) {
  const { user } = useUserSession();

  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>(
    [],
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const getAllProjects = async () => {
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

        if (user.type == UserType.USER) {
          const getAllProjectsForUser = async () => {
            try {
              const result = await getProjects();
              const userProjectIds = new Set(user.projectIds);
              const projectsList =
                result.projects
                  ?.filter((project) => userProjectIds.has(project.id))
                  .map((project) => ({
                    id: project.id,
                    name: project.name,
                  })) || [];
              setProjects(projectsList);
            } catch (err) {
              console.error(err);
            }
          };
          getAllProjectsForUser();
        } else {
          // admin and superadmin can access all projects
          getAllProjects();
        }
      } catch (err) {
        console.error("Error fetching all projects:", err);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: `/projects/${projectId}`,
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
                <SidebarMenuButton className="h-12 px-4 hover:bg-accent/50 data-[state=open]:bg-accent/50 border border-white/10 rounded-lg font-semibold">
                  {currProjName || "Select Project"}
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {user !== null &&
                (user.type === UserType.ADMIN ||
                  user.type === UserType.SUPERADMIN) ? (
                  <>
                    <DropdownMenuItem asChild key={"admin"}>
                      <a href={"/admin"} className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </a>
                    </DropdownMenuItem>
                    {projects.length > 0 && <DropdownMenuSeparator />}
                  </>
                ) : (
                  <></>
                )}
                {projects.length > 0 ? (
                  <>
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
                ) : (
                  <DropdownMenuItem disabled>
                    <span>No available projects</span>
                  </DropdownMenuItem>
                )}
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
