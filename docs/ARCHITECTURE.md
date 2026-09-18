# Architecture

This project is a static-first frontend built so that a backend can be added later without moving files around. Read this before adding folders, features or any server code.

## Folder map

```
.
├── public/                     static assets served as-is (favicon, og images, fonts)
├── docs/ARCHITECTURE.md        this file
├── .env.example                documented env vars (committed); real values in .env.local (ignored)
└── src/
    ├── proxy.ts                sends locale-less paths to the default language
    ├── app/                    ROUTING ONLY (Next.js App Router)
    │   ├── globals.css         Tailwind v4 entry + design tokens (@theme)
    │   ├── robots.ts, sitemap.ts
    │   ├── [locale]/           every page lives under a language segment
    │   │   ├── layout.tsx      root <html lang>, fonts, metadata per language
    │   │   ├── not-found.tsx   404 (always in the default language)
    │   │   └── (site)/         route group: pages sharing header/footer
    │   │       ├── layout.tsx
    │   │       ├── page.tsx    "/tr", "/en"
    │   │       └── tours/      "/tr/tours" and "/tr/tours/[slug]"
    │   └── api/                (later) route handlers — see "Backend growth paths"
    ├── i18n/
    │   ├── dictionaries/       tr.ts (reference) and en.ts — ALL user-facing copy
    │   ├── get-dictionary.ts   async accessor used by pages
    │   └── types.ts            Dictionary type derived from tr.ts
    ├── components/
    │   ├── motion/             Reveal, CountUp, Parallax, Magnetic — reusable animation primitives
    │   ├── ui/                 reusable primitives: button, photo, icons, section-heading
    │   ├── layout/             site-header, site-footer, container, shells
    │   └── shared/             composed components used by 2+ features
    ├── features/               one folder per domain feature (see below)
    ├── config/
    │   ├── site.ts             site-wide constants: name, description, nav, links
    │   └── env.ts              the ONLY place that reads process.env (zod-validated)
    ├── lib/
    │   ├── utils.ts            cn() and small pure helpers
    │   ├── routes.ts           every internal URL, locale-aware
    │   ├── format.ts           Intl price/number formatting per locale
    │   ├── localize.ts         picks one language out of a stored image
    │   └── api/client.ts       typed fetch wrapper used by services
    ├── hooks/                  generic client hooks (not feature-specific)
    └── types/                  cross-feature shared types
```

## Feature modules

```
src/features/<feature>/
├── components/     UI that only this feature uses
├── data/           static typed data (the "fake backend" of today)
├── services/       async functions = the only way to get this feature's data
├── types.ts        the feature's domain types
└── index.ts        public API of the feature (what pages may import)
```

Rules:

1. `app/` files stay thin: import from `@/features/<x>` and `@/components/*`, compose, export metadata. No data literals, no business logic.
2. Import a feature only through its `index.ts`. Feature A never reaches into `features/b/components/...`.
3. Nobody reads `data/` except the feature's own `services/`. Nobody calls `fetch` except `lib/api/client.ts` (used by services).
4. Services are `async` and return domain types from day one:

```ts
// src/features/projects/services/get-projects.ts
import { projects } from "../data/projects";
import type { Project } from "../types";

export async function getProjects(): Promise<Project[]> {
  return projects;
  // backend arrives → return api.get<Project[]>("/projects");
}
```

When the backend arrives, only the body of these functions changes. Pages, components and types stay untouched.

5. Promote on second use: a component starts inside its feature; when a second feature needs it, move it to `components/shared` (or `components/ui` if it is a dumb primitive).

## Languages (tr + en)

1. **No user-facing string is written inside a component.** Every label, heading and sentence comes from `src/i18n/dictionaries/`. `tr.ts` is the reference: `Dictionary = typeof tr`, so a key missing from `en.ts` is a type error.
2. Adding a language = add its code to `locales` in `src/config/i18n.ts` and a dictionary file. Everything else (routes, sitemap, switcher, static params) follows automatically.
3. **Domain content** (tour titles, descriptions) is not in the dictionaries — it lives in the feature's `data/` as `LocalizedText` (`{ tr, en }`) and services flatten it to one language: `getTours(locale)`. That mirrors what a backend would return.
4. Pages receive `locale` from `params` and pass it down; components never guess the language.
5. Internal links always go through `src/lib/routes.ts` (`routes.tour(locale, slug)`), so a locale can never be forgotten.

## Theme

The site is **dark only**: the deep navy ground is part of the brand, so there is no
light variant and `:root` sets `color-scheme: dark`. Colours are semantic tokens
(`--background`, `--surface`, `--primary`, `--accent`, `--glass`…) mapped into Tailwind
through `@theme inline`, so a light theme could be added later by redefining the tokens.

Typography: `--font-display` (Plus Jakarta Sans) for headings, `--font-sans` (Inter) for
body, and `--font-accent` (Instrument Serif, italic) for **one** emphasis phrase per
heading — never more. Numbers that sit in a column or animate carry `data-tabular`.

## Demo photography

- The photos are real Wikimedia Commons images, downloaded into `public/images/tours/` by `node scripts/fetch-demo-photos.mjs`. Commons rate limits hotlinking (HTTP 429), so nothing is loaded from their servers at runtime.
- Blur previews live in the generated `src/features/tours/data/image-blur.ts`; `<Photo>` wires them into `next/image`. Regenerate with `node scripts/generate-blur-data.mjs` after changing a photo.
- Every photo carries `credit` (author, licence, Commons file page) in `src/features/tours/data/images.ts`, copied from the Commons API. They are CC licensed: **keep the attribution visible** and never invent an author or licence.
- To add a photo: add it to `PHOTOS` in the script, run the script, then add an entry with its credit to `images.ts`. Alt text is written in both languages, like any other user-facing string.
- Replacing these with your own photography means dropping files into `public/images/tours/` and removing the `credit` block from the entry.

## Motion

Animation is there to direct attention, never for its own sake. The rules:

1. **Transform and opacity only.** Nothing may animate a property that moves layout. Durations sit between 200ms and 700ms on `--ease-out-expo` (`cubic-bezier(0.22, 1, 0.36, 1)`), exposed to Tailwind as `ease-[var(--ease-out-expo)]`.
2. **Reusable pieces live in `src/components/motion/`.** `Reveal` (scroll-in fade and lift), `CountUp` (numbers that count from zero), `Parallax`, `Magnetic`. Reach for these before writing a one-off animation, and add new ones there so the hotel and booking pages can use them too.
3. **Never branch the rendered tree on `useReducedMotion()`.** It returns `null` on the server and a boolean on the client, so a branch produces a hydration mismatch. Change the animation's _values_ instead (`initial={false}`, a distance of 0), or let the `prefers-reduced-motion` media query in `globals.css` do the work.
4. **Content must be readable without JS.** `Reveal` renders visible HTML and only hides itself after mount, and it never hides anything that is already on screen. The hero headline animates with pure CSS so it paints without waiting for hydration.
5. **Entrance animations run once.** No replay on scroll back.

## Gradients over photography

Gradient stops must be written in `rgb()` with an explicit alpha, using the channel
variables `--scrim-rgb`, `--background-rgb` and `--primary-rgb`.

Do **not** write a gradient that fades an `oklch()` colour to `transparent`. The build
converts `oklch()` to `lab()`, and Chrome renders a `lab(... / 0)` stop as opaque — the
gradient becomes a solid block and hides the photo underneath. The ready-made utilities
are `hero-scrim`, `photo-scrim`, `cta-scrim`, `fade-edge-left`, `fade-edge-right` and
`rule-fade` in `globals.css`.

## Naming

- Files and folders: `kebab-case` (`site-header.tsx`, `get-projects.ts`). Components: `PascalCase` named exports. No default exports except where Next.js requires them (`page`, `layout`, `not-found`, `robots`, `sitemap`, route files).
- Always import with the `@/` alias across folders; relative imports only inside the same feature.
- Client components are the exception: add `"use client"` only to the leaf that needs state/effects/browser APIs.
- Env: browser-visible vars start with `NEXT_PUBLIC_`, are declared in `.env.example`, and are added to the schema in `config/env.ts`. Secrets are never `NEXT_PUBLIC_`.

## Backend growth paths

Pick one when the need appears. None of them requires restructuring.

### A. Backend inside this app (forms, small CRUD, auth, a database)

```
src/app/api/<resource>/route.ts     HTTP endpoints (route handlers)
src/server/                         server-only code — never imported by client components
├── db/                             ORM client, schema, migrations
├── services/                       business logic used by route handlers / server actions
└── auth/
```

- Add `import "server-only";` at the top of files in `src/server/`.
- Add a server env schema (non-`NEXT_PUBLIC_` vars) in `config/env.ts`, kept separate from the client schema.
- Feature services switch from `data/` to `api.get(...)` or call `src/server/services` directly from server components.
- If `output: "export"` was enabled in `next.config.ts`, remove it — static export cannot run route handlers or server actions.

### B. Separate backend (any language, another repo or host)

- Set `NEXT_PUBLIC_API_URL` in `.env.local`; `lib/api/client.ts` already prefixes every request with it.
- Feature services switch to `api.get/post/...`. Put request/response DTO types next to the service or in `types/`.
- The site can stay fully static if data is fetched at build time, or fetch client-side.

### C. Monorepo (frontend + backend + shared packages in one repo)

```
apps/web/          this project, moved as-is
apps/api/          the backend
packages/shared/   types, zod schemas, constants shared by both
```

- Use the package manager's workspaces (pnpm/npm) and optionally Turborepo. Because all imports use `@/`, moving this project into `apps/web/` needs no code changes.

## Adding things — quick reference

| I want to add...                                       | Put it in...                                                                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| a new page `/about`                                    | `src/app/[locale]/(site)/about/page.tsx` (thin) + a feature if it has its own data/UI                                                    |
| any visible text                                       | `src/i18n/dictionaries/tr.ts` **and** `en.ts`                                                                                            |
| a new language                                         | `locales` in `src/config/i18n.ts` + a dictionary file                                                                                    |
| a photo                                                | `scripts/fetch-demo-photos.mjs`, then `scripts/generate-blur-data.mjs`, then an entry with credit in `src/features/tours/data/images.ts` |
| an animation                                           | `src/components/motion/` — reuse `Reveal` / `CountUp` before writing a new one                                                           |
| a scrim or fade over a photo                           | a `@utility` in `globals.css` using the `rgb(var(--…-rgb) / a)` pattern                                                                  |
| an internal link                                       | a function in `src/lib/routes.ts` — never a hand-written `/tr/...` string                                                                |
| a section with its own data                            | `src/features/<name>/`                                                                                                                   |
| a button/input/card primitive                          | `src/components/ui/`                                                                                                                     |
| a pages group with a different shell (dashboard, auth) | new route group `src/app/(dashboard)/layout.tsx`                                                                                         |
| a global constant / nav item                           | `src/config/site.ts`                                                                                                                     |
| a new env var                                          | `.env.example` + `src/config/env.ts`                                                                                                     |
| a generic hook                                         | `src/hooks/`                                                                                                                             |
| an API endpoint                                        | `src/app/api/...` + `src/server/` (path A)                                                                                               |
