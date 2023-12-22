"use client";

import { useContext } from "react";
import { AccountsApiContext } from "./accounts-api-provider";

export default function useAccountsApi() {
  const context = useContext(AccountsApiContext);
  return context;
}
