import Container from "@components/container";
import type { ApiNode } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Header from "../components/header";
import CreateNodeDialog from "./_components/create-node-dialog";
import NodesEditor from "./_components/nodes-editor";
import {
  createNode,
  deleteNode,
  updateNode,
  updateNodeOrder,
} from "./_helpers/actions";
import { ForumsApiProvider } from "./_helpers/forums-api-provider";
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
    dndParentId: node.parent_id ?? -1,
    dndLexoRank: node.order,
    ...node,
  }));

  return (
    <ForumsApiProvider
      createNode={createNode.bind(null, "/admin/forums")}
      deleteNode={deleteNode.bind(null, "/admin/forums")}
      updateNode={updateNode.bind(null, "/admin/forums")}
      updateNodeOrder={updateNodeOrder.bind(null, "/admin/forums")}
    >
      <div>
        <Header
          description="Organize, create, update and delete your nodes."
          title="Forums"
        >
          <CreateNodeDialog />
        </Header>
        <Container className="p-4">
          <NodesEditor nodes={dndNodes} />
        </Container>
      </div>
    </ForumsApiProvider>
  );
}
