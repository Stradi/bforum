import Link from "next/link";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import type { ApiThread } from "@lib/api/api.types";
import { Button } from "@components/ui/button";

type Props = {
  threads: ApiThread[];
  nodeSlug: string;
};

export default function ThreadsTable({ threads, nodeSlug }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Replies</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Latest Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threads.length > 0 ? (
            threads.map((thread) => (
              <TableRow key={thread.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-neutral-200" />
                    <div className="flex flex-col">
                      <Button
                        asChild
                        className="h-auto justify-start p-0 text-base font-normal"
                        variant="link"
                      >
                        <Link href={`/n/${nodeSlug}/${thread.slug}`}>
                          {thread.name}
                        </Link>
                      </Button>
                      <Link
                        className="text-xs text-neutral-500 hover:text-neutral-700"
                        href={`/u/${thread.creator.username}`}
                      >
                        {thread.creator.display_name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {thread.reply_count}
                </TableCell>
                <TableCell className="font-mono">500</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <p>11 mins ago</p>
                      <Link
                        className="text-xs text-neutral-500 hover:text-neutral-700"
                        href={`/u/${thread.creator.username}`}
                      >
                        {thread.creator.display_name}
                      </Link>
                    </div>
                    <div className="size-8 rounded-full bg-neutral-200" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center p-8">
                  <p className="text-gray-500">No threads yet.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
