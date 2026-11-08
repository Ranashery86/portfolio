import { CalendarDays, Mail } from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { siteConfig } from "@/data/site";

export function Contact() {
  return (
    <Section id="contact" className="border-t border-violet-light/15">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] text-violet-light uppercase">
                Contact
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Let&apos;s automate your business
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-lavender">
                Book a free call, or send me a message and I&apos;ll reply by
                email.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="glass-card mt-8 rounded-2xl p-6 sm:p-8">
                <p className="font-heading text-lg font-semibold text-white">
                  Prefer to talk?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-lavender">
                  Tell me what is taking up your team&apos;s time and we can
                  work out what is worth automating first.
                </p>
                <Button
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full sm:w-auto"
                >
                  <CalendarDays aria-hidden className="size-4" />
                  Book a Free Consultation
                </Button>
                <p className="mt-3 text-sm text-lavender/70">
                  15-minute call. No pressure.
                </p>

                <div className="mt-6 border-t border-violet-light/20 pt-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-violet-light uppercase">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium text-lavender underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                  >
                    <Mail aria-hidden className="size-4 text-violet-light" />
                    {siteConfig.email}
                  </a>
                </div>

                <SocialLinks className="mt-4" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <div className="rounded-2xl border border-violet-light/25 bg-violet-deep/40 p-6 shadow-[0_18px_50px_-12px_rgba(14,11,29,0.75)] backdrop-blur-xl sm:p-8">
              <h3 className="font-heading text-xl font-semibold text-white">
                Send a message
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-lavender">
                Share a few details and I&apos;ll get back to you by email.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
