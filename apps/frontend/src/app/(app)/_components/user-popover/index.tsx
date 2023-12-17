"use client";

import type { ApiAccount } from "@lib/api/api.types";
import { Avatar, Button, Inset, Popover, Text } from "@radix-ui/themes";
import UserPopoverLink from "./user-popover-link";

type Props = {
  account: ApiAccount;
};

export default function UserPopover({ account }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button className="!font-medium" variant="soft">
          <Avatar fallback={account.username[0]} radius="full" size="1" />
          {account.username}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" className="w-[325px]" size="1">
        <Inset
          className="bg-neutral-100 border-b border-neutral-200 p-2"
          mb="3"
          side="top"
        >
          <div className="flex items-center gap-2">
            <Avatar fallback={account.username[0]} radius="full" size="5" />
            <div className="flex flex-col">
              <Text size="3" weight="medium">
                {account.username}
              </Text>
              <Text size="2">{account.email}</Text>
            </div>
          </div>
        </Inset>
        <div className="grid grid-cols-2">
          <UserPopoverLink href="/account" label="Account details" />
          <UserPopoverLink href="/account/security" label="Security" />
          <UserPopoverLink href="/account/preferences" label="Preferences" />
          <UserPopoverLink href="/account/privacy" label="Privacy" />
          <UserPopoverLink color="red" href="/logout" label="Log out" />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
