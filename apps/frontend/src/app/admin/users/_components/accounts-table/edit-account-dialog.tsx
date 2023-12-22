"use client";

import type { PropsWithChildren } from "react";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@components/ui/dialog";
import ScalingDialogRoot from "@components/scaling-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import type { ApiAccount, ApiGroup } from "@lib/api/api.types";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import useAccountsApi from "../../_helpers/use-accounts-api";
import type { UpdateAccountFormData } from "../../types";
import { UpdateAccountFormSchema } from "../../types";

type Props = PropsWithChildren & {
  account: ApiAccount;
  groups: ApiGroup[];
};
export default function EditGroupDialog({ children, account, groups }: Props) {
  const api = useAccountsApi();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateAccountFormData>({
    resolver: zodResolver(UpdateAccountFormSchema),
    mode: "onSubmit",
    defaultValues: {
      username: account.username,
      display_name: account.display_name,
      groups: account.accountGroup.map((accountGroup) => accountGroup.group_id),
    },
  });

  form.watch("groups");

  useEffect(() => {
    form.reset();
  }, [form, open, form.reset]);

  function onSubmit(data: UpdateAccountFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.updateAccount(account.id, data);
      if (!obj.success) {
        form.setError("root", {
          type: "manual",
          message: obj.error.message,
        });

        return;
      }

      toast.success(obj.data.message);
      setOpen(false);
      form.reset();
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[450px]">
        <DialogTitle>Edit Group</DialogTitle>
        <DialogDescription>Edit group details</DialogDescription>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ...
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Stradi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="stradi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Groups</Label>
              <div className="grid grid-cols-3 gap-1">
                {groups.map((group) => (
                  <div className="flex items-center gap-1" key={group.id}>
                    <Checkbox
                      checked={form.getValues().groups.includes(group.id)}
                      id={group.id.toString()}
                      name="groups"
                      onCheckedChange={(checked) => {
                        form.setValue(
                          "groups",
                          checked
                            ? [...form.getValues().groups, group.id]
                            : form
                                .getValues()
                                .groups.filter((id: number) => id !== group.id)
                        );
                      }}
                      value={group.id}
                    />
                    <Label htmlFor={group.id.toString()}>{group.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            {form.formState.errors.root ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              type="submit"
            >
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </ScalingDialogRoot>
  );
}
