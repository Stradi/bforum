"use client";

import DataTable from "@components/data-table";
import type { ApiAccount, ApiAccountGroup, ApiGroup } from "@lib/api/api.types";
import { Badge } from "@radix-ui/themes";
import { type ColumnDef } from "@tanstack/react-table";
import SingleAccountRow from "./single-account-row";

const columns: ColumnDef<ApiAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "display_name",
    header: "Display Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    header: "Created At",
    accessorFn: (row) => new Date(row.created_at).toLocaleString(),
  },
  {
    header: "Groups",
    accessorKey: "accountGroup",
    cell: ({ row }) => {
      // TODO: Assign colors to groups
      const accountGroups: ApiAccountGroup[] = row.getValue("accountGroup");
      return (
        <div className="flex flex-wrap gap-0.5">
          {accountGroups.map((accountGroup) => (
            <Badge
              className="bg-gray-200 text-gray-800"
              key={accountGroup.group_id}
            >
              {accountGroup.group.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
];

type Props = {
  accounts: ApiAccount[];
  groups: ApiGroup[];
};
export default function AccountsTable({ accounts, groups }: Props) {
  return (
    <DataTable
      columns={columns}
      data={accounts}
      key={JSON.stringify(accounts)}
      renderRow={(row) => (
        <SingleAccountRow groups={groups} key={row.id} {...row} />
      )}
    />
  );
}
