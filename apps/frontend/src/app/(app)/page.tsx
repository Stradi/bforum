import type { ApiNode } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Container from "@components/container";
import Node from "@components/node";
import Header from "@components/header";

export default async function Page() {
  const client = await createServerComponentClient();
  const nodes = await client.sendRequest<{
    message: string;
    payload: ApiNode[];
  }>("/api/v1/nodes?with_children=1&with_thread_count=1");

  if (!nodes.success) throw new Error(JSON.stringify(nodes.error));

  const topLevelNodes = nodes.data.payload.filter((node) => !node.parent_id);

  return (
    <div>
      <Header
        description={`bForum currently has ${nodes.data.payload.length} nodes. You can browse, create threads, and reply to threads in any of them.`}
        title="All Forums"
      />
      <br />
      <Container className="px-4">
        <div className="divide-y rounded-lg border">
          {topLevelNodes.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </div>
      </Container>
    </div>
  );
}
