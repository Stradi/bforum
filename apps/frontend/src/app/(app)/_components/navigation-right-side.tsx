import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import { Button } from "@components/ui/button";
import UserPopover from "./user-popover";

export default async function NavigationRightSide() {
  const client = await createServerComponentClient();
  const account = await client.getAuthenticatedAccount();

  if (account) {
    return <UserPopover account={account} />;
  }

  return (
    <div className="flex gap-1">
      <Link href="/login" scroll={false}>
        <Button className="gap-x-1" variant="ghost">
          <LogInIcon className="w-4 h-4" />
          Login
        </Button>
      </Link>
      <Link href="register" scroll={false}>
        <Button className="gap-x-1" variant="ghost">
          <UserRoundPlusIcon className="w-4 h-4" />
          Register
        </Button>
      </Link>
    </div>
  );
}
