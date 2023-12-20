"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ApiGroup } from "@lib/api/api.types";
import { DataTable } from "@components/ui/data-table";

const columns: ColumnDef<ApiGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "account-count",
    header: "Account Count",
    accessorFn: (row) => row.accountGroup.length,
  },
  // TODO: Add row actions dropdown
];

type Props = {
  groups: ApiGroup[];
};
export default function GroupsTable({ groups }: Props) {
  return (
    <DataTable columns={columns} data={groups} key={JSON.stringify(groups)} />
  );
}
