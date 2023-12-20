"use client";

import type { PropsWithChildren } from "react";
import { startTransition, useState } from "react";
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
import type { ApiGroup } from "@lib/api/api.types";
import { UpdateGroupFormSchema } from "../../types";
import type { UpdateGroupFormData } from "../../types";
import useGroupsApi from "../../_helpers/use-groups-api";

type Props = PropsWithChildren & {
  group: ApiGroup;
};
export default function EditGroupDialog({ children, group }: Props) {
  const api = useGroupsApi();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateGroupFormData>({
    resolver: zodResolver(UpdateGroupFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: group.name,
    },
  });

  function onSubmit(data: UpdateGroupFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.updateGroup(group.id, data);
      if (!obj.success) {
        form.setError("root", {
          type: "manual",
          message: obj.error.message,
        });

        toast.error(obj.error.message);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Moderator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root ? (
              <p className="text-red-500 text-sm">
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
