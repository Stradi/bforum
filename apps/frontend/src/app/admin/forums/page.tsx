import Container from "../../../components/container";
import type { ApiNode } from "../../../lib/api/api.types";
import createServerComponentClient from "../../../lib/api/client/create-server-component-client";
import Header from "../components/header";
import CreateNodeDialog from "./_components/create-node-dialog";
import NodesEditor from "./_components/nodes-editor";
import { createNode, updateNodeOrder } from "./actions";
import type { DndNode } from "./types";

export default async function Page() {
  const client = await createServerComponentClient();
  const nodes = await client.sendRequest<{
    message: string;
    payload: ApiNode[];
  }>("/api/v1/nodes");

  if (!nodes.success) throw new Error(JSON.stringify(nodes.error));

  const dndNodes: DndNode[] = nodes.data.payload.map((node) => ({
    dndId: node.id,
    dndParentId: node.parent_id ?? 0,
    ...node,
  }));

  return (
    <div>
      <Header
        description="Organize, create, update and delete your nodes."
        title="Forums"
      >
        <CreateNodeDialog
          createNodeApi={createNode.bind(null, "/admin/forums")}
        />
      </Header>
      <Container className="p-4">
        <NodesEditor
          nodes={dndNodes}
          updateNodeOrderApi={updateNodeOrder.bind(null, "/admin/forums")}
        />
      </Container>
    </div>
  );
}
