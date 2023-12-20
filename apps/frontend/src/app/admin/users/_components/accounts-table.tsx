"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { ApiAccount, ApiAccountGroup, ApiGroup } from "@lib/api/api.types";
import { DataTable } from "@components/ui/data-table";
import { Badge } from "@components/ui/badge";

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
            <Badge key={accountGroup.group_id}>{accountGroup.group.name}</Badge>
          ))}
        </div>
      );
    },
  },
  // TODO: Add actions dropdown
];

type Props = {
  accounts: ApiAccount[];
  groups: ApiGroup[];
};
export default function AccountsTable({ accounts }: Props) {
  return (
    <DataTable
      columns={columns}
      data={accounts}
      key={JSON.stringify(accounts)}
    />
  );
}
