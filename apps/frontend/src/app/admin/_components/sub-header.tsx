import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@utils/tw";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"section"> & {
  title: string;
  description?: string;
};
export default function SubHeader({
  title,
  description,
  children,
  className,
  ...props
}: Props) {
  return (
    <section
      className={cn("flex justify-between items-center", className)}
      {...props}
    >
      <div>
        <Heading as="h2" mb={description ? "2" : undefined} size="6">
          {title}
        </Heading>
        {description ? <Text size="2">{description}</Text> : null}
      </div>
      {children}
    </section>
  );
}
