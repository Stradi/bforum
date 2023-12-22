import React from "react";
import type { ApiNode } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Node from "@components/node";
import Container from "@components/container";

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
    <Container className="px-4">
      <br />
      <header>
        <h1 className="text-xl">{node.data.payload.name}</h1>
        <p className="text-sm text-neutral-500">
          {node.data.payload.description}
        </p>
      </header>
      <br />
      {node.data.payload.children?.length ? (
        <div className="divide-y rounded-lg border">
          {node.data.payload.children.map((n) => (
            <Node key={n.id} slug={n.slug} />
          ))}
        </div>
      ) : null}
    </Container>
  );
}
