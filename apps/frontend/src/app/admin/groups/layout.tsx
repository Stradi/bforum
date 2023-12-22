import type { PropsWithChildren } from "react";
import Container from "@components/container";
import Header from "../_components/header";
import SideNavigation from "../_components/side-navigation";
import {
  createGroup,
  deleteGroup,
  updateGroup,
  updateGroupPermissions,
} from "./_helpers/actions";
import { GroupsApiProvider } from "./_helpers/groups-api-provider";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <GroupsApiProvider
      createGroup={createGroup.bind(null, "/admin/groups")}
      deleteGroup={deleteGroup.bind(null, "/admin/groups")}
      updateGroup={updateGroup.bind(null, "/admin/groups")}
      updateGroupPermissions={updateGroupPermissions.bind(
        null,
        "/admin/groups"
      )}
    >
      <div className="space-y-2">
        <Header description="Manage groups and permissions" title="Groups" />
        <Container className="flex w-full gap-4 p-4">
          <SideNavigation
            className="-ml-2 w-60 shrink-0"
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
