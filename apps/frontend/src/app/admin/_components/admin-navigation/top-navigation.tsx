import Container from "@components/container";
import { Text } from "@radix-ui/themes";

export default function TopNavigation() {
  return (
    <Container>
      <nav className="flex justify-between py-2 px-4 items-center">
        <div className="flex gap-2 items-center">
          <Text size="2" weight="medium">
            bForum
          </Text>
          <span className="text-lg text-neutral-300 rotate-12 font-medium select-none">
            /
          </span>
          <Text size="2" weight="medium">
            Admin
          </Text>
        </div>
        <div>
          <Text size="2" weight="medium">
            User
          </Text>
        </div>
      </nav>
    </Container>
  );
}
