"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent, RefObject } from "react";
import { createRef, useEffect, useState } from "react";
import NavigationItem from "./navigation-item";

const Items: {
  label: string;
  href: string;
  ref: RefObject<HTMLAnchorElement>;
}[] = [
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
    label: "Users",
    href: "/admin/users",
    ref: createRef<HTMLAnchorElement>(),
  },
];

export default function BottomNavigation() {
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  const pathname = usePathname();
  const activeItem = Items.toReversed().find((item) =>
    pathname.includes(item.href)
  );

  function onMouseEnter(e: MouseEvent<HTMLAnchorElement>) {
    const target = e.target as HTMLAnchorElement;
    const { offsetLeft, offsetWidth } = target;

    setIndicatorLeft(offsetLeft + offsetWidth / 2);
    setIndicatorWidth(offsetWidth);
  }

  function moveIndicatorToActiveItem() {
    if (activeItem?.ref.current) {
      setIndicatorLeft(
        activeItem.ref.current.offsetLeft +
          activeItem.ref.current.offsetWidth / 2
      );
      setIndicatorWidth(activeItem.ref.current.offsetWidth);
    } else {
      setIndicatorWidth(0);
    }
  }

  useEffect(() => {
    moveIndicatorToActiveItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);

  return (
    <nav className="relative border-b border-neutral-300">
      <div
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-full h-5/6 -z-10 bg-neutral-200/50 rounded-md transition-[left,width] duration-200"
        style={{
          left: indicatorLeft - indicatorWidth / 2,
          width: indicatorWidth,
        }}
      />

      <div className="flex justify-between items-center">
        <ul
          className="flex group/all [&>*]:px-4 [&>*]:py-2"
          onMouseLeave={moveIndicatorToActiveItem}
        >
          {Items.map((item) => (
            <NavigationItem
              href={item.href}
              isActive={item.href === activeItem?.href}
              key={item.href}
              onMouseEnter={onMouseEnter}
              ref={item.ref}
            >
              {item.label}
            </NavigationItem>
          ))}
        </ul>
      </div>
    </nav>
  );
}
