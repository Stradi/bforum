import type { PropsWithChildren } from "react";
import Container from "@components/container";
import Header from "@components/header";
import SideNavigation from "../_components/side-navigation";
import { AccountsApiProvider } from "./_helpers/accounts-api-provider";
import { deleteAccount, updateAccount } from "./_helpers/actions";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <AccountsApiProvider
      deleteAccount={deleteAccount.bind(null, "/admin/users")}
      updateAccount={updateAccount.bind(null, "/admin/users")}
    >
      <div className="space-y-2">
        <Header description="Manage users" title="Users" />
        <Container className="flex w-full gap-4 p-4">
          <SideNavigation
            className="-ml-2 w-60 shrink-0"
            items={[
              {
                label: "Overview",
                href: "/admin/users",
              },
            ]}
          />
          <div className="grow">{children}</div>
        </Container>
      </div>
    </AccountsApiProvider>
  );
}
