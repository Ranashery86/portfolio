import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { caseStudies, getCaseStudyBySlug } from "@/data/case-studies";

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

  return {
    title: caseStudy.title,
    description: caseStudy.shortDescription,
    alternates: {
      canonical: `/case-studies/${caseStudy.slug}`,
    },
    openGraph: {
      type: "article",
      title: caseStudy.title,
      description: caseStudy.shortDescription,
      url: `/case-studies/${caseStudy.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.shortDescription,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <Section>
      <Container>
        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-3">
            <p className="text-sm text-violet-light">{caseStudy.industry}</p>
            <h1 className="font-heading text-4xl font-semibold">{caseStudy.title}</h1>
            <p>{caseStudy.shortDescription}</p>
            {caseStudy.isDemo ? (
              <p className="text-sm font-medium text-violet-light">Demo Project</p>
            ) : null}
          </header>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold">Problem</h2>
              <p>{caseStudy.problem}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold">Solution</h2>
              <p>{caseStudy.solution}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold">Result</h2>
              <p>{caseStudy.result}</p>
            </div>
          </div>
        </article>
      </Container>
    </Section>
  );
}
