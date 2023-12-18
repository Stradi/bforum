import type { PropsWithChildren } from "react";
import Container from "@components/container";
import Header from "../_components/header";
import SideNavigation from "../_components/side-navigation";
import {
  createNode,
  deleteNode,
  updateNode,
  updateNodeOrder,
} from "./_helpers/actions";
import { NodesApiProvider } from "./_helpers/nodes-api-provider";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <NodesApiProvider
      createNode={createNode.bind(null, "/admin/nodes")}
      deleteNode={deleteNode.bind(null, "/admin/nodes")}
      updateNode={updateNode.bind(null, "/admin/nodes")}
      updateNodeOrder={updateNodeOrder.bind(null, "/admin/nodes")}
    >
      <div className="space-y-2">
        <Header description="Manage nodes in your community" title="Nodes" />
        <Container className="p-4 w-full flex gap-4">
          <SideNavigation
            className="w-60 -ml-2 shrink-0"
            items={[
              {
                label: "Overview",
                href: "/admin/nodes",
              },
            ]}
          />
          <div className="grow">{children}</div>
        </Container>
      </div>
    </NodesApiProvider>
  );
}
