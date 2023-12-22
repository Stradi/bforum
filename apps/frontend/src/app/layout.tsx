import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { PropsWithChildren, ReactNode } from "react";
import { Toaster } from "sonner";
import { ScalingDialogProvider } from "@components/scaling-dialog/scaling-dialog-provider";
import { cn } from "@utils/tw";
import "./globals.css";
import ComposeProviders from "@components/compose-providers";
import { NodesApiProvider } from "@lib/api/nodes/nodes-api-provider";
import { GroupsApiProvider } from "@lib/api/groups/groups-api-provider";
import { AccountsApiProvider } from "@lib/api/accounts/accounts-api-provider";
import { ThreadsApiProvider } from "@lib/api/threads/threads-api-provider";
import { RepliesApiProvider } from "@lib/api/replies/replies-api-provider";

type Props = PropsWithChildren & {
  modal: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en">
      <body>
        <ComposeProviders
          providers={[
            [ScalingDialogProvider, { bodyColor: "bg-black", padding: 16 }],
            [NodesApiProvider, {}],
            [GroupsApiProvider, {}],
            [AccountsApiProvider, {}],
            [ThreadsApiProvider, {}],
            [RepliesApiProvider, {}],
          ]}
        >
          {children}
          {modal}
          <Toaster closeButton />
        </ComposeProviders>
      </body>
    </html>
  );
}
