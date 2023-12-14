import Container from "@components/container";
import type { ApiGroup } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import Header from "../components/header";
import CreateGroupDialog from "./_components/create-group-dialog";
import PermissionMatrix from "./_components/permission-matrix";
import { createGroup } from "./_helpers/actions";
import { GroupsApiProvider } from "./_helpers/groups-api-provider";

export default async function Page() {
  const client = await createServerComponentClient();
  const groups = await client.sendRequest<{
    message: string;
    payload: ApiGroup[];
  }>("/api/v1/groups?with_permissions=1");

  if (!groups.success) throw new Error(JSON.stringify(groups.error));

  return (
    <GroupsApiProvider createGroup={createGroup.bind(null, "/admin/groups")}>
      <div>
        <Header
          description="Manage groups and their permissions."
          title="Groups"
        >
          <CreateGroupDialog />
        </Header>
        <Container className="p-4">
          <PermissionMatrix groups={groups.data.payload} />
        </Container>
      </div>
    </GroupsApiProvider>
  );
}
