import React from "react";
import Link from "next/link";
import type { ApiNode, ApiThread } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Node from "@components/node";
import Container from "@components/container";
import Header from "@components/header";
import { Button } from "@components/ui/button";
import ThreadsTable from "./_components/threads-table";

type Props = {
  params: {
    nodeSlug: string;
  };
};
export default async function Page({ params: { nodeSlug } }: Props) {
  const client = await createServerComponentClient();
  const node = await client.sendRequest<{
    message: string;
    payload: ApiNode;
  }>(
    `/api/v1/nodes/${nodeSlug}?with_children=1&with_thread_count=1&with_threads=1`
  );

  if (!node.success) throw new Error(JSON.stringify(node.error));

  const threads = await client.sendRequest<{
    message: string;
    payload: ApiThread[];
  }>(`/api/v1/nodes/${nodeSlug}/threads?with_creator=1&with_reply_count=1`);

  if (!threads.success) throw new Error(JSON.stringify(threads.error));

  return (
    <div>
      <Header
        description={node.data.payload.description}
        title={node.data.payload.name}
      >
        <Button asChild>
          <Link href={`/n/${node.data.payload.slug}/new-thread`}>
            New Thread
          </Link>
        </Button>
      </Header>
      {node.data.payload.children?.length ? (
        <>
          <br />
          <Container className="px-4">
            <div className="divide-y rounded-lg border">
              {node.data.payload.children.map((n) => (
                <Node key={n.id} slug={n.slug} />
              ))}
            </div>
          </Container>
        </>
      ) : null}
      <br />
      <Container className="px-4">
        <ThreadsTable nodeSlug={nodeSlug} threads={threads.data.payload} />
      </Container>
    </div>
  );
}
