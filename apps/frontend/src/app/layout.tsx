import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { type PropsWithChildren } from "react";
import { cn } from "../utils/tw";
import "./globals.css";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en">
      <body>
        <Theme>
          {children}
          <ThemePanel />
        </Theme>
      </body>
    </html>
  );
}
