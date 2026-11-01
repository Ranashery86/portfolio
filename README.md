# Shaheer Mudassar — Portfolio

Foundation for a personal portfolio site for Shaheer Mudassar, an AI Automation
Engineer (n8n automation, custom CRMs, frontend development). This stage contains
setup only: layout, design tokens, data placeholders, SEO foundation, and a contact
route stub. No sections, animations, or marketing copy have been built yet.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable                   | Required | Purpose                                                        |
| -------------------------- | -------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | Canonical site URL used for metadata, sitemap, and robots.     |
| `NEXT_PUBLIC_CALENDLY_URL` | Yes      | Booking link used by call-to-action buttons.                   |
| `WEB3FORMS_ACCESS_KEY`     | Yes\*    | Web3Forms access key for the contact form.                     |
| `N8N_WEBHOOK_URL`          | No       | Optional n8n webhook; when set, contact submissions go here.   |

\* Required unless `N8N_WEBHOOK_URL` is set.

`.env.local` is ignored by git. `.env.example` is committed.

## Project structure

```
src/
  app/
    layout.tsx                  Root layout: fonts, metadata, header, footer, JSON-LD
    page.tsx                    Home page with placeholder sections
    globals.css                 Tailwind theme tokens and global styles
    case-studies/[slug]/        Dynamic case study page (static params + metadata)
    api/contact/route.ts        POST contact stub (Web3Forms or n8n)
    sitemap.ts                  Sitemap generated from case study data
    robots.ts                   Robots rules and sitemap pointer
    not-found.tsx               404 page
  components/
    layout/                     Header, Footer
    sections/                   Hero, About, CaseStudies, Testimonials, FAQ, Contact
    seo/                        JsonLd helper
    ui/                         Button, Container, Section, Card
  data/
    site.ts                     Site config and headline
    case-studies.ts             Five typed demo case studies
    faq.ts                      Five placeholder FAQ items
  lib/
    utils.ts                    cn helper built on clsx
```

## Design tokens

Defined in `src/app/globals.css` via Tailwind v4 `@theme` and used as utilities:

| Token          | Value     | Usage                                    |
| -------------- | --------- | ---------------------------------------- |
| `ink`          | `#0E0B1D` | Main dark background                     |
| `violet-deep`  | `#2A1E4D` | Cards, alternate dark sections, borders  |
| `purple`       | `#5A3B8C` | Gradients, hover states, icons           |
| `violet-light` | `#8B7CC7` | Buttons, links, glow, main accent        |
| `lavender`     | `#C9C2E3` | Light section backgrounds, soft text     |
| `slate`        | `#3A3A52` | Body text on light sections, form borders|

Fonts: Space Grotesk (`font-heading`, `--font-heading`) for headings and Inter
(`font-body`, `--font-body`) for body text, loaded through `next/font/google`.
