import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { faqs } from "@/data/faq";
import { siteConfig } from "@/data/site";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function FAQ() {
  return (
    <Section id="faq" variant="light">
      <JsonLd data={faqJsonLd} />
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-purple uppercase">
            FAQ
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            A few things people usually ask before we start working together.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.04}>
              <details className="group rounded-2xl border border-violet-light/30 bg-violet-deep text-lavender transition-colors hover:border-violet-light/60 open:border-violet-light/80">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-inset focus-visible:outline-none sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-heading text-base font-semibold text-white sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className="size-5 shrink-0 text-violet-light transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <div className="faq-answer px-5 pb-5 sm:px-6">
                  <p className="max-w-3xl text-sm leading-relaxed text-lavender sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-violet-light/30 bg-violet-light/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-xl font-semibold text-ink">
                Still have a question?
              </p>
              <p className="mt-1 text-sm text-slate">
                Send me a message and I&apos;ll reply by email.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Free Call
              </Button>
              <Link
                href="#contact"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-purple underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-lavender focus-visible:outline-none"
              >
                Send a message
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
