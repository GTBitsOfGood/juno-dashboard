import { ReactNode } from "react";

interface ProjectsLayoutProps {
  children: ReactNode;
}

const ProjectsLayout = async ({ children }: ProjectsLayoutProps) => {
  return (
    <>
      {children}
    </>
  )

}

export default ProjectsLayout;
