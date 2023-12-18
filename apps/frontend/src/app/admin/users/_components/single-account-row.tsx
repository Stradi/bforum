"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Dialog,
  Inset,
  Separator,
  Table,
  Text,
} from "@radix-ui/themes";
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { User2Icon } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ApiAccount, ApiGroup } from "@lib/api/api.types";
import ScalingDialogRoot from "@components/scaling-dialog";
import FormInput from "@components/form-input";
import useAccountsApi from "../_helpers/use-accounts-api";
import type { UpdateAccountFormData } from "../types";
import { UpdateAccountFormSchema } from "../types";
import DeleteAccountAlertDialog from "./delete-account-alert-dialog";

type Props = Pick<Row<ApiAccount>, "original" | "getVisibleCells"> & {
  groups: ApiGroup[];
};
export default function SingleAccountRow({
  groups,
  original,
  getVisibleCells,
}: Props) {
  const api = useAccountsApi();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<UpdateAccountFormData>({
    resolver: zodResolver(UpdateAccountFormSchema),
    mode: "onSubmit",
    defaultValues: {
      username: original.username,
      display_name: original.display_name,
      groups: original.accountGroup.map(
        (accountGroup) => accountGroup.group_id
      ),
    },
  });

  watch("groups");

  useEffect(() => {
    reset();
  }, [open, reset]);

  function onSubmit(data: UpdateAccountFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.updateAccount(original.id, data);
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
      const obj = await api.deleteAccount(original.id);
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
      <Dialog.Trigger className="appearance-none">
        <Table.Row className="hover:bg-neutral-100 transition duration-100">
          {getVisibleCells().map((cell) => (
            <Table.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          ))}
        </Table.Row>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title size="4">Account details</Dialog.Title>
        <Dialog.Description mt="-2" size="2">
          View and edit account details.
        </Dialog.Description>
        <Inset my="5">
          <Separator my="3" size="4" />
        </Inset>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises -- ... */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            disabled={isSubmitting}
            error={errors.display_name?.message}
            icon={User2Icon}
            id="display_name"
            label="Display Name"
            placeholder="Stradi"
            register={register("display_name")}
            type="text"
          />
          <FormInput
            disabled={isSubmitting}
            error={errors.username?.message}
            icon={User2Icon}
            id="username"
            label="Username"
            placeholder="stradi"
            register={register("username")}
            type="text"
          />
          <div>
            <Text as="p" mb="1" size="2" weight="medium">
              Groups
            </Text>
            <div className="grid grid-cols-3 gap-1">
              {groups.map((group) => (
                <div className="flex items-center gap-1" key={group.id}>
                  <Checkbox
                    checked={getValues().groups.includes(group.id)}
                    id={group.id.toString()}
                    name="groups"
                    onCheckedChange={(checked) => {
                      setValue(
                        "groups",
                        checked
                          ? [...getValues().groups, group.id]
                          : getValues().groups.filter(
                              (id: number) => id !== group.id
                            )
                      );
                    }}
                    value={group.id}
                  />
                  <Text as="label" htmlFor={group.id.toString()} size="2">
                    {group.name}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          {errors.root ? (
            <Text as="p" className="text-red-500" size="1">
              {errors.root.message}
            </Text>
          ) : null}
          <div className="flex justify-end gap-1">
            <DeleteAccountAlertDialog onDeleteAccount={onDelete} />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </ScalingDialogRoot>
  );
}
