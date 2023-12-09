"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text } from "@radix-ui/themes";
import { KeyRoundIcon, UserIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useClient from "../../hooks/use-client";
import { login } from "../../lib/api/auth";
import { cn } from "../../utils/tw";
import FormInput from "../form-input";

const LoginFormSchema = z.object({
  username: z.string().min(3).max(63),
  password: z.string().min(8).max(63),
});

type LoginFormType = z.infer<typeof LoginFormSchema>;
type Props = ComponentPropsWithoutRef<"form">;

export default function LoginForm({ className, ...props }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onSubmit",
  });

  const client = useClient();

  async function onSubmit(data: LoginFormType) {
    const obj = await login(client, data);
    if (!obj.success) {
      setError("root", {
        message: obj.error.message,
      });

      return;
    }

    window.location.href = "/";
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ...
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FormInput
        disabled={isSubmitting}
        error={errors.username?.message}
        icon={UserIcon}
        id="username"
        label="Username"
        placeholder="jonsnow"
        register={register("username")}
        type="text"
      />
      <FormInput
        disabled={isSubmitting}
        error={errors.password?.message}
        icon={KeyRoundIcon}
        id="password"
        label="Password"
        placeholder="**********"
        register={register("password")}
        type="password"
      />
      {errors.root ? (
        <Text as="p" className="text-red-500" size="1">
          {errors.root.message}
        </Text>
      ) : null}
      <Button type="submit">Login</Button>
    </form>
  );
}
