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
import { setUserTypeAction } from "@/lib/actions";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InputMultiSelect, InputMultiSelectTrigger } from "../ui/multiselect";
import { useState } from "react";
import { ProjectColumn } from "@/app/(auth)/admin/projects/columns";
import { UserColumn } from "@/app/(auth)/admin/users/columns";

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
}: {
  projectData: ProjectColumn[];
  initialUserData: UserColumn;
}) => {
  const setUserTypeForm = useForm<z.infer<typeof setUserTypeSchema>>({
    resolver: zodResolver(setUserTypeSchema),
    defaultValues: {
      userEmail: initialUserData.email,
      userType: "ADMIN",
      projects: [],
    },
  });

  const handleSetUserType = async (
    data: Required<z.infer<typeof setUserTypeSchema>>,
  ) => {
    try {
      const result = await setUserTypeAction({
        type: data.userType as unknown as SetUserTypeModel.TypeEnum, //May not be good
        email: data.userEmail,
      });
      if (result.success) {
        alert(`User updated to ${data}`);
      } else {
        alert("Failed to edit user");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const projectOptions = projectData.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  // TODO: remove admin fields, replace with jwt
  return (
    <Form {...setUserTypeForm}>
      <form
        onSubmit={setUserTypeForm.handleSubmit(handleSetUserType)}
        className="space-y-4 p-4 rounded-lg"
      >
        <h2 className="text-lg font-semibold">Set User Type</h2>

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
