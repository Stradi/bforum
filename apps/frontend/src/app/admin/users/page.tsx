import type { ApiAccount, ApiGroup } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import SubHeader from "../components/sub-header";
import AccountsTable from "./_components/accounts-table";

export default async function Page() {
  const client = await createServerComponentClient();
  const accounts = await client.sendRequest<{
    message: string;
    payload: ApiAccount[];
  }>("/api/v1/accounts?with_groups=1");

  const groups = await client.sendRequest<{
    message: string;
    payload: ApiGroup[];
  }>("/api/v1/groups");

  if (!accounts.success) throw new Error(JSON.stringify(accounts.error));
  if (!groups.success) throw new Error(JSON.stringify(groups.error));

  return (
    <div>
      <SubHeader
        description="You can see all the users in your forum here. You can create, edit and delete users. Click on a user to see more information and actions about it."
        title="Users"
      />
      <br />
      <AccountsTable
        accounts={accounts.data.payload}
        groups={groups.data.payload} // TODO: Find a way not to pass this down like this
      />
    </div>
  );
}
