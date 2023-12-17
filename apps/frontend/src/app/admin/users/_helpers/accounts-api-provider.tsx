"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { DeleteAccountApiFn, UpdateAccountApiFn } from "../types";

type TAccountsApiContext = {
  updateAccount: UpdateAccountApiFn;
  deleteAccount: DeleteAccountApiFn;
};

const AccountsApiContext = createContext<TAccountsApiContext>(
  {} as TAccountsApiContext
);

type Props = PropsWithChildren & TAccountsApiContext;
function AccountsApiProvider({ children, ...props }: Props) {
  return (
    <AccountsApiContext.Provider value={props}>
      {children}
    </AccountsApiContext.Provider>
  );
}

export { AccountsApiContext, AccountsApiProvider };
