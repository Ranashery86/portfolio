export const siteConfig = {
  name: "Shaheer Mudassar",
  title: "Shaheer Mudassar | AI Automation Engineer",
  description:
    "Shaheer Mudassar is an AI Automation Engineer who builds n8n automations, custom CRMs, and frontends that remove manual work.",
  headline: "Custom CRM + Full Automation. One Package. Zero Manual Work.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  email: "hello@example.com",
  social: {
    linkedin: "",
    github: "",
    x: "",
    youtube: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
