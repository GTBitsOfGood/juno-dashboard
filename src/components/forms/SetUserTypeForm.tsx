import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { setUserTypeAction } from "@/lib/actions";
import { SetUserTypeModel } from "juno-sdk/build/main/internal/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

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
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(6, "Invalid admin password"),
});

const SetUserTypeForm = () => {
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

  return (
    <Form {...setUserTypeForm}>
      <form
        onSubmit={setUserTypeForm.handleSubmit(handleSetUserType)}
        className="space-y-4 border p-4 rounded-lg"
      >
        <h2 className="text-lg font-semibold">Set User Type</h2>

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

        <Separator className="mt-8 mb-8" />

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
        <Button type="submit">Update User Type</Button>
      </form>
    </Form>
  )
}

export default SetUserTypeForm;
