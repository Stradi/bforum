import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import AccountPopoverLink from "./account-popover-link";

export default async function AccountPopover() {
  const client = await createServerComponentClient();

  const account = await client.getAuthenticatedAccount();
  if (!account) {
    throw new Error("You are both authenticated and not authenticated. What?");
  }

  const canViewAdminPanel = await client.checkPermission(
    "General.CanViewAdminPanel"
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="font-medium" variant="secondary">
          {account.username}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[325px] space-y-2">
        <div className="flex items-center gap-2">
          <div className="size-12 rounded-full bg-neutral-200" />
          <div className="flex flex-col">
            <p className="">{account.username}</p>
            <p className="text-sm">{account.email}</p>
          </div>
        </div>
        {canViewAdminPanel ? (
          <>
            <Separator />
            <div className="grid grid-cols-2">
              <AccountPopoverLink href="/admin" label="Admin panel" />
            </div>
          </>
        ) : null}
        <Separator />
        <div className="grid grid-cols-2">
          <AccountPopoverLink href="/account" label="Account details" />
          <AccountPopoverLink href="/account/security" label="Security" />
          <AccountPopoverLink href="/account/preferences" label="Preferences" />
          <AccountPopoverLink href="/account/privacy" label="Privacy" />
          <AccountPopoverLink href="/logout" label="Log out" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
