import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import createServerComponentClient from "@lib/api/client/create-server-component-client";
import { Button } from "@components/ui/button";
import AccountPopover from "@components/account-popover";

export default async function NavigationRightSide() {
  const client = await createServerComponentClient();

  const isAuthenticated = client.isAuthenticated();
  if (isAuthenticated) {
    return <AccountPopover />;
  }

  return (
    <div className="flex gap-1">
      <Link href="/login" scroll={false}>
        <Button className="gap-x-1" variant="ghost">
          <LogInIcon className="size-4" />
          Login
        </Button>
      </Link>
      <Link href="/register" scroll={false}>
        <Button className="gap-x-1" variant="ghost">
          <UserRoundPlusIcon className="size-4" />
          Register
        </Button>
      </Link>
    </div>
  );
}
