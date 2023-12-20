"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ScalingDialogRoot from "@components/scaling-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import useNodesApi from "../_helpers/use-nodes-api";
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
  const api = useNodesApi();

  const form = useForm<UpdateNodeFormData>({
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

  function onDelete() {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.deleteNode(node.slug);
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
      <DialogContent className="!max-w-[450px]">
        <DialogTitle>Node Details</DialogTitle>
        <DialogDescription>
          View, update or delete &apos;{node.name}&apos; node.
        </DialogDescription>
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
                    <Input placeholder="Off-topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="off-topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A place to talk about anything"
                      {...field}
                    />
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
            <div className="flex justify-end gap-1">
              <DeleteNodeAlertDialog onDeleteNode={onDelete} />
              <Button
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                type="submit"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </ScalingDialogRoot>
  );
}
