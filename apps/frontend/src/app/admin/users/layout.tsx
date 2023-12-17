import Container from "@components/container";
import type { PropsWithChildren } from "react";
import Header from "../components/header";
import SideNavigation from "../components/side-navigation";
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
        <Container className="p-4 w-full flex gap-4">
          <SideNavigation
            className="w-60 -ml-2 shrink-0"
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
