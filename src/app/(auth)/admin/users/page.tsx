import { UserColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getData(): Promise<UserColumn[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: ["1", "2", "3"],
    },
  ];
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

      <DataTable columns={columns} data={data} />
    </div>
  );
}
