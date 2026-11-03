import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

import { WorkflowGraphic } from "./WorkflowGraphic";

const headlineLines = siteConfig.headline.split(/(?<=\.)\s+/);

export function Hero() {
  return (
    <section className="bg-glow relative isolate overflow-hidden">
      <div
        aria-hidden
        className="orb -z-10 -left-32 top-0 h-80 w-80 sm:h-[26rem] sm:w-[26rem]"
      />
      <div
        aria-hidden
        className="orb orb-slow -z-10 -right-24 top-1/4 h-72 w-72 sm:h-96 sm:w-96"
      />

      <Container className="flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)]">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-light/25 bg-violet-deep/40 px-4 py-1.5 text-xs font-medium tracking-wide text-lavender backdrop-blur">
                <span aria-hidden className="pulse-dot" />
                AI Automation Engineer
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                {headlineLines.map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === headlineLines.length - 1
                        ? "gradient-text block"
                        : "block"
                    }
                  >
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-lavender sm:text-lg">
                I build custom CRMs and connect every step of your business with
                n8n automation, so your team stops doing repetitive work and
                starts closing more deals.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Free Consultation
                </Button>

                <Link
                  href="#case-studies"
                  className="inline-flex min-h-11 items-center rounded-full px-1 text-sm font-medium text-violet-light underline-offset-4 transition-colors hover:text-lavender hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  See case studies
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <p className="mt-10 text-sm tracking-wide text-lavender/60">
                n8n <span aria-hidden>•</span> Custom CRMs{" "}
                <span aria-hidden>•</span> Frontend + Automation
              </p>
            </Reveal>
          </div>

          {/* Animated automation workflow graphic, desktop only. */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <WorkflowGraphic />
          </div>
        </div>
      </Container>
    </section>
  );
}
