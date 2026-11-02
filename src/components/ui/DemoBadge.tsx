import { cn } from "@/lib/utils";

type DemoBadgeProps = {
  className?: string;
};

export function DemoBadge({ className }: DemoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-violet-light/40 bg-purple/20 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-lavender uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-violet-light" />
      Demo Project
    </span>
  );
}
