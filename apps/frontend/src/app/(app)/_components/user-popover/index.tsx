import type { ApiAccount } from "@lib/api/api.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import UserPopoverLink from "./user-popover-link";

type Props = {
  account: ApiAccount;
};

export default function UserPopover({ account }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="font-medium" variant="secondary">
          {account.username}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[325px] space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-neutral-200" />
          <div className="flex flex-col">
            <p className="">{account.username}</p>
            <p className="text-sm">{account.email}</p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2">
          <UserPopoverLink href="/account" label="Account details" />
          <UserPopoverLink href="/account/security" label="Security" />
          <UserPopoverLink href="/account/preferences" label="Preferences" />
          <UserPopoverLink href="/account/privacy" label="Privacy" />
          <UserPopoverLink href="/logout" label="Log out" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
