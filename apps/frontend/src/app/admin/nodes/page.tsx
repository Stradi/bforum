import type { ApiNode } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import SubHeader from "../components/sub-header";
import CreateNodeDialog from "./_components/create-node-dialog";
import NodesEditor from "./_components/nodes-editor";
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
    <div>
      <SubHeader
        description="You can see all the nodes in your forum here. You can create, edit and delete nodes. Click on a node to see more information and actions about it."
        title="Nodes"
      >
        <CreateNodeDialog />
      </SubHeader>
      <br />
      <NodesEditor nodes={dndNodes} />
    </div>
  );
}
