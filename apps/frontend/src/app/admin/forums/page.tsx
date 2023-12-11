import { Text } from "@radix-ui/themes";
import Container from "../../../components/container";
import DndSortableTree from "../../../components/dnd-sortable-tree";
import type { ApiNode } from "../../../lib/api/api.types";
import createServerComponentClient from "../../../lib/api/client/create-server-component-client";
import Header from "../components/header";
import CreateNodeDialog from "./_components/create-node-dialog";
import { createNode } from "./actions";

type DndNode = ApiNode & {
  dndId: number;
  dndParentId: number;
};

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
        {nodes.data.payload.length > 0 ? (
          <DndSortableTree<DndNode> items={dndNodes} titleSelector="name" />
        ) : (
          <Text my="6">You don&apos;t have any nodes yet. Create one!</Text>
        )}
      </Container>
    </div>
  );
}
