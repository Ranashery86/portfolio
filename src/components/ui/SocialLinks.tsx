import {
  BadgeCheck,
  Briefcase,
  Code2,
  Store,
  type LucideIcon,
} from "lucide-react";

import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

type SocialKey = keyof typeof siteConfig.social;

const socialItems: { key: SocialKey; label: string; icon: LucideIcon }[] = [
  { key: "linkedin", label: "LinkedIn", icon: Briefcase },
  { key: "upwork", label: "Upwork", icon: BadgeCheck },
  { key: "fiverr", label: "Fiverr", icon: Store },
  { key: "github", label: "GitHub", icon: Code2 },
];

type SocialLinksProps = {
  className?: string;
};

export function SocialLinks({ className }: SocialLinksProps) {
  const availableItems = socialItems.filter(
    (item) => siteConfig.social[item.key].length > 0,
  );

  if (availableItems.length === 0) {
    return null;
  }

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {availableItems.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.key}>
            <a
              href={siteConfig.social[item.key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} (opens in a new tab)`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-violet-light/30 bg-violet-deep/40 px-3 py-1.5 text-sm font-medium text-lavender transition-colors hover:border-violet-light/60 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <Icon aria-hidden className="size-4 text-violet-light" />
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
