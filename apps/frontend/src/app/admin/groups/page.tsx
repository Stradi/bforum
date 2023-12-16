import type { ApiGroup } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import SubHeader from "../components/sub-header";
import CreateGroupDialog from "./_components/create-group-dialog";
import GroupsTable from "./_components/groups-table";

export default async function Page() {
  const client = await createServerComponentClient();
  const groups = await client.sendRequest<{
    message: string;
    payload: ApiGroup[];
  }>("/api/v1/groups?with_accounts=1");

  if (!groups.success) throw new Error(JSON.stringify(groups.error));

  return (
    <div>
      <SubHeader
        description="You can see all the groups in your forum here. You can create, edit and delete groups. Click on a group to see more information and actions about it."
        title="Groups"
      >
        <CreateGroupDialog />
      </SubHeader>
      <br />
      <GroupsTable groups={groups.data.payload} />
    </div>
  );
}
