import Container from "@components/container";
import type { ApiGroup, ApiPermission } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Header from "../components/header";
import CreateGroupDialog from "./_components/create-group-dialog";
import PermissionMatrix from "./_components/permission-matrix";
import { createGroup, updateGroupPermissions } from "./_helpers/actions";
import { GroupsApiProvider } from "./_helpers/groups-api-provider";

export default async function Page() {
  const client = await createServerComponentClient();
  const groups = await client.sendRequest<{
    message: string;
    payload: ApiGroup[];
  }>("/api/v1/groups?with_permissions=1");

  const permissions = await client.sendRequest<{
    message: string;
    payload: ApiPermission[];
  }>("/api/v1/permissions?limit=100");

  if (!groups.success) throw new Error(JSON.stringify(groups.error));
  if (!permissions.success) throw new Error(JSON.stringify(permissions.error));

  return (
    <GroupsApiProvider
      createGroup={createGroup.bind(null, "/admin/groups")}
      updateGroupPermissions={updateGroupPermissions.bind(
        null,
        "/admin/groups"
      )}
    >
      <div>
        <Header
          description="Manage groups and their permissions."
          title="Groups"
        >
          <CreateGroupDialog />
        </Header>
        <Container className="p-4 w-full">
          <PermissionMatrix
            groups={groups.data.payload}
            permissions={permissions.data.payload}
          />
        </Container>
      </div>
    </GroupsApiProvider>
  );
}
