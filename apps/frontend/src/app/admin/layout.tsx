import { createRef, type PropsWithChildren } from "react";
import NavigationBar from "@components/navigation-bar";
import TopNavigation from "@components/navigation-bar/top-navigation";
import AccountPopover from "@components/account-popover";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <div>
      <header>
        <TopNavigation rightSide={<AccountPopover />} subText="Admin" />
        <NavigationBar
          items={[
            {
              label: "Overview",
              href: "/admin",
              ref: createRef<HTMLAnchorElement>(),
            },
            {
              label: "Nodes",
              href: "/admin/nodes",
              ref: createRef<HTMLAnchorElement>(),
            },
            {
              label: "Groups",
              href: "/admin/groups",
              ref: createRef<HTMLAnchorElement>(),
            },
            {
              label: "Users",
              href: "/admin/users",
              ref: createRef<HTMLAnchorElement>(),
            },
          ]}
        />
      </header>
      <div>{children}</div>
    </div>
  );
}
