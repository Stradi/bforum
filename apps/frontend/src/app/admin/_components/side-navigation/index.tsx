import type { ComponentPropsWithoutRef } from "react";
import NavigationItem from "./navigation-item";

type Props = ComponentPropsWithoutRef<"aside"> & {
  items: {
    label: string;
    href: string;
  }[];
};

export default function SideNavigation({ items, ...props }: Props) {
  return (
    <aside {...props}>
      <ul className="flex flex-col">
        {items.map((item) => (
          <NavigationItem href={item.href} key={item.href}>
            {item.label}
          </NavigationItem>
        ))}
      </ul>
    </aside>
  );
}
