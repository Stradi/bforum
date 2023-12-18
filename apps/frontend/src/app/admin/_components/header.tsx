import { Heading, Text } from "@radix-ui/themes";
import type { ComponentPropsWithoutRef } from "react";
import Container from "@components/container";
import { cn } from "@utils/tw";

type Props = ComponentPropsWithoutRef<"section"> & {
  title: string;
  description?: string;
};
export default function Header({
  title,
  description,
  children,
  className,
  ...props
}: Props) {
  return (
    <section
      className={cn("border-b py-8 px-8 bg-neutral-100", className)}
      {...props}
    >
      <Container className="px-4 flex justify-between items-center">
        <div>
          <Heading as="h1" mb={description ? "2" : undefined} size="7">
            {title}
          </Heading>
          {description ? <Text size="2">{description}</Text> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
