import Container from "@components/container";
import { Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

type Props = {
  subText?: string;
  rightSide?: ReactNode;
};
export default function TopNavigation({ subText, rightSide }: Props) {
  return (
    <Container>
      <nav className="flex justify-between py-2 px-4 items-center">
        <div className="flex gap-2 items-center">
          <Text size="2" weight="medium">
            bForum
          </Text>
          {subText ? (
            <>
              <span className="text-lg text-neutral-300 rotate-12 font-medium select-none">
                /
              </span>
              <Text size="2" weight="medium">
                {subText}
              </Text>
            </>
          ) : null}
        </div>
        {rightSide ? <div>{rightSide}</div> : null}
      </nav>
    </Container>
  );
}
