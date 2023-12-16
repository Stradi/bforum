import type { ApiGroup } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import SubHeader from "../components/sub-header";
import CreateGroupDialog from "./_components/create-group-dialog";

export default async function Page() {
  const client = await createServerComponentClient();
  const groups = await client.sendRequest<{
    message: string;
    payload: ApiGroup[];
  }>("/api/v1/groups");

  return (
    <div>
      <SubHeader
        description="You can see all the groups in your forum here. You can create, edit and delete groups. Be careful, deleting a group is irreversible."
        title="Groups"
      >
        <CreateGroupDialog />
      </SubHeader>
      <br />
      <pre>{JSON.stringify(groups, null, 2)}</pre>
    </div>
  );
}
