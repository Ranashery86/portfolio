import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export function Header() {
  return (
    <header className="border-b border-violet-deep bg-ink">
      <Container className="flex items-center py-4">
        <Link href="/" className="font-heading text-lg font-semibold text-lavender">
          {siteConfig.name}
        </Link>
      </Container>
    </header>
  );
}
