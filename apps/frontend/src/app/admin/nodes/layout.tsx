import type { PropsWithChildren } from "react";
import Container from "@components/container";
import Header from "@components/header";
import SideNavigation from "../_components/side-navigation";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <div className="space-y-2">
      <Header description="Manage nodes in your community" title="Nodes" />
      <Container className="flex w-full gap-4 p-4">
        <SideNavigation
          className="-ml-2 w-60 shrink-0"
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
  );
}
