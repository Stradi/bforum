import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@utils/tw";

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
      className={cn("flex justify-between items-center gap-4", className)}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-medium">{title}</h2>
        {description ? <p className="text-sm">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
