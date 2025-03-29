"use client";

import {
  getJunoProject,
  linkJunoProjectToUser,
  userInputType,
} from "@/lib/sdkActions";
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
import { toast } from "sonner";

const linkProjectToUserSchema = z.object({
  user: z.string().min(1, "Email or ID is required"),
});

const ProjectPage = () => {
  const { projectId } = useParams();

  const [projectName, setProjectName] = useState(null);

  useEffect(() => {
    const displayProjectName = async () => {
      try {
        const res = await getJunoProject({ id: Number(projectId) });
        if (res.success) {
          const name = res.projectName;
          setProjectName(name);
        } else {
          toast.error("Error", {
            description: "Failed to get project",
          });
        }
      } catch (e) {
        console.error("Error getting project:", e);
      }
    };

    displayProjectName();
  }, [projectId]);

  const linkProjectToUserForm = useForm<
    z.infer<typeof linkProjectToUserSchema>
  >({
    resolver: zodResolver(linkProjectToUserSchema),
    defaultValues: {
      user: "",
    },
  });

  const onLinkProjectToUserSubmit = async (
    values: z.infer<typeof linkProjectToUserSchema>
  ) => {
    const options = {
      project: {
        id: Number(projectId),
      },
      user: (isNaN(Number(values.user))
        ? { email: values.user }
        : { id: Number(values.user) }) as userInputType,
    };

    try {
      const res = await linkJunoProjectToUser(options);
      if (res.success) {
        toast.success("Success", {
          description: "Project successfully linked to user!",
        });
      } else {
        toast.error("Error", {
          description:
            "Failed to link project to user. Make sure your email or ID is valid!",
        });
      }
    } catch (e) {
      console.error("Error linking project to user:", e);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl">{projectName}</h1>
      <Form {...linkProjectToUserForm}>
        <form
          onSubmit={linkProjectToUserForm.handleSubmit(
            onLinkProjectToUserSubmit
          )}
          className="space-y-8"
        >
          <FormField
            control={linkProjectToUserForm.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Email or ID</FormLabel>
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
