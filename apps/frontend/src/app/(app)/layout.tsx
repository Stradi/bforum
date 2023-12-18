import { createRef, type PropsWithChildren } from "react";
import NavigationBar from "@components/navigation-bar";
import TopNavigation from "@components/navigation-bar/top-navigation";
import NavigationRightSide from "./_components/navigation-right-side";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <main>
      <TopNavigation rightSide={<NavigationRightSide />} subText="Main" />
      <NavigationBar
        items={[
          {
            label: "Forums",
            href: "/",
            ref: createRef<HTMLAnchorElement>(),
          },
          {
            label: "What's New",
            href: "/whats-new",
            ref: createRef<HTMLAnchorElement>(),
          },
        ]}
      />
      {children}
    </main>
  );
}
