import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/case-studies/real-estate-lead-response",
        destination: "/case-studies/client-onboarding-autopilot",
        permanent: true,
      },
      {
        source: "/case-studies/support-bot",
        destination: "/case-studies/ai-ecommerce-support-chatbot",
        permanent: true,
      },
      {
        source: "/case-studies/ecommerce-invoices",
        destination: "/case-studies/appointment-booking-chatbot",
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [75, 80],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
