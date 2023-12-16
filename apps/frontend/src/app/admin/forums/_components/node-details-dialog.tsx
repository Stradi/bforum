"use client";

import FormInput from "@components/form-input";
import ScalingDialogRoot from "@components/scaling-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Inset, Separator, Text } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useForumsApi from "../_helpers/use-forums-api";
import {
  UpdateNodeFormSchema,
  type DndNode,
  type UpdateNodeFormData,
} from "../types";
import DeleteNodeAlertDialog from "./delete-node-alert-dialog";

type Props = {
  node: DndNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function NodeDetailsDialog({ node, open, setOpen }: Props) {
  const api = useForumsApi();

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
      const obj = await api.updateNode(node.slug, data);
      if (!obj.success) {
        setError("root", {
          type: "manual",
          message: obj.error.message,
        });

        return;
      }

      toast.success(obj.data.message);
      setOpen(false);
      reset();
    });
  }

  function onDelete() {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.deleteNode(node.slug);
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
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title size="4">Forum Details</Dialog.Title>
        <Dialog.Description mt="-2" size="2">
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
          <div className="flex justify-end gap-1">
            <DeleteNodeAlertDialog onDeleteNode={onDelete} />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </ScalingDialogRoot>
  );
}
