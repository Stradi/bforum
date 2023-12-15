"use client";

import FormInput from "@components/form-input";
import ScalingDialogRoot from "@components/scaling-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Inset, Separator, Text } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useForumsApi from "../_helpers/use-forums-api";
import type { CreateNodeFormData } from "../types";
import { CreateNodeFormSchema } from "../types";

export default function CreateNodeDialog() {
  const api = useForumsApi();
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
      const obj = await api.createNode(data);
      if (!obj.success) {
        setError("root", {
          type: "manual",
          message: obj.error.message,
        });

        toast.error(obj.error.message);
        return;
      }

      toast.success(obj.data.message);
      setOpen(false);
      reset();
    });
  }

  return (
    <ScalingDialogRoot onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <Button>Create new Node</Button>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title size="4">Create a new node</Dialog.Title>
        <Dialog.Description mt="-2" size="2">
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
    </ScalingDialogRoot>
  );
}
