import type { ApiGroup, ApiPermission } from "@lib/api/api.types";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import SubHeader from "../../components/sub-header";
import PermissionMatrix from "../_components/permission-matrix";

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
    <div>
      <SubHeader
        description="The table below is a permission matrix. Each row represents a permission and each column represents a group. By removing ticks from the matrix, you can disallow a group from performing a certain action, and vice versa."
        title="Permission Matrix"
      />
      <br />
      <PermissionMatrix
        groups={groups.data.payload}
        permissions={permissions.data.payload}
      />
    </div>
  );
}
