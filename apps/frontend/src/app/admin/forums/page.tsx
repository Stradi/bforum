import { Button } from "@radix-ui/themes";
import Container from "../../../components/container";
import Header from "../components/header";

export default function Page() {
  return (
    <div>
      <Header
        description="Organize, create, update and delete your nodes."
        title="Forums"
      >
        <Button>Create new Node</Button>
      </Header>
      <Container className="p-4">Somethn</Container>
    </div>
  );
}
