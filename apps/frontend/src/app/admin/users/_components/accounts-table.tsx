"use client";

import DataTable from "@components/data-table";
import type { ApiAccount } from "@lib/api/api.types";
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
];

type Props = {
  accounts: ApiAccount[];
};
export default function AccountsTable({ accounts }: Props) {
  return (
    <DataTable
      columns={columns}
      data={accounts}
      renderRow={(row) => <SingleAccountRow key={row.id} {...row} />}
    />
  );
}
