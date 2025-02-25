import { UserResponse } from "juno-sdk/build/main/internal/api";
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

// TODO: As soon as JWT gets merged into Juno, replace with credentials
const ADMIN_EMAIL = 'test-superadmin@test.com';
const ADMIN_PASSWORD = 'test-password';


async function getData(): Promise<UserColumn[]> {
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

export default async function DemoPage() {
  const data = await getData();

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

      <UserDataTable columns={columns} data={data} />
    </div>
  );
}
