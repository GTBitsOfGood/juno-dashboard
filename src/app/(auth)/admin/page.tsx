"use client";
import {
  linkUserToProject,
  setUserTypeAction,
  createUserAction,
} from "@/lib/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import * as z from "zod";

const userTypeMap = {
  SUPERADMIN: 0,
  ADMIN: 1,
  USER: 2,
} as const;

const userTypeEnum = z.enum(
  Object.keys(userTypeMap) as [keyof typeof userTypeMap],
);

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(6, "Invalid admin password"),
});

const setUserTypeSchema = z.object({
  userEmail: z.string().email("Invalid user email"),
  userType: userTypeEnum,
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(6, "Invalid admin password"),
});

const linkUserToProjectSchema = z.object({
  userId: z.string(),
  projectName: z.string().min(1, "Project Name is required"),
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(6, "Invalid admin password"),
});

const AdminPage = () => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const handleCreateUser = async (
    data: Required<z.infer<typeof createUserSchema>>,
  ) => {
    try {
      const result = await createUserAction(data);
      if (result.success) {
        alert("User created successfully!");
      } else {
        alert("User failed to be created.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  /** Form to set user type */
  const setUserTypeForm = useForm<z.infer<typeof setUserTypeSchema>>({
    resolver: zodResolver(setUserTypeSchema),
    defaultValues: {
      userEmail: "",
      userType: "USER",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const handleSetUserType = async (
    data: Required<z.infer<typeof setUserTypeSchema>>,
  ) => {
    try {
      const result = await setUserTypeAction({
        type: data.userType as unknown as SetUserTypeModel.TypeEnum, //May not be good
        email: data.userEmail,
        adminPassword: data.adminPassword,
        adminEmail: data.adminEmail,
      });
      if (result.success) {
        alert(
          `User type updated to ${data.userType} by Admin: ${data.adminEmail}`,
        );
      } else {
        alert("Failed to set user type.");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  /** Form to link user to a project */
  const linkUserToProjectForm = useForm({
    resolver: zodResolver(linkUserToProjectSchema),
    defaultValues: {
      userId: "",
      projectName: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const handleLinkUserToProject = async (
    data: Required<z.infer<typeof linkUserToProjectSchema>>,
  ) => {
    try {
      const result = await linkUserToProject(data);
      if (result.success) {
        alert("User successfully linked to project!");
      } else {
        alert("User not linked to project.");
      }
    } catch (error) {
      console.error("Error linking user to project:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Page</h1>

      {/* Create User Form */}
      <Form {...createUserForm}>
        <form
          onSubmit={createUserForm.handleSubmit(handleCreateUser)}
          className="space-y-4 border p-4 rounded-lg"
        >
          <h2 className="text-lg font-semibold">Create User</h2>
          <FormField
            control={createUserForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createUserForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createUserForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createUserForm.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createUserForm.control}
            name="adminPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create User</Button>
        </form>
      </Form>

      {/* Set User Type Form */}
      <Form {...setUserTypeForm}>
        <form
          onSubmit={setUserTypeForm.handleSubmit(handleSetUserType)}
          className="space-y-4 border p-4 rounded-lg"
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={setUserTypeForm.control}
            name="adminPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update User Type</Button>
        </form>
      </Form>

      {/* Link User to Project Form */}
      <Form {...linkUserToProjectForm}>
        <form
          onSubmit={linkUserToProjectForm.handleSubmit(handleLinkUserToProject)}
          className="space-y-4 border p-4 rounded-lg"
        >
          <h2 className="text-lg font-semibold">Link User to Project</h2>
          <FormField
            control={linkUserToProjectForm.control}
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
          <FormField
            control={linkUserToProjectForm.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={linkUserToProjectForm.control}
            name="adminPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={linkUserToProjectForm.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Link User</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminPage;
