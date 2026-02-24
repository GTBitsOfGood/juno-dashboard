"use client";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/auth/ui";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
      required_error: "Please select user type",
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
      message: "Project name required for admin users",
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

    /* TODO: Send request to infra team for approval
    const values = form.getValues();
    const payload = {
      name: values.name,
      email: values.email,
      userType: values.userType,
      projectName: values.userType === "Admin" ? values.projectName : undefined,
    };
    */

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 text-white">
          <CheckCircle2 className="h-5 w-5" />
          <h2 className="text-4xl font-bold tracking-tight">
            Request Submitted
          </h2>
        </div>
        <p className="mt-3 text-sm text-white/40">
          Your account request has been submitted. Please contact the Infra team
          for approval.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-amber-400/70 underline-offset-4 hover:text-amber-300 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className="mb-6 text-4xl font-bold tracking-tight text-white">
        Request account
      </h2>

      {error.length > 0 && (
        <Alert className="mb-6 border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-2 text-red-400">
            <CircleX className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-white/60">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormDescription className="text-xs text-white/30">
                  Full name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-white/60">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-white/30">
                  Email registered with other project services
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
                <FormLabel className="text-base text-white/60">
                  User Type
                </FormLabel>
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
                <FormDescription className="text-xs text-white/30">
                  Admin role for engineering managers only
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
                  <FormLabel className="text-base text-white/60">
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="My Project" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-white/30">
                    Project name as you would like it to appear
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Request Account
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-amber-400/70 underline-offset-4 hover:text-amber-300 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RequestAccountPage;
