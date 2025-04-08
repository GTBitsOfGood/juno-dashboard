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
import { decodeJwt } from "jose";
import { useEffect, useState } from "react";
import { getProjects } from "@/lib/sdkActions";

type ProjectSidebarProps = {
  projectId: number;
};

interface JWTPayload {
  user: {
    type: number;
    projectIds: { low: number }[];
  };
}

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const [projectIds, setProjectIds] = useState<string[]>([]);

  // Get current user through jwt token to create list of project IDs they can access
  useEffect(() => {
    const getAllProjectIds = async () => {
      try {
        const result = await getProjects();
        const projectIdsList =
          result.projects?.map((project) => String(project.id)) || [];
        setProjectIds(projectIdsList);
      } catch (err) {
        console.error("Error fetching all project IDs:", err);
      }
    };

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt-token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = decodeJwt(token) as JWTPayload;
        if (decoded.user?.type == 2) {
          // regular users can only access their linked projects
          const projectIdsList =
            decoded.user?.projectIds?.map((id) => String(id.low)) || [];
          setProjectIds(projectIdsList);
        } else {
          // admin and superadmin can access all projects
          getAllProjectIds();
        }
      } catch (err) {
        console.error("Error decoding JWT:", err);
      }
    }
  }, []);

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
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                defaultValue={"Acme Inc"}
                className="w-[--radix-popper-anchor-width]"
              >
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
