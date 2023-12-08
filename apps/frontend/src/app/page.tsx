import { Button } from "@radix-ui/themes";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
}
