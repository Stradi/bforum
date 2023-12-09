import { Button } from "@radix-ui/themes";
import Link from "next/link";
import createServerComponentClient from "../lib/api/client/create-server-component-client";

export default async function Page() {
  const client = await createServerComponentClient();

  return (
    <div>
      {!client.isAuthenticated() ? (
        <>
          <Button asChild>
            <Link href="/login" scroll={false}>
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/register" scroll={false}>
              Register
            </Link>
          </Button>
        </>
      ) : (
        <p>Already authenticated bruv</p>
      )}
    </div>
  );
}
