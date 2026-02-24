"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { CheckCircle2, CircleX, Loader2 } from "lucide-react";
import Link from "next/link";

const requestAccountSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    userType: z.enum(["User", "Admin"], {
      required_error: "Please select a user type",
    }),
    projectName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.userType === "Admin") {
        return data.projectName && data.projectName.length > 0;
      }
      return true;
    },
    {
      message: "Project name is required for Admin users",
      path: ["projectName"],
    },
  );

type RequestAccountValues = z.infer<typeof requestAccountSchema>;

const RequestAccountPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RequestAccountValues>({
    resolver: zodResolver(requestAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      userType: undefined,
      projectName: "",
    },
  });

  const userType = form.watch("userType");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const valid = await form.trigger();
    if (!valid) return;

    setLoading(true);
    setError("");

    const values = form.getValues();

    const payload = {
      name: values.name,
      email: values.email,
      userType: values.userType,
      projectName: values.userType === "Admin" ? values.projectName : undefined,
    };
    console.log("Account request payload:", payload);

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 text-amber-300">
          <CheckCircle2 className="h-5 w-5" />
          <h2 className="text-3xl font-bold">Request Submitted</h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          Your account request has been submitted. Please contact the Infra team
          for approval.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-amber-300 underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm text-base">
      <h2 className="mb-1 text-3xl font-medium">Request an Account</h2>
      <p className="mb-6 text-muted-foreground">
        Fill in your details to request access to Juno.
      </p>

      {error.length > 0 && (
        <Alert className="mb-4">
          <div className="flex items-center gap-2 text-red-300">
            <CircleX className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormDescription>Full name of user</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use the same email registered with other project services
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Admin role is for Engineering Managers only
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {userType === "Admin" && (
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Project" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter project name as you would like it to appear in Juno
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full bg-amber-400 text-black hover:bg-amber-400"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Request Account
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-amber-300 underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RequestAccountPage;
