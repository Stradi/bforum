"use client";

import { useEffect } from "react";
import useClient from "@hooks/use-client";
import { logout } from "@lib/api/auth";

// Do we really need this page? I dunno, but it's fine, I guess.
export default function Page() {
  const client = useClient();

  useEffect(() => {
    if (!client) return;

    logout(client)
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        throw err;
      });
  }, [client]);

  return null;
}
