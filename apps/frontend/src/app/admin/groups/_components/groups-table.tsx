"use client";

import type { ApiGroup } from "@lib/api/api.types";
import { Table } from "@radix-ui/themes";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
  const table = useReactTable({
    data: groups,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table.Root size="1" variant="surface">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeaderCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.length ? (
            table
              .getRowModel()
              .rows.map((row) => <SingleGroupRow {...row} key={row.id} />)
          ) : (
            <Table.Row>
              <Table.Cell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
