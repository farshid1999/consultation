# ذهن‌آورد — Sports Psychology Landing Page

A single-page, RTL, Persian-language marketing site for a premium sports-psychology
consultation practice. Built with Next.js 15 (App Router), React 19, TypeScript,
Tailwind CSS and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> This project was authored and verified in an offline sandbox: `npm install` and
> `next build` were run successfully against the real dependency versions, with the
> Google Font call temporarily stubbed only because the sandbox has no outbound access
> to fonts.googleapis.com. In your own environment (with normal internet access) the
> Vazirmatn font will load automatically — no changes needed.

## Structure

```
src/
├── app/                 # App Router entry: layout.tsx (SEO/metadata), page.tsx, globals.css
├── components/
│   ├── background/      # Canvas-based ambient neural particle field
│   ├── layout/           # Navbar, Footer, SectionDivider
│   ├── sections/         # Hero, Why, Services, Process, Benefits, Stats, Testimonials, FAQ, CTA
│   ├── providers/        # React Query provider
│   └── ui/               # Button, GlassCard, RevealOnScroll (shared primitives)
├── forms/                # BookingForm (React Hook Form + Zod + React Query)
├── schemas/              # Zod validation schemas
├── services/             # API-call functions (mocked)
├── hooks/                # useMagnetic, useReducedMotion
├── data/                 # Real Persian copy for every section
└── types/                # Shared TypeScript interfaces
```

## Design system

- **Color (60/30/10):** deep petroleum teal (`#0B2622`) dominates; warm cream
  (`#F5F1E7`) provides contrast surfaces and text; luxury gold (`#C9A24D`) is
  reserved strictly for accents — CTAs, icons, dividers, highlighted numerals.
- **Type:** Vazirmatn (variable Persian typeface) carries the entire scale —
  hierarchy comes from weight (400–800), size and letter-spacing rather than
  mixing families, since it is the most complete, production-safe Persian
  webfont available.
- **Signature motif:** a breathing concentric "pulse ring" behind the hero's
  center brain icon — a heartbeat crossed with a brainwave — echoed later in
  the stats counters and the FAQ's plus/rotate micro-interaction.
- **Motion:** staggered page-load reveal on the hero, scroll-linked reveals
  (fade/slide/scale/blur) per section, parallax on the "Why" portrait, a
  scroll-progress spine on the process timeline, and an animated diagonal
  wave divider before the footer. `prefers-reduced-motion` is respected
  throughout (see `useReducedMotion` and the CSS in `globals.css`).

## Accessibility & SEO

- Semantic landmarks, `aria-*` attributes on icon-only controls, visible
  focus rings, keyboard-operable accordion (FAQ) with proper `aria-expanded`/
  `aria-controls` wiring.
- `next/font` for zero layout shift, `Metadata` API with OpenGraph/Twitter
  tags, and a `MedicalBusiness` JSON-LD block for structured data.
