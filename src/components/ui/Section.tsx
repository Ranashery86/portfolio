import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type SectionVariant = "dark" | "light";

type SectionProps = HTMLAttributes<HTMLElement> & {
  variant?: SectionVariant;
};

export function Section({ variant = "dark", className, ...props }: SectionProps) {
  return (
    <section
      data-section-variant={variant}
      className={cn(
        "py-20",
        variant === "dark" ? "bg-ink text-lavender" : "bg-lavender text-slate",
        className,
      )}
      {...props}
    />
  );
}
