"use client";

import { Button, Input } from "@/components/auth/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createJWTAuthentication } from "@/lib/actions";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { CircleX, Loader2 } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const values = loginForm.getValues();
    const result = await createJWTAuthentication({
      email: values.email,
      password: values.password,
    });
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className="mb-6 text-4xl font-bold tracking-tight text-white">
        Log in
      </h2>

      {error.length > 0 && (
        <Alert className="mb-6 border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-2 text-red-400">
            <CircleX className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Alert>
      )}

      <Form {...loginForm}>
        <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
          <FormField
            control={loginForm.control}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-white/60">
                  Password
                </FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Log in
            </Button>
          </div>
        </form>
      </Form>

      <p className="mt-8 text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/request-account"
          className="text-amber-400/70 underline-offset-4 hover:text-amber-300 hover:underline"
        >
          Request account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
