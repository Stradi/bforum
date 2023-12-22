"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { DeleteAccountApiFn, UpdateAccountApiFn } from "./account-types";
import { deleteAccount, updateAccount } from "./accounts-actions";

type TAccountsApiContext = {
  updateAccount: UpdateAccountApiFn;
  deleteAccount: DeleteAccountApiFn;
};

const AccountsApiContext = createContext<TAccountsApiContext>(
  {} as TAccountsApiContext
);

type Props = PropsWithChildren;
function AccountsApiProvider({ children }: Props) {
  return (
    <AccountsApiContext.Provider
      value={{
        deleteAccount: deleteAccount.bind(null, "/admin/users"),
        updateAccount: updateAccount.bind(null, "/admin/users"),
      }}
    >
      {children}
    </AccountsApiContext.Provider>
  );
}

export { AccountsApiContext, AccountsApiProvider };
