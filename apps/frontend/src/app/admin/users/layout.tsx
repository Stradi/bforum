import type { PropsWithChildren } from "react";
import Container from "@components/container";
import Header from "../components/header";
import SideNavigation from "../components/side-navigation";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <div className="space-y-2">
      <Header description="Manage users" title="Users" />
      <Container className="p-4 w-full flex gap-4">
        <SideNavigation
          className="w-60 -ml-2 shrink-0"
          items={[
            {
              label: "Overview",
              href: "/admin/users",
            },
          ]}
        />
        <div className="grow">{children}</div>
      </Container>
    </div>
  );
}
