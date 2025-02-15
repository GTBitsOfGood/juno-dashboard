"use client"

import { getJunoProject, linkJunoProjectToUser } from "@/lib/sdkActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

const linkProjectToUserSchema = z.object({
  email: z.string().email("Invalid email"),
  userId: z.string().min(1, "User ID is required"),
})

const ProjectPage = () => {
  const { projectId } = useParams();
  
  const [projectName, setProjectName] = useState(null);

  useEffect(() => {
    const displayProjectName = async () => {
      try {
        const res = await getJunoProject({ id: Number(projectId) })
        if (res.success) {
          const name = res.projectName;
          console.log(name)
          setProjectName(name)
        } else {
          console.log(res.error)
        }
      } catch (e) {
        console.error("Error getting project:", e);
      }
      
    };

    displayProjectName();
  }, [projectId]);

  const linkProjectToUserForm = useForm<z.infer<typeof linkProjectToUserSchema>>({
    resolver: zodResolver(linkProjectToUserSchema),
    defaultValues: {
      email: "",
      userId: "",
    },
  });

  const onLinkProjectToUserSubmit = async (values: z.infer<typeof linkProjectToUserSchema>) => {
    console.log("Linking project to user:");
    const options = {
      input: {
        id: Number(projectId),
      },
      email: values.email,
      id: Number(values.userId),
    };
    console.log(options)
    try {
      const res = await linkJunoProjectToUser(options);
      if (res.success) {
        alert("Project successfully linked to user");
      } else {
        console.log(res.error)
        alert("Project not successfully linked to user")
      }
    } catch (e) {
      console.error("Error linking project to user:", e);
    }
    
  }
  
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl">{projectName}</h1>
      <Form {...linkProjectToUserForm}>
        <form onSubmit={linkProjectToUserForm.handleSubmit(onLinkProjectToUserSubmit)} className="space-y-8">
          <FormField
            control={linkProjectToUserForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={linkProjectToUserForm.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ProjectPage;
