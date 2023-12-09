"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useClient from "../../../hooks/use-client";
import { logout } from "../../../lib/api/auth";

// Do we really need this page? I dunno, but it's fine, I guess.
export default function Page() {
  const client = useClient();
  const router = useRouter();

  useEffect(() => {
    if (!client) return;

    logout(client)
      .then(() => {
        router.back();
      })
      .catch((err) => {
        throw err;
      });
  }, [client, router]);

  return null;
}
