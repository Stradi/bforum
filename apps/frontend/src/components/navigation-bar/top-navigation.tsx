import type { ReactNode } from "react";
import Container from "@components/container";

type Props = {
  subText?: string;
  rightSide?: ReactNode;
};
export default function TopNavigation({ subText, rightSide }: Props) {
  return (
    <Container>
      <nav className="flex justify-between py-2 px-4 items-center">
        <div className="flex gap-2 items-center">
          <p className="font-medium text-sm">bForum</p>
          {subText ? (
            <>
              <span className="text-lg text-neutral-300 rotate-12 font-medium select-none">
                /
              </span>
              <p className="font-medium text-sm">{subText}</p>
            </>
          ) : null}
        </div>
        {rightSide ? <div>{rightSide}</div> : null}
      </nav>
    </Container>
  );
}
