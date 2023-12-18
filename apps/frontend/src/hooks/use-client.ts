import { useEffect, useState } from "react";
import type Client from "@lib/api/client";
import createClientComponentClient from "@lib/api/client/create-client-component-client";

export default function useClient() {
  const [pb, setPb] = useState<Client | null>(null);

  useEffect(() => {
    createClientComponentClient()
      .then((client) => {
        setPb(client);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  return pb;
}
