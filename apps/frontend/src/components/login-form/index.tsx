"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@utils/tw";
import { login } from "@lib/api/auth";
import useClient from "@hooks/use-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

const LoginFormSchema = z.object({
  username: z.string().min(3).max(63),
  password: z.string().min(8).max(63),
});

type LoginFormType = z.infer<typeof LoginFormSchema>;
type Props = ComponentPropsWithoutRef<"form">;

export default function LoginForm({ className, ...props }: Props) {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onSubmit",
  });

  const client = useClient();

  async function onSubmit(data: LoginFormType) {
    const obj = await login(client, data);
    if (!obj.success) {
      form.setError("root", {
        message: obj.error.message,
      });

      return;
    }

    window.location.href = "/";
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ...
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="jonsnow" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="jonsnow" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root ? (
          <p className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
