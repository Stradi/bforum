"use client";

import { Text, TextField } from "@radix-ui/themes";
import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import ShowPasswordButton from "./show-password-button";

type FormInputProps<T extends string> = ComponentPropsWithoutRef<
  typeof TextField.Input
> & {
  register: UseFormRegisterReturn<T>;
  icon: LucideIcon;
  label: string;
  error?: string;
};

export default function FormInput({
  register,
  id,
  label,
  type,
  placeholder,
  icon,
  error,
  ...rest
}: FormInputProps<string>) {
  const [show, setShow] = useState(false);

  const Icon = icon;

  return (
    <div>
      <Text as="label" htmlFor={id} size="2" weight="medium">
        {label}
      </Text>
      <TextField.Root>
        <TextField.Slot>
          <Icon
            className="stroke-neutral-400"
            height={16}
            strokeWidth={1.5}
            width={16}
          />
        </TextField.Slot>

        <TextField.Input
          id={id}
          placeholder={placeholder}
          // eslint-disable-next-line no-nested-ternary -- ternary is fine here
          type={type === "password" ? (show ? "text" : "password") : type}
          {...register}
          {...rest}
        />

        {type === "password" && <ShowPasswordButton onShowChange={setShow} />}
      </TextField.Root>

      {error ? (
        <Text as="p" className="text-red-500" size="1">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
