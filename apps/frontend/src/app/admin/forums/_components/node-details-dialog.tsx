"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Inset, Separator, Text } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../../../../components/form-input";
import type { updateNode } from "../actions";
import type { DndNode } from "../types";

export const UpdateNodeFormSchema = z.object({
  name: z.string().min(3).max(63),
  description: z.string().min(3).max(255),
  slug: z.string().min(1).max(63),
});

export type UpdateNodeFormData = z.infer<typeof UpdateNodeFormSchema>;

type Props = {
  node: DndNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  updateNodeApi: (
    slug: string,
    data: UpdateNodeFormData
  ) => ReturnType<typeof updateNode>;
};

export default function NodeDetailsDialog({
  node,
  open,
  setOpen,
  updateNodeApi,
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<UpdateNodeFormData>({
    resolver: zodResolver(UpdateNodeFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: node.name,
      description: node.description,
      slug: node.slug,
    },
  });

  function onSubmit(data: UpdateNodeFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await updateNodeApi(node.slug, data);
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
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title>Forum Details</Dialog.Title>
        <Dialog.Description>
          View, update or delete &apos;{node.name}&apos; forum.
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
            error={errors.slug?.message}
            icon={PencilIcon}
            id="slug"
            label="Slug"
            placeholder="off-topic"
            register={register("slug")}
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
          <Button disabled={isSubmitting || !isValid} type="submit">
            Create
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
