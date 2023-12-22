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
      className={cn("border-b bg-neutral-100 p-8", className)}
      {...props}
    >
      <Container className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <h1 className={cn("text-xl font-medium")}>{title}</h1>
          {description ? <p className="text-sm">{description}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
