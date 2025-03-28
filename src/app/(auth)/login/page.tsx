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
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

const LoginPage = () => {
  const router = useRouter();
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const values = loginForm.getValues();
    const result = await createJWTAuthentication({
      email: values.email,
      password: values.password,
    });
    if (result.success) {
      //Go to admin page
      router.push("/admin");
    } else {
      alert("Login failed.");
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

            <Button type="submit">Log in</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
