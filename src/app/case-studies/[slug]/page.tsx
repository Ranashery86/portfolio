import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ImageIcon, Play } from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LoomFacade } from "@/components/ui/LoomFacade";
import { Section } from "@/components/ui/Section";
import { caseStudies, getCaseStudyBySlug } from "@/data/case-studies";
import { siteConfig } from "@/data/site";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return { title: "Case study not found" };
  }

  const description = `${caseStudy.shortDescription} Case study with illustrative results.`;

  return {
    title: caseStudy.title,
    description,
    alternates: {
      canonical: `/case-studies/${caseStudy.slug}`,
    },
    openGraph: {
      type: "article",
      title: caseStudy.title,
      description,
      url: `/case-studies/${caseStudy.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const currentIndex = caseStudies.findIndex(
    (entry) => entry.slug === caseStudy.slug,
  );
  const previous = currentIndex > 0 ? caseStudies[currentIndex - 1] : undefined;
  const next =
    currentIndex < caseStudies.length - 1
      ? caseStudies[currentIndex + 1]
      : undefined;

  const steps = [
    {
      title: "The Problem",
      body: caseStudy.problem,
      paragraphs: caseStudy.problemParagraphs,
    },
    {
      title: "The Solution",
      body: caseStudy.solution,
      paragraphs: caseStudy.solutionParagraphs,
    },
    {
      title: "The Result",
      body: caseStudy.result,
      paragraphs: undefined,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case Studies",
        item: `${siteConfig.url}/#case-studies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: caseStudy.title,
        item: `${siteConfig.url}/case-studies/${caseStudy.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <section className="bg-glow relative isolate overflow-hidden">
        <div
          aria-hidden
          className="orb -z-10 -right-24 top-0 h-72 w-72 opacity-70 sm:h-96 sm:w-96"
        />

        <Container className="py-16 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-lavender/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-violet-light/60">
                /
              </li>
              <li>
                <Link
                  href="/#case-studies"
                  className="transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                >
                  Case Studies
                </Link>
              </li>
              <li aria-hidden className="text-violet-light/60">
                /
              </li>
              <li aria-current="page" className="text-lavender">
                {caseStudy.title}
              </li>
            </ol>
          </nav>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold tracking-[0.16em] text-violet-light uppercase">
                  {caseStudy.industry}
                </span>
              </div>

              <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {caseStudy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-lavender">
                {caseStudy.subtitle ?? caseStudy.shortDescription}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-violet-light/25 bg-violet-deep/50 px-6 py-5 backdrop-blur">
              <p className="font-heading text-4xl font-semibold whitespace-nowrap text-white sm:text-5xl">
                {caseStudy.metric}
              </p>
              <p className="mt-1 text-xs tracking-[0.14em] text-violet-light uppercase">
                {caseStudy.metricLabel}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section variant="light">
        <Container>
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
            <ol className="flex flex-col">
              {steps.map((step, index) => (
                <li key={step.title} className="relative pb-10 pl-16 last:pb-0">
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute top-12 bottom-0 left-5 w-px -translate-x-1/2 bg-violet-light/40"
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-full bg-violet-deep font-heading text-sm font-semibold text-lavender"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-heading text-2xl font-semibold text-ink">
                    {step.title}
                  </h2>
                  {step.paragraphs ? (
                    <div className="mt-3 flex max-w-3xl flex-col gap-4">
                      {step.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-base leading-relaxed text-slate"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : step.title === "The Result" && caseStudy.resultStats ? (
                    <div className="mt-3 flex max-w-3xl flex-col gap-6">
                      {caseStudy.resultIntro ? (
                        <p className="text-base leading-relaxed text-slate">
                          {caseStudy.resultIntro}
                        </p>
                      ) : null}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {caseStudy.resultStats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-2xl border border-violet-light/20 bg-violet-deep p-5"
                          >
                            <p className="font-heading text-2xl font-semibold text-white">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-lavender">
                              {stat.label}
                            </p>
                            <p className="mt-3 text-xs leading-relaxed text-lavender/80 italic">
                              {stat.assumption}
                            </p>
                          </div>
                        ))}
                      </div>

                      {caseStudy.resultNote ? (
                        <p className="text-xs leading-relaxed text-slate/80 italic">
                          {caseStudy.resultNote}
                        </p>
                      ) : null}

                      {caseStudy.resultBenefitsTitle ? (
                        <p className="text-base leading-relaxed text-slate">
                          {caseStudy.resultBenefitsTitle}
                        </p>
                      ) : null}

                      {caseStudy.resultBenefits ? (
                        <ul className="grid gap-4 sm:grid-cols-3">
                          {caseStudy.resultBenefits.map((benefit) => (
                            <li
                              key={benefit.title}
                              className="rounded-2xl border border-violet-light/30 bg-violet-light/10 p-5"
                            >
                              <p className="font-heading text-base font-semibold text-ink">
                                {benefit.title}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-slate">
                                {benefit.text}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {caseStudy.resultOutro ? (
                        <p className="text-base leading-relaxed text-slate">
                          {caseStudy.resultOutro}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate">
                      {step.body}
                    </p>
                  )}
                </li>
              ))}
            </ol>

            {caseStudy.howItWorks ? (
              <div>
                <h2 className="font-heading text-2xl font-semibold text-ink">
                  How It Works
                </h2>
                <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                  {caseStudy.howItWorks.map((item, index) => (
                    <li
                      key={item.title}
                      className="rounded-2xl border border-violet-light/30 bg-violet-light/10 p-5"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-violet-deep font-heading text-sm font-semibold text-lavender">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 font-heading text-base font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ol>
                {caseStudy.howItWorksOutro ? (
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate">
                    {caseStudy.howItWorksOutro}
                  </p>
                ) : null}
              </div>
            ) : null}

            {caseStudy.builtFor ? (
              <div className="rounded-2xl border border-violet-light/30 bg-violet-light/10 p-6">
                <h2 className="font-heading text-2xl font-semibold text-ink">
                  {caseStudy.builtFor.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate">
                  {caseStudy.builtFor.text}
                </p>
              </div>
            ) : null}

            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">
                Walkthrough Video
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
                A short preview of how this workflow is put together.
              </p>
              <div className="mt-6">
                {caseStudy.loomUrl ? (
                  <LoomFacade
                    loomUrl={caseStudy.loomUrl}
                    title={caseStudy.title}
                  />
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-light/50 bg-violet-light/10 p-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-violet-deep text-lavender">
                      <Play aria-hidden className="ml-0.5 size-5 fill-current" />
                    </span>
                    <p className="font-heading text-lg font-semibold text-ink">
                      Walkthrough video coming soon
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-slate">
                      This case study does not have a recorded walkthrough yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">
                Workflow Screenshot
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
                A visual reference of the workflow nodes and connections used in
                this case study.
              </p>
              <div className="mt-6">
                {caseStudy.screenshot ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-violet-light/30 bg-violet-deep">
                    <Image
                      src={caseStudy.screenshot}
                      alt={`Workflow screenshot for ${caseStudy.title}`}
                      fill
                      sizes="(min-width: 896px) 896px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-light/50 bg-violet-light/10 p-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-violet-deep text-lavender">
                      <ImageIcon aria-hidden className="size-5" />
                    </span>
                    <p className="font-heading text-lg font-semibold text-ink">
                      Workflow screenshot coming soon
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-slate">
                      A visual walkthrough will be added here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <section className="bg-glow relative isolate overflow-hidden">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {caseStudy.cta?.heading ?? "Need something like this?"}
            </h2>
            {caseStudy.cta ? (
              caseStudy.cta.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-lavender"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-base leading-relaxed text-lavender">
                Tell me what is slowing your team down, and I will map out the
                workflow that removes the manual work.
              </p>
            )}
            <Button
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {caseStudy.cta?.buttonLabel ?? "Book a Free Call"}
            </Button>
          </div>
        </Container>
      </section>

      <Section variant="light">
        <Container>
          <nav
            aria-label="Case study navigation"
            className="flex flex-col gap-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                {previous ? (
                  <Link
                    href={`/case-studies/${previous.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-violet-light/30 p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-light/60 focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-lavender focus-visible:outline-none"
                  >
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-purple uppercase">
                      <ArrowLeft aria-hidden className="size-4" />
                      Previous
                    </span>
                    <span className="mt-2 font-heading text-lg font-semibold text-ink">
                      {previous.title}
                    </span>
                  </Link>
                ) : null}
              </div>

              <div>
                {next ? (
                  <Link
                    href={`/case-studies/${next.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-violet-light/30 p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-light/60 focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-lavender focus-visible:outline-none sm:items-end sm:text-right"
                  >
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-purple uppercase">
                      Next
                      <ArrowRight aria-hidden className="size-4" />
                    </span>
                    <span className="mt-2 font-heading text-lg font-semibold text-ink">
                      {next.title}
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/#case-studies"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-lavender focus-visible:outline-none"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Back to all case studies
              </Link>
            </div>
          </nav>
        </Container>
      </Section>
    </>
  );
}
