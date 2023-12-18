"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Inset, Separator, Text } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ScalingDialogRoot from "@components/scaling-dialog";
import FormInput from "@components/form-input";
import useGroupsApi from "../_helpers/use-groups-api";
import type { CreateGroupFormData } from "../types";
import { CreateGroupFormSchema } from "../types";

export default function CreateGroupDialog() {
  const api = useGroupsApi();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(CreateGroupFormSchema),
    mode: "onSubmit",
  });

  function onSubmit(data: CreateGroupFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.createGroup(data);
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
    <ScalingDialogRoot
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
    >
      <Dialog.Trigger>
        <Button>Create new Group</Button>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title size="4">Create a new group</Dialog.Title>
        <Dialog.Description mt="-2" size="2">
          Create a group and manage your users.
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
            placeholder="Moderator"
            register={register("name")}
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
