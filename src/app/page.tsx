import {
  About,
  CaseStudies,
  Contact,
  FAQ,
  Hero,
  Testimonials,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <CaseStudies />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
