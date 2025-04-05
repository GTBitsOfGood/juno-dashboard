import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  linkUserToProject,
  setUserTypeAction,
  unlinkUserFromProject,
} from "@/lib/actions";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { InputMultiSelect, InputMultiSelectTrigger } from "../ui/multiselect";
import { useState } from "react";
import { ProjectColumn } from "@/app/(auth)/admin/projects/columns";
import { UserColumn } from "@/components/usertable/columns";

const userTypeMap = {
  SUPERADMIN: 0,
  ADMIN: 1,
  USER: 2,
} as const;

const userTypeEnum = z.enum(
  Object.keys(userTypeMap) as [keyof typeof userTypeMap],
);

const setUserTypeSchema = z.object({
  userEmail: z.string().email("Invalid user email"),
  userType: userTypeEnum,
  projects: z.array(z.number()),
});

const EditUserForm = ({
  projectData,
  initialUserData,
  onUserUpdate,
}: {
  projectData: ProjectColumn[];
  initialUserData: UserColumn;
  onUserUpdate?: (updatedUser: UserColumn) => void;
}) => {
  const setUserTypeForm = useForm<z.infer<typeof setUserTypeSchema>>({
    resolver: zodResolver(setUserTypeSchema),
    defaultValues: {
      userEmail: initialUserData.email,
      userType: initialUserData.role as unknown as
        | "SUPERADMIN"
        | "ADMIN"
        | "USER",
      projects: initialUserData.projects || [],
    },
  });

  const handleSetUserType = async (
    data: Required<z.infer<typeof setUserTypeSchema>>,
  ) => {
    try {
      // Update user type
      const result = await setUserTypeAction({
        type: data.userType as unknown as SetUserTypeModel.TypeEnum, //May not be good
        email: data.userEmail,
      });

      if (!result.success) {
        toast.error("Error", {
          description: "Failed to edit user type",
        });
        return;
      }

      const initialProjectIds = initialUserData.projects
        ? initialUserData.projects.map((id) => id.toString())
        : [];

      // Find projects to unlink (in initial but not in selected)
      const projectsToUnlink = initialProjectIds.filter(
        (id) => !selectedProjects.includes(id),
      );

      // Find projects to link (in selected but not in initial)
      const projectsToLink = selectedProjects.filter(
        (id) => !initialProjectIds.includes(id),
      );

      // Unlink projects that were removed
      const unlinkPromises = projectsToUnlink.map((projectId) => {
        const projectName = projectData.find(
          (p) => parseInt(p.id) === parseInt(projectId),
        )?.name;
        return unlinkUserFromProject({
          projectName,
          userId: initialUserData.id.toString(),
        });
      });

      // Link projects that were added
      const linkPromises = projectsToLink.map((projectId) => {
        const projectName = projectData.find(
          (p) => parseInt(p.id) === parseInt(projectId),
        )?.name;
        return linkUserToProject({
          projectName,
          userId: initialUserData.id.toString(),
        });
      });

      // Execute all project operations
      const unlinkResults = await Promise.all(unlinkPromises);
      const linkResults = await Promise.all(linkPromises);

      const failedUnlinks = unlinkResults.filter((result) => !result.success);
      const failedLinks = linkResults.filter((result) => !result.success);

      if (failedUnlinks.length > 0 || failedLinks.length > 0) {
        toast.error("Error", {
          description: "Failed to update some project associations",
        });
      } else {
        // Update the local state with the new user data
        const updatedUser: UserColumn = {
          ...initialUserData,
          email: data.userEmail,
          role: data.userType as unknown as UserColumn["role"],
          projects: selectedProjects.map((id) => parseInt(id)),
        };
        onUserUpdate?.(updatedUser);
        toast.success("Success", {
          description: `${initialUserData.name} has been updated successfully!`,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error", {
        description: "Failed to update user",
      });
    }
  };

  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    initialUserData.projects
      ? initialUserData.projects.map((id) => id.toString())
      : [],
  );

  const projectOptions = projectData.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  // TODO: remove admin fields, replace with jwt
  return (
    <Form {...setUserTypeForm}>
      <form
        onSubmit={setUserTypeForm.handleSubmit(handleSetUserType)}
        className="space-y-4 p-2 rounded-lg"
      >
        <FormField
          control={setUserTypeForm.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={setUserTypeForm.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(userTypeMap).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={setUserTypeForm.control}
          name="projects"
          render={() => (
            <FormItem>
              <FormLabel>Projects</FormLabel>
              <InputMultiSelect
                options={projectOptions}
                value={selectedProjects}
                onValueChange={(p) => setSelectedProjects(p)}
              >
                {(provided) => <InputMultiSelectTrigger {...provided} />}
              </InputMultiSelect>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update User</Button>
      </form>
    </Form>
  );
};

export default EditUserForm;
