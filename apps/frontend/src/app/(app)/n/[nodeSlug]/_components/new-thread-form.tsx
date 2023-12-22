"use client";

import { startTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useThreadsApi from "@lib/api/threads/use-threads-api";
import type { CreateThreadFormData } from "@lib/api/threads/threads-types";
import { CreateThreadFormSchema } from "@lib/api/threads/threads-types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import useRepliesApi from "@lib/api/replies/use-replies-api";
import {
  CreateReplyFormSchema,
  type CreateReplyFormData,
} from "@lib/api/replies/replies-types";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type Props = {
  nodeSlug: string;
};

export default function NewThreadForm({ nodeSlug }: Props) {
  const threadsApi = useThreadsApi();
  const repliesApi = useRepliesApi();
  const router = useRouter();

  const form = useForm<CreateThreadFormData & CreateReplyFormData>({
    resolver: zodResolver(CreateThreadFormSchema.merge(CreateReplyFormSchema)),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      body: "",
    },
  });

  function onSubmit(data: CreateThreadFormData & CreateReplyFormData) {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const threadObj = await threadsApi.createThread("/", nodeSlug, {
        name: data.name,
      });

      if (!threadObj.success) {
        form.setError("root", {
          type: "manual",
          message: threadObj.error.message,
        });

        toast.error(threadObj.error.message);
        return;
      }

      const replyObj = await repliesApi.createReply(
        "/",
        nodeSlug,
        threadObj.data.payload.slug,
        {
          body: data.body,
        }
      );

      if (!replyObj.success) {
        form.setError("root", {
          type: "manual",
          message: replyObj.error.message,
        });

        toast.error(replyObj.error.message);
        return;
      }

      toast.success("Thread created successfully");
      router.push(`/n/${nodeSlug}/${threadObj.data.payload.slug}`);
      form.reset();
    });
  }

  return (
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
                <Input placeholder="Thread name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You can insert markdown here :)"
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
  );
}
