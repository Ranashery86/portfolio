import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type CardVariant = "glass" | "solid";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export function Card({ variant = "glass", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        variant === "glass"
          ? "glass-card"
          : "border border-violet-deep bg-violet-deep/40",
        className,
      )}
      {...props}
    />
  );
}
