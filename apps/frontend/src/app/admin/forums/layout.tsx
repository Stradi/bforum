import Container from "@components/container";
import type { PropsWithChildren } from "react";
import Header from "../components/header";
import SideNavigation from "../components/side-navigation";
import {
  createNode,
  deleteNode,
  updateNode,
  updateNodeOrder,
} from "./_helpers/actions";
import { ForumsApiProvider } from "./_helpers/forums-api-provider";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <ForumsApiProvider
      createNode={createNode.bind(null, "/admin/forums")}
      deleteNode={deleteNode.bind(null, "/admin/forums")}
      updateNode={updateNode.bind(null, "/admin/forums")}
      updateNodeOrder={updateNodeOrder.bind(null, "/admin/forums")}
    >
      <div className="space-y-2">
        <Header description="Manage forums in your community" title="Forums" />
        <Container className="p-4 w-full flex gap-4">
          <SideNavigation
            className="w-60 -ml-2 shrink-0"
            items={[
              {
                label: "Overview",
                href: "/admin/forums",
              },
            ]}
          />
          <div className="grow">{children}</div>
        </Container>
      </div>
    </ForumsApiProvider>
  );
}
