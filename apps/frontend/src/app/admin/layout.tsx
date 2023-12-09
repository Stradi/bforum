import type { PropsWithChildren } from "react";
import Container from "../../components/container";
import AdminNavigation from "./components/admin-navigation";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return (
    <Container>
      <AdminNavigation />
      {children}
    </Container>
  );
}
