import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUp, Mail } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { siteConfig } from "@/data/site";

const footerLinks = [
  { label: "About", hash: "#about" },
  { label: "Case Studies", hash: "#case-studies" },
  { label: "Testimonials", hash: "#testimonials" },
  { label: "FAQ", hash: "#faq" },
  { label: "Contact", hash: "#contact" },
].filter(
  (link) => siteConfig.showTestimonials || link.hash !== "#testimonials",
);

async function getCopyrightYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCopyrightYear();

  return (
    <footer className="border-t border-violet-deep bg-ink">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full font-heading text-lg font-semibold text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <span aria-hidden className="pulse-dot" />
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm font-medium text-violet-light">
              AI Automation Engineer
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-lavender/80">
              Custom CRMs and n8n automation for businesses that want to remove
              manual work.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-light uppercase">
              Quick links
            </p>
            {footerLinks.map((link) => (
              <Link
                key={link.hash}
                href={`/${link.hash}`}
                className="inline-flex min-h-9 w-fit items-center text-sm font-medium text-lavender/80 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-light uppercase">
              Get in touch
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-lavender transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <Mail aria-hidden className="size-4 text-violet-light" />
              {siteConfig.email}
            </a>
            <SocialLinks className="mt-3" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-violet-deep pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-lavender/60">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-xs text-lavender/60">
              Case studies are illustrative examples of how these systems work.
            </p>
            <a
              href="#top"
              className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-violet-light transition-colors hover:text-lavender focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              Back to top
              <ArrowUp aria-hidden className="size-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
