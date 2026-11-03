import Image from "next/image";
import {
  Bot,
  Code2,
  Database,
  MessagesSquare,
  Package,
  Puzzle,
  Settings2,
  User,
  Webhook,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/data/site";

const skills = [
  { label: "n8n Automation", icon: Workflow },
  { label: "Custom CRM Development", icon: Database },
  { label: "Frontend Development", icon: Code2 },
  { label: "API and Webhook Integrations", icon: Webhook },
  { label: "Business Process Automation", icon: Settings2 },
  { label: "AI Chatbots", icon: Bot },
];

const values = [
  { label: "One package: CRM + automation", icon: Package },
  { label: "Built around your process", icon: Puzzle },
  { label: "Clear communication, fast delivery", icon: MessagesSquare },
];

export function About() {
  return (
    <Section id="about">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Reveal className="mx-auto w-full max-w-sm">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(139, 124, 199, 0.3), rgba(90, 59, 140, 0.16) 55%, transparent 76%)",
                }}
              />
              <div
                className="glass-card relative aspect-[4/5] overflow-hidden rounded-3xl"
                style={{ borderColor: "rgb(139 124 199 / 0.3)" }}
              >
                {siteConfig.photo ? (
                  <>
                    <Image
                      src={siteConfig.photo}
                      alt="Shaheer Mudassar, AI Automation Engineer"
                      fill
                      sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 90vw"
                      quality={80}
                      className="object-cover object-[center_20%]"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent"
                    />
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <span className="flex size-20 items-center justify-center rounded-full border border-violet-light/30 bg-violet-deep/70 text-violet-light">
                      <User aria-hidden className="size-9" />
                    </span>
                    <p className="text-sm font-medium text-lavender">
                      Photo coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] text-violet-light uppercase">
                About
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Hi, I&apos;m Shaheer
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-5 space-y-4">
                {siteConfig.aboutText.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-2xl text-base leading-relaxed text-lavender"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {skills.map((skill) => {
                  const Icon = skill.icon;

                  return (
                    <li
                      key={skill.label}
                      className="inline-flex items-center gap-2 rounded-full border border-violet-light/30 bg-violet-deep/50 px-4 py-2 text-sm text-lavender backdrop-blur"
                    >
                      <Icon
                        aria-hidden
                        className="size-4 shrink-0 text-violet-light"
                      />
                      {skill.label}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {values.map((value) => {
                  const Icon = value.icon;

                  return (
                    <li
                      key={value.label}
                      className="flex flex-col gap-2 rounded-xl border border-violet-light/25 bg-violet-deep/50 p-4 text-sm leading-snug text-lavender backdrop-blur"
                    >
                      <Icon aria-hidden className="size-5 text-violet-light" />
                      {value.label}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-8">
                <Button
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Free Call
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
