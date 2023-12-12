"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Inset, Separator, Text } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../../../../components/form-input";
import type { createNode } from "../actions";

export const CreateNodeFormSchema = z.object({
  name: z.string().min(3).max(63),
  description: z.string().min(3).max(255),
  parent_id: z.number().optional(),
});

export type CreateNodeFormData = z.infer<typeof CreateNodeFormSchema>;

export type Props = {
  createNodeApi: (data: CreateNodeFormData) => ReturnType<typeof createNode>;
};
export default function CreateNodeDialog({ createNodeApi }: Props) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateNodeFormData>({
    resolver: zodResolver(CreateNodeFormSchema),
    mode: "onSubmit",
  });

  function onSubmit(data: CreateNodeFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await createNodeApi(data);
      if (!obj.success) {
        setError("root", {
          type: "manual",
          message: obj.error.message,
        });

        return;
      }

      setOpen(false);
      reset();
    });
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <Button>Create new Node</Button>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title>Create a new node</Dialog.Title>
        <Dialog.Description>
          Create a new node to organize your forums.
        </Dialog.Description>
        <Inset my="5">
          <Separator my="3" size="4" />
        </Inset>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises -- ... */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            disabled={isSubmitting}
            error={errors.name?.message}
            icon={PencilIcon}
            id="name"
            label="Name"
            placeholder="Off-topic"
            register={register("name")}
            type="text"
          />
          <FormInput
            disabled={isSubmitting}
            error={errors.description?.message}
            icon={PencilIcon}
            id="description"
            label="Description"
            placeholder="Talk about anything here."
            register={register("description")}
            type="text"
          />
          {errors.root ? (
            <Text as="p" className="text-red-500" size="1">
              {errors.root.message}
            </Text>
          ) : null}
          <Button type="submit">Create</Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}