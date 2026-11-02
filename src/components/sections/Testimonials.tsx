import { Quote } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/data/site";
import { testimonials } from "@/data/testimonials";

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function Testimonials() {
  if (!siteConfig.showTestimonials) {
    return null;
  }

  const hasPlaceholders = testimonials.some(
    (testimonial) => testimonial.isPlaceholder,
  );

  return (
    <Section id="testimonials">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-light uppercase">
            Testimonials
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What clients say
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-lavender">
            Client feedback will appear here as projects are completed.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <li key={`${testimonial.name}-${index}`}>
              <Reveal delay={index * 0.08} className="h-full">
                <figure className="glass-card flex h-full flex-col rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <Quote
                      aria-hidden
                      className="size-8 shrink-0 text-violet-light"
                    />
                    {testimonial.isPlaceholder ? (
                      <span className="rounded-full border border-violet-light/40 bg-violet-deep/60 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-violet-light uppercase">
                        Sample
                      </span>
                    ) : null}
                  </div>

                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-lavender">
                    {testimonial.quote}
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-violet-light/20 pt-5">
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-violet-light/30 bg-violet-deep text-xs font-semibold text-lavender"
                    >
                      {getInitials(testimonial.name)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        {testimonial.name}
                      </span>
                      <span className="block text-xs text-lavender/80">
                        {testimonial.role}
                        {testimonial.company ? `, ${testimonial.company}` : ""}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        {hasPlaceholders ? (
          <p className="mt-6 text-sm text-lavender/70">
            Sample testimonials. Real client feedback will replace these soon.
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
