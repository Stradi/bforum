import React from "react";
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import type { ApiNode } from "@lib/api/api.types";
import { Button } from "@components/ui/button";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type OnlySlugProps = {
  slug: string;
  node?: never;
};

type FullNodeProps = {
  slug?: never;
  node: ApiNode;
};

type Props = OnlySlugProps | FullNodeProps;

export default async function Node({ node: _node, slug }: Props) {
  let node: ApiNode | undefined;
  if (_node) {
    node = _node;
  } else {
    const client = await createServerComponentClient();
    const response = await client.sendRequest<{
      message: string;
      payload: ApiNode;
    }>(`/api/v1/nodes/${slug}?with_children=1&with_thread_count=1`);
    if (!response.success) throw new Error(JSON.stringify(response.error));

    node = response.data.payload;
  }

  return (
    <div className="grid grid-cols-2 items-center p-2">
      <div className="flex items-center gap-2">
        <MessageCircleIcon className="size-8 text-neutral-200" />
        <div className="flex flex-col">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <Button
                  asChild
                  className="h-auto p-0 text-base font-normal"
                  variant="link"
                >
                  <Link href={`/n/${node.slug}`}>{node.name}</Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{node.description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {node.children?.length ? (
            <Popover>
              <PopoverTrigger className="group flex w-fit items-center gap-0.5 text-left text-xs text-neutral-500 hover:text-neutral-700 data-[state=open]:text-neutral-700">
                Sub-forums{" "}
                <TriangleDownIcon className="size-4 rotate-180 transition duration-100 group-data-[state=open]:rotate-0" />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[200px] overflow-hidden p-0"
              >
                <div className="divide-y text-sm">
                  {node.children.map((child) => (
                    <Link
                      className="flex w-full items-center gap-1 px-2 py-1.5 transition duration-100 hover:bg-neutral-100"
                      href={`/n/${child.slug}`}
                      key={child.id}
                    >
                      <MessageCircleIcon className="size-5 text-neutral-300" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        {node.thread_count !== undefined ? (
          <div className="flex flex-col items-center">
            <p className="text-xs text-neutral-500">Threads</p>
            <p className="font-mono">{node.thread_count}</p>
          </div>
        ) : null}
        <div className="flex flex-col items-center">
          <p className="text-xs text-neutral-500">Replies</p>
          <p className="font-mono">2500</p> {/* TODO: Fix? */}
        </div>
      </div>
    </div>
  );
}
