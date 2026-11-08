import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { VoiceWidgetLoader } from "@/components/voice/VoiceWidgetLoader";
import { siteConfig } from "@/data/site";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const photoUrl = siteConfig.photo
  ? new URL(siteConfig.photo, siteConfig.url).toString()
  : null;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "AI Automation Engineer",
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  ...(photoUrl ? { image: photoUrl } : {}),
  sameAs: Object.values(siteConfig.social).filter((url) => url.length > 0),
};

const socialImage = photoUrl
  ? { url: photoUrl, alt: "Shaheer Mudassar, AI Automation Engineer" }
  : null;

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Shaheer Mudassar",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    ...(socialImage ? { images: [socialImage.url] } : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        id="top"
        className="flex min-h-full flex-col bg-ink font-body text-lavender"
      >
        <JsonLd data={personSchema} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <VoiceWidgetLoader />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
