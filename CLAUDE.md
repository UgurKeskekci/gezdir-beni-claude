@AGENTS.md

<!-- modern-frontend-starter:conventions -->

## Project conventions

Architecture and folder rules: @docs/ARCHITECTURE.md

- `src/app` is routing only; domain code lives in `src/features/<feature>` and is imported through its `index.ts`.
- Pages/components get data only via a feature's async `services/`; only `src/lib/api/client.ts` calls `fetch`.
- `process.env` is read only in `src/config/env.ts`; site-wide constants live in `src/config/site.ts`.
- The site is tr + en. Never hardcode user-facing text in a component: it belongs in `src/i18n/dictionaries/tr.ts` and `en.ts`. Domain text (tour titles etc.) stays in the feature's `data/` as `{ tr, en }` and is flattened by its service.
- Everything is dummy data on purpose — no backend yet. Do not add one unless asked.
- Internal links go through `src/lib/routes.ts`, never hand-written `/tr/...` strings.
- Photos live in `public/images/tours/` (fetched by `scripts/fetch-demo-photos.mjs`). They are CC licensed: keep the `credit` block and the visible attribution, and never invent an author or licence.
- If `next dev` serves 404 for a route that `next build` lists, delete `.next` (stale route cache) and restart.
- Animations: transform/opacity only, 200-700ms, `--ease-out-expo`. Reuse `src/components/motion/` (`Reveal`, `CountUp`, `Parallax`, `Magnetic`). Never branch the rendered tree on `useReducedMotion()` — it causes a hydration mismatch.
- Gradients over photos use `rgb(var(--scrim-rgb) / a)`, never an `oklch()` colour fading to `transparent` (the build turns it into an opaque block). Use the `*-scrim` / `fade-edge-*` utilities.
- The site is dark only, and photos go through `<Photo>` so they get the generated blur preview. `next/image` uses `preload`, not the deprecated `priority`.
- Before finishing any change run: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`.
