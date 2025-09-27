import { UserSessionProvider } from "@/components/providers/SessionProvider";
import { ReactNode } from "react";

interface ProjectsLayoutProps {
  children: ReactNode;
}

const ProjectsLayout = async ({ children }: ProjectsLayoutProps) => {
  return <UserSessionProvider>{children}</UserSessionProvider>;
};

export default ProjectsLayout;
