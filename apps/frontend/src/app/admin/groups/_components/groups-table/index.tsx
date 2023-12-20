import type { ApiGroup } from "@lib/api/api.types";
import { DataTable } from "@components/ui/data-table";
import columns from "./table-columns";

type Props = {
  groups: ApiGroup[];
};
export default function GroupsTable({ groups }: Props) {
  return (
    <DataTable columns={columns} data={groups} key={JSON.stringify(groups)} />
  );
}
