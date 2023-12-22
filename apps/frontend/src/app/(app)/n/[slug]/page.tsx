import React from "react";
import Link from "next/link";
import type { ApiNode } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Node from "@components/node";
import Container from "@components/container";
import Header from "@components/header";
import { Button } from "@components/ui/button";

type Props = {
  params: {
    slug: string;
  };
};
export default async function Page({ params: { slug } }: Props) {
  const client = await createServerComponentClient();
  const node = await client.sendRequest<{
    message: string;
    payload: ApiNode;
  }>(`/api/v1/nodes/${slug}?with_children=1&with_thread_count=1`);

  if (!node.success) throw new Error(JSON.stringify(node.error));

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
      <br />
      <Container className="px-4">
        {node.data.payload.children?.length ? (
          <div className="divide-y rounded-lg border">
            {node.data.payload.children.map((n) => (
              <Node key={n.id} slug={n.slug} />
            ))}
          </div>
        ) : null}
      </Container>
    </div>
  );
}
