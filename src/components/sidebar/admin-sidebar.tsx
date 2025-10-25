"use client";
import {
  ChevronDown,
  LayoutDashboard,
  ListTodo,
  Settings,
  User,
  LogOut,
  KeyRound,
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

  const [projectIds, setProjectIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getProjects();
        const projectIdsList =
          result.projects?.map((project) => String(project.id)) || [];

        setProjectIds(projectIdsList);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, [user]);

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
                  {"Admin Dashboard"}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild key={"admin"}>
                  <a href={"/admin"}>
                    <span>{`Admin Dashboard`}</span>
                  </a>
                </DropdownMenuItem>

                {projectIds.map((id) => (
                  <DropdownMenuItem asChild key={id}>
                    <a href={`/projects/${id}`}>
                      <span>{`Project ${id}`}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
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
