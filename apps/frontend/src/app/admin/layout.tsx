import type { PropsWithChildren } from "react";
import AdminNavigation from "./components/admin-navigation";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <div>
      <AdminNavigation />
      <div>{children}</div>
    </div>
  );
}
