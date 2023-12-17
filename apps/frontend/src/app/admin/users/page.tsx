import type { ApiAccount } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import SubHeader from "../components/sub-header";
import AccountsTable from "./_components/accounts-table";

export default async function Page() {
  const client = await createServerComponentClient();
  const accounts = await client.sendRequest<{
    message: string;
    payload: ApiAccount[];
  }>("/api/v1/accounts");

  if (!accounts.success) throw new Error(JSON.stringify(accounts.error));

  return (
    <div>
      <SubHeader
        description="You can see all the users in your forum here. You can create, edit and delete users. Click on a user to see more information and actions about it."
        title="Users"
      />
      <br />
      <AccountsTable accounts={accounts.data.payload} />
    </div>
  );
}
