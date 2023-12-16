import Container from "@components/container";
import type { PropsWithChildren } from "react";
import Header from "../components/header";
import SideNavigation from "../components/side-navigation";
import { createGroup, updateGroupPermissions } from "./_helpers/actions";
import { GroupsApiProvider } from "./_helpers/groups-api-provider";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <GroupsApiProvider
      createGroup={createGroup.bind(null, "/admin/groups")}
      updateGroupPermissions={updateGroupPermissions.bind(
        null,
        "/admin/groups"
      )}
    >
      <div className="space-y-2">
        <Header description="Manage groups and permissions" title="Groups" />
        <Container className="p-4 w-full flex gap-4">
          <SideNavigation
            className="w-60 -ml-2 shrink-0"
            items={[
              {
                label: "Overview",
                href: "/admin/groups",
              },
              {
                label: "Permissions",
                href: "/admin/groups/permissions",
              },
            ]}
          />
          <div className="grow">{children}</div>
        </Container>
      </div>
    </GroupsApiProvider>
  );
}
