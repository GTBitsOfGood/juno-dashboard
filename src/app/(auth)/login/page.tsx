"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createJWTAuthentication } from "@/lib/actions";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { CircleX, Loader2 } from "lucide-react";

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

    // start loading animation
    setLoading(true);

    const values = loginForm.getValues();
    const result = await createJWTAuthentication({
      email: values.email,
      password: values.password,
    });
    if (result.success) {
      //Go to admin page
      router.push("/admin");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container mx-auto max-w-xl">
        <Form {...loginForm}>
          <form
            onSubmit={handleLoginSubmit}
            className="space-y-4 p-4 rounded-lg"
          >
            <h2 className="text-lg font-semibold mt-24">Log in to Juno</h2>

            {error.length > 0 ? (
              <Alert>
                <div className="flex space-x-2 text-red-300 items-center align-middle">
                  <CircleX className="h-4 w-4" />
                  <div>{error}</div>
                </div>
              </Alert>
            ) : (
              <></>
            )}

            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
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

            <Button type="submit">
              {loading ? <Loader2 className="animate-spin" /> : <></>}
              Log in
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
