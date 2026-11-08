import {
  About,
  CaseStudies,
  Contact,
  FAQ,
  Hero,
  Testimonials,
} from "@/components/sections";
import { siteConfig } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <CaseStudies />
      {siteConfig.showTestimonials ? <Testimonials /> : null}
      <FAQ />
      <Contact />
    </>
  );
}
