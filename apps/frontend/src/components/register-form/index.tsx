"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@utils/tw";
import { register as doRegister } from "@lib/api/auth";
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

const RegisterFormSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3).max(63),
    password: z.string().min(8).max(63),
    passwordConfirmation: z.string().min(8).max(63),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type RegisterFormType = z.infer<typeof RegisterFormSchema>;
type Props = ComponentPropsWithoutRef<"form">;

export default function RegisterForm({ className, ...props }: Props) {
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const client = useClient();

  async function onSubmit(data: RegisterFormType) {
    const obj = await doRegister(client, {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (!obj.success) {
      form.setError("root", {
        message: obj.error.message,
      });

      return;
    }

    // This is the way to perform a full page reload (with SSR).
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jon@snow.com" {...field} />
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
                <Input placeholder="**********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="**********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root ? (
          <p className="text-red-500 text-xs">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <Button type="submit">Register</Button>
      </form>
    </Form>
  );
}
