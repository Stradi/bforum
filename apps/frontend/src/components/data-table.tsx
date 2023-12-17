"use client";

import { Table } from "@radix-ui/themes";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  renderRow: (row: Row<T>) => React.JSX.Element;
};
export default function DataTable<T>({ columns, data, renderRow }: Props<T>) {
  const table = useReactTable({
    data,
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
            table.getRowModel().rows.map((row) => renderRow(row))
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
