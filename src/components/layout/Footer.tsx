import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

const footerLinks = [
  { label: "About", hash: "#about" },
  { label: "Case Studies", hash: "#case-studies" },
  { label: "Contact", hash: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-violet-deep bg-ink">
      <Container className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-lavender/80">
          © {siteConfig.name} · Custom CRMs &amp; Automation
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.hash}
              href={`/${link.hash}`}
              className="text-sm font-medium text-violet-light transition-colors hover:text-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {link.label}
            </a>
          ))}

          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm font-medium text-violet-light transition-colors hover:text-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Email
          </a>
        </nav>
      </Container>
    </footer>
  );
}
