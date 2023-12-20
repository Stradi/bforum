"use client";

import type { ApiAccount, ApiGroup } from "@lib/api/api.types";
import { DataTable } from "@components/ui/data-table";
import getColumns from "./table-columns";

type Props = {
  accounts: ApiAccount[];
  groups: ApiGroup[];
};
export default function AccountsTable({ accounts, groups }: Props) {
  return (
    <DataTable
      columns={getColumns(groups)}
      data={accounts}
      key={JSON.stringify(accounts)}
    />
  );
}
