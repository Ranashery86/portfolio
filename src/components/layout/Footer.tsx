import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-violet-deep bg-ink">
      <Container className="py-6">
        <p className="text-sm text-lavender/70">
          © {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
