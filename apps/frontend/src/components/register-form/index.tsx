"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@radix-ui/themes";
import { KeyRoundIcon, MailIcon, UserIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../../utils/tw";
import FormInput from "./form-input";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onSubmit",
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- well
  function onSubmit(_data: RegisterFormType) {}

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
        placeholder="Jon Snow"
        register={register("username")}
        type="text"
      />
      <FormInput
        disabled={isSubmitting}
        error={errors.email?.message}
        icon={MailIcon}
        id="email"
        label="Email"
        placeholder="jon@snow.com"
        register={register("email")}
        type="email"
      />
      <div className="flex gap-2">
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
        <FormInput
          disabled={isSubmitting}
          error={errors.passwordConfirmation?.message}
          icon={KeyRoundIcon}
          id="passwordConfirmation"
          label="Confirm Password"
          placeholder="**********"
          register={register("passwordConfirmation")}
          type="password"
        />
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
}
