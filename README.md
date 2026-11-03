# Shaheer Mudassar — Portfolio

Personal portfolio site for Shaheer Mudassar, an AI Automation Engineer (n8n
automation, custom CRMs, frontend development). The contact form and the floating
voice assistant both go through server-only n8n webhooks, so no webhook URLs or
secrets are exposed to the browser.

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

| Variable                   | Required | Purpose                                                                 |
| -------------------------- | -------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | Canonical site URL used for metadata, sitemap, and robots.              |
| `NEXT_PUBLIC_CALENDLY_URL` | Yes      | Booking link used by call-to-action buttons.                            |
| `N8N_CONTACT_WEBHOOK_URL`  | Yes      | Server-only n8n webhook that receives contact form submissions.          |
| `N8N_VOICE_WEBHOOK_URL`    | Yes      | Server-only n8n webhook for the voice assistant.                        |
| `VOICE_WEBHOOK_SECRET`     | Yes      | Server-only secret sent to the voice webhook.                            |
| `VOICE_WEBHOOK_HEADER_NAME`| No       | Header name for the voice webhook secret (default `portfolio-voice-agent`). |

The contact form posts to `/api/contact`, which validates the input and forwards
it to `N8N_CONTACT_WEBHOOK_URL`. The voice widget posts recorded audio to
`/api/voice`, which validates the upload and forwards it to
`N8N_VOICE_WEBHOOK_URL` with the configured `VOICE_WEBHOOK_HEADER_NAME` header
(default `portfolio-voice-agent`).

The n8n webhook variables and the voice secret are intentionally server-only (no
`NEXT_PUBLIC_` prefix). Do not put webhook URLs or secrets in client code.

`.env.local` is ignored by git. `.env.example` is committed.

## Contact and voice integrations

- `/api/contact` accepts `{ name, email, message, website }`, validates the
  fields, silently accepts the `website` honeypot when it is filled, rate limits
  per IP, and expects a `2xx` response with `{ "success": true }` from n8n.
- `/api/voice` accepts multipart form data with an `audio` file and a
  `sessionId`, validates the file size and session ID, rate limits per IP, and
  forwards the audio to n8n with the configured `VOICE_WEBHOOK_HEADER_NAME`
  header (default `portfolio-voice-agent`).

Both n8n workflows must be published for the live integrations to work. When
deploying to Vercel, add the same three n8n variables in the project settings.

## Project structure

```
src/
  app/
    layout.tsx                  Root layout: fonts, metadata, header, footer, JSON-LD
    page.tsx                    Home page with placeholder sections
    globals.css                 Tailwind theme tokens and global styles
    case-studies/[slug]/        Dynamic case study page (static params + metadata)
    api/contact/route.ts        POST contact form proxy to the n8n webhook
    api/voice/route.ts          POST multipart audio proxy to the n8n voice agent
    sitemap.ts                  Sitemap generated from case study data
    robots.ts                   Robots rules and sitemap pointer
    not-found.tsx               404 page
  components/
    layout/                     Header, Footer
    sections/                   Hero, About, CaseStudies, Testimonials, FAQ, Contact
    seo/                        JsonLd helper
    ui/                         Button, Container, Section, Card
    voice/                      Lazy-loaded floating voice assistant widget
  data/
    site.ts                     Site config and headline
    case-studies.ts             Five typed case study entries
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
