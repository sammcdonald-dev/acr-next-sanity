# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Next.js dev server + watch-typegen in parallel (Turbopack)
npm run next:build       # Run sanity typegen then build Next.js
npm run start            # Start production server

npm run test             # Run Vitest tests
npm run test -- --run src/lib/__tests__/foo.test.ts  # Run a single test file

npm run lint             # Biome lint check
npm run lint:fix         # Biome lint with auto-fix
npm run format:fix       # Biome format with auto-fix
npm run check:fix        # Biome lint + format with auto-fix

npm run sanity:typegen   # Extract schema and regenerate sanity.types.ts
npm run typecheck        # TypeScript check without emitting

ANALYZE=true npm run next:build  # Bundle analyzer
```

Node >=22 required (see `.nvmrc`).

## Architecture

This is the **10up Sanity Ignite** template — a Next.js 15 App Router site with Sanity Studio embedded at `/studio`. Both the frontend and the Studio run from the same Next.js app.

### Data flow

Pages fetch content via `sanityFetch` (from `src/lib/sanity/client/live.ts`), which wraps `next-sanity`'s `defineLive` for automatic ISR revalidation and draft-mode live preview. GROQ queries live in `src/lib/sanity/queries/queries.ts` and use composable fragments from `queries/fragments/fragments.ts`. All fetched types are auto-generated into `sanity.types.ts` via `sanity typegen`.

### Component hierarchy

```
ui/          Pure presentational components — no Sanity types, no data fetching
modules/     Accept Sanity data props; may call server actions; no direct fetching
sections/    Page-builder section components (Hero, CTA, MediaText, etc.)
templates/   Full-page layout wrappers (Post, PostRiver, Page, etc.)
```

`PageSections.tsx` is the page builder dispatcher — it maps each section's `_type` to a component from `SECTION_COMPONENTS` and renders them in order. Add a new section by: defining its schema in `src/studio/schema/objects/sections/`, adding it to `pageSections` field, and registering it in `SECTION_COMPONENTS`.

### Studio

`sanity.config.ts` at the repo root configures the Studio. Schema types come from `src/studio/schema/`, structure from `src/studio/structure/`. The Presentation Tool (visual editing overlay) maps routes to documents via `resolveHref` and `mainDocuments`.

### Environment variables

All env vars are validated with **valibot** at startup:
- Server-only vars → `src/env/serverEnv.ts`
- Public (`NEXT_PUBLIC_*`) vars → `src/env/clientEnv.ts`

Always access env vars through `serverEnv` / `clientEnv` objects, never `process.env` directly. Adding a new var requires updating `.env.example` and the appropriate env schema file.

### Import rules (enforced by Biome)

- `next-sanity` must not be imported inside `src/app/studio/` or `sanity.config.ts`
- Studio packages (`@/studio/*`, `@sanity/assist`, `@sanity/icons`, `@sanity/vision`) must not be imported inside `src/app/(frontend)/`

### Linting / formatting

Biome handles both linting and formatting (replaces ESLint + Prettier). Config is in `biome.json`. Single quotes, 2-space indent, 80-char line width, trailing commas ES5. `import type` is required for type-only imports. Husky runs `biome check` on staged files via lint-staged.
