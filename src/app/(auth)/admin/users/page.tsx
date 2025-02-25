import { ProjectResponse, UserResponse } from "juno-sdk/build/main/internal/api";
import { columns, UserColumn } from "./columns";
import { UserDataTable } from "./data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getJunoInstance } from "@/lib/juno";
import { ProjectColumn } from "../projects/columns";

// TODO: As soon as JWT gets merged into Juno, replace with credentials
const ADMIN_EMAIL: string = 'test-superadmin@test.com';
const ADMIN_PASSWORD: string = 'test-password';


async function getUserData(): Promise<UserColumn[]> {
  const client = getJunoInstance();

  const { users } = await client.user.getUsers(ADMIN_EMAIL, ADMIN_PASSWORD);

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    projects: user.projectIds,
    role: user.type
  }));

}

async function getProjectData(): Promise<ProjectResponse[]> {
  const client = getJunoInstance();

  const { projects } = await client.project.getProjects(ADMIN_EMAIL, ADMIN_PASSWORD);

  return projects;
}


export default async function DemoPage() {
  const userData = await getUserData();
  const projectData = await getProjectData();

  return (
    <div className="container mx-auto px-10 py-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1>Users</h1>

      <UserDataTable data={userData} projectData={projectData.map(project => ({ name: project.name, id: project.id.toString() }))} />
    </div>
  );
}
