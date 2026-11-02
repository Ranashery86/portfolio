export const siteConfig = {
  name: "Shaheer Mudassar",
  title: "Shaheer Mudassar | AI Automation Engineer",
  description:
    "Shaheer Mudassar is an AI Automation Engineer who builds n8n automations, custom CRMs, and frontends that remove manual work.",
  headline: "Custom CRM + Full Automation. One Package. Zero Manual Work.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  email: "hello@example.com",
  photo: "",
  aboutText: [
    "I'm an AI Automation Engineer who helps businesses stop wasting time on repetitive work. I build custom CRMs and connect every step of your process with n8n automation, so leads, follow-ups, invoices and support run on their own.",
    "[Add more about yourself here: your story, your approach, and why clients should work with you.]",
  ],
  showTestimonials: true,
  social: {
    linkedin: "",
    upwork: "",
    fiverr: "",
    github: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
