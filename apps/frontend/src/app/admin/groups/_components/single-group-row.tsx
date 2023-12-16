"use client";

import FormInput from "@components/form-input";
import ScalingDialogRoot from "@components/scaling-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiGroup } from "@lib/api/api.types";
import {
  Button,
  Dialog,
  Inset,
  Separator,
  Table,
  Text,
} from "@radix-ui/themes";
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useGroupsApi from "../_helpers/use-groups-api";
import type { UpdateGroupFormData } from "../types";
import { UpdateGroupFormSchema } from "../types";
import DeleteGroupAlertDialog from "./delete-group-alert-dialog";

type Props = Pick<Row<ApiGroup>, "id" | "original" | "getVisibleCells">;
export default function SingleGroupRow({
  id,
  original,
  getVisibleCells,
}: Props) {
  const api = useGroupsApi();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<UpdateGroupFormData>({
    resolver: zodResolver(UpdateGroupFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: original.name,
    },
  });

  function onSubmit(data: UpdateGroupFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.updateGroup(original.id, data);
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
      const obj = await api.deleteGroup(original.id);
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
      key={id}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
    >
      <Dialog.Trigger className="appearance-none">
        <Table.Row
          className="hover:bg-neutral-100 transition duration-100"
          key={id}
        >
          {getVisibleCells().map((cell) => (
            <Table.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          ))}
        </Table.Row>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title size="4">Group details</Dialog.Title>
        <Dialog.Description mt="-2" size="2">
          Edit or update the group
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
          <div className="flex justify-end gap-1">
            <DeleteGroupAlertDialog onDeleteGroup={onDelete} />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </ScalingDialogRoot>
  );
}
