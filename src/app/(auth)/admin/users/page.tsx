import { Button } from "@/components/ui/button"
import { UserColumn, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<UserColumn[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "1",
      name: "Bob",
      email: "bob@gmail.com",
      role: "ADMIN",
      projects: [
        "1",
        "2",
        "3"
      ]
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto px-10 py-10">
      <div className="items-center flex justify-end py-4">
        <Button>
          Add User
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
