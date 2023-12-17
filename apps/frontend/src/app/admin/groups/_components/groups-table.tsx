"use client";

import DataTable from "@components/data-table";
import type { ApiGroup } from "@lib/api/api.types";
import type { ColumnDef } from "@tanstack/react-table";
import SingleGroupRow from "./single-group-row";

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
];

type Props = {
  groups: ApiGroup[];
};
export default function GroupsTable({ groups }: Props) {
  return (
    <DataTable
      columns={columns}
      data={groups}
      key={JSON.stringify(groups)}
      renderRow={(row) => <SingleGroupRow key={row.id} {...row} />}
    />
  );
}
