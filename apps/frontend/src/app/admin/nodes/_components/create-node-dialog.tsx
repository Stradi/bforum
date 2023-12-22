"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ScalingDialogRoot from "@components/scaling-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
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
import { CreateNodeFormSchema } from "../types";
import type { CreateNodeFormData } from "../types";
import useNodesApi from "../_helpers/use-nodes-api";

export default function CreateNodeDialog() {
  const api = useNodesApi();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateNodeFormData>({
    resolver: zodResolver(CreateNodeFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: CreateNodeFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.createNode(data);
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
      <DialogTrigger asChild>
        <Button>Create new Node</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[450px]">
        <DialogTitle>Create a new node</DialogTitle>
        <DialogDescription>
          Create a new node to organize your community.
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
              <p className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </ScalingDialogRoot>
  );
}
