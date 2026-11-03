import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { caseStudies } from "@/data/case-studies";
import { siteConfig } from "@/data/site";

export function CaseStudies() {
  return (
    <Section id="case-studies" variant="light">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-purple uppercase">
              Case Studies
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Automation in action
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate">
              Five example projects showing how custom CRMs and n8n automation
              can remove manual work. Each one includes a walkthrough video.
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 flex flex-wrap justify-center gap-6">
          {caseStudies.map((caseStudy, index) => (
            <li
              key={caseStudy.slug}
              className="w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)]"
            >
              <Reveal delay={index * 0.06} className="h-full">
                <article className="group relative flex h-full flex-col rounded-2xl border border-violet-light/30 bg-violet-deep p-6 text-lavender transition duration-300 ease-out hover:-translate-y-1 hover:border-violet-light/60 focus-within:border-violet-light/60">
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-violet-light uppercase">
                      {caseStudy.industry}
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="font-heading text-4xl font-semibold text-white">
                      {caseStudy.metric}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.12em] text-lavender/70 uppercase">
                      {caseStudy.metricLabel}
                    </p>
                  </div>

                  <h3 className="mt-5 font-heading text-xl font-semibold text-white">
                    {caseStudy.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-lavender">
                    {caseStudy.shortDescription}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-violet-light transition-colors group-hover:text-white">
                    View Details
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>

                  <Link
                    href={`/case-studies/${caseStudy.slug}`}
                    aria-label={`View details for ${caseStudy.title}`}
                    className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-lavender"
                  />
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-slate">
          Figures shown are illustrative examples.
        </p>

        <div className="mt-12 flex justify-center">
          <Button
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:ring-offset-lavender"
          >
            Need something like this? Book a Free Call
          </Button>
        </div>
      </Container>
    </Section>
  );
}
