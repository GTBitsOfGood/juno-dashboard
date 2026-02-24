"use client";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {createJWTAuthentication} from "@/lib/actions";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Alert} from "@/components/ui/alert";
import {CircleX, Loader2} from "lucide-react";
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
    <div className="w-full max-w-sm text-base">
      <h2 className="mb-1 text-3xl font-bold">Log in to Juno</h2>
      <p className="mb-6 text-muted-foreground">
        Enter your credentials to access the dashboard.
      </p>

      {error.length > 0 && (
        <Alert className="mb-4">
          <div className="flex items-center gap-2 text-red-300">
            <CircleX className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </Alert>
      )}

      <Form {...loginForm}>
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-amber-400 text-black hover:bg-amber-400" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Log in
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/request-account"
          className="text-amber-300 underline-offset-4 hover:underline"
        >
          Request an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
