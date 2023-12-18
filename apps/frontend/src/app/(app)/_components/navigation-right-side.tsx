import { Button } from "@radix-ui/themes";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import UserPopover from "./user-popover";

export default async function NavigationRightSide() {
  const client = await createServerComponentClient();
  const account = await client.getAuthenticatedAccount();

  if (account) {
    return <UserPopover account={account} />;
  }

  return (
    <div className="flex gap-0 divide-x divide-[var(--accent-a4)] hover:divide-[var(--accent-a5)]">
      <Button asChild className="!rounded-r-none" variant="soft">
        <Link href="/login" scroll={false}>
          <LogInIcon className="w-4 h-4" />
          Login
        </Link>
      </Button>
      <Button asChild className="!rounded-l-none" variant="soft">
        <Link href="register" scroll={false}>
          <UserRoundPlusIcon className="w-4 h-4" />
          Register
        </Link>
      </Button>
    </div>
  );
}
