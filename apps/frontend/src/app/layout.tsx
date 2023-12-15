import { ScalingDialogProvider } from "@components/scaling-dialog/scaling-dialog-provider";
import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { cn } from "@utils/tw";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { PropsWithChildren, ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

type Props = PropsWithChildren & {
  modal: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en">
      <body>
        <ScalingDialogProvider bodyColor="bg-black" padding={16}>
          <Theme>
            {children}
            {modal}
            <ThemePanel defaultOpen={false} />
            <Toaster closeButton />
          </Theme>
        </ScalingDialogProvider>
      </body>
    </html>
  );
}
