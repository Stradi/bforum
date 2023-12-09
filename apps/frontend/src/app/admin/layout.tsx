import type { PropsWithChildren } from "react";
import Container from "../../components/container";
import AdminNavigation from "./components/admin-navigation";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <Container>
      <AdminNavigation />
      <div className="px-4">{children}</div>
    </Container>
  );
}
