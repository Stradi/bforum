"use client";

import ScalingDialogRoot from "@components/scaling-dialog";
import type { ApiAccount } from "@lib/api/api.types";
import { Dialog, Inset, Separator, Table } from "@radix-ui/themes";
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useState } from "react";

type Props = Pick<Row<ApiAccount>, "original" | "getVisibleCells">;
export default function SingleAccountRow({ original, getVisibleCells }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <ScalingDialogRoot
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
    >
      <Dialog.Trigger className="appearance-none">
        <Table.Row className="hover:bg-neutral-100 transition duration-100">
          {getVisibleCells().map((cell) => (
            <Table.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          ))}
        </Table.Row>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[450px]">
        <Dialog.Title size="4">Account details</Dialog.Title>
        <Dialog.Description mt="-2" size="2">
          View and edit account details.
        </Dialog.Description>
        <Inset my="5">
          <Separator my="3" size="4" />
        </Inset>
        <pre>{JSON.stringify(original, null, 2)}</pre>
      </Dialog.Content>
    </ScalingDialogRoot>
  );
}
