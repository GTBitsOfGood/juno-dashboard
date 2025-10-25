"use client";

import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  User,
  Mail,
  Files,
  LogOut,
  RollerCoaster,
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

  const [projectIds, setProjectIds] = useState<string[]>([]);

  // Get current user through jwt token to create list of project IDs they can access
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const getAllProjectIds = async () => {
          try {
            const result = await getProjects();
            const projectIdsList =
              result.projects?.map((project) => String(project.id)) || [];
            setProjectIds(projectIdsList);
          } catch (err) {
            console.error(err);
          }
        };

        if (user.type == UserType.USER) {
          // TODO: this filtering needs to be done on Juno's side
          // regular users can only access their linked projects
          const projectIdsList =
            user.projectIds.map((id) => String(id.low)) || [];
          setProjectIds(projectIdsList);
        } else {
          // admin and superadmin can access all projects
          getAllProjectIds();
        }
      } catch (err) {
        console.error("Error fetching all project IDs:", err);
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
      title: "Analytics",
      url: `/projects/${projectId}/services/analytics`,
      icon: RollerCoaster,
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
                  {currProjName || "Select Project"}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {user !== null &&
                (user.type === UserType.ADMIN ||
                  user.type === UserType.SUPERADMIN) ? (
                  <DropdownMenuItem asChild key={"admin"}>
                    <a href={"/admin"}>
                      <span>{`Admin Dashboard`}</span>
                    </a>
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                {projectIds.length > 0 ? (
                  projectIds.map((id) => (
                    <DropdownMenuItem asChild key={id}>
                      <a href={`/projects/${id}`}>
                        <span>{`Project ${id}`}</span>
                      </a>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>
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
