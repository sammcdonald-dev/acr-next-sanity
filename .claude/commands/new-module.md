# /new-module

Scaffold a new page builder section/module for the Sanity Ignite project. This automates the full workflow: schema creation, schema registration, typegen, React component, and component map registration.

**Usage:** `/new-module $ARGUMENTS`

Where `$ARGUMENTS` is the kebab-case name of the new module (e.g. `class-schedule`, `instructor-list`, `hero-banner`).

---

## Step 1 — Understand the request

Before writing any files, determine what this module needs:

- What fields will it have? (text, images, arrays of items, references, CTAs, etc.)
- Is it a simple display section (pure RSC) or does it need client-side interactivity (carousel, accordion, tabs)?
- Does it reference other Sanity document types (e.g. `instructor`, `class`)?

If the module name alone isn't enough to infer the fields, make reasonable assumptions and note them in a comment at the top of the schema file.

---

## Step 2 — Create the Sanity schema file

Create `src/studio/schemas/modules/$ARGUMENTS.ts`:

```ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: '$ARGUMENTS',
  title: '<Human Readable Title>',
  type: 'object',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'options', title: 'Options' },
  ],
  fields: [
    // --- Content group ---
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),
    // Add module-specific fields here

    // --- Options group ---
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #class-schedule)',
      group: 'options',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
    },
    prepare({ heading, eyebrow }) {
      return {
        title: heading || '<Unnamed $ARGUMENTS>',
        subtitle: eyebrow,
      }
    },
  },
})
```

Adapt the fields to what this specific module actually needs. Remove fields that don't apply. Add fields that do.

---

## Step 3 — Register the schema

Open `src/studio/schemas/index.ts` (or wherever schemas are collected — check for an array of schema imports).

Add the import and register it in alphabetical order among the other module schemas:

```ts
import $ARGUMENTS from './modules/$ARGUMENTS'

// Add to the schemas array:
$ARGUMENTS,
```

---

## Step 4 — Add to the page builder

Find where the page builder block array is defined. This will be a `defineField` with `type: 'array'` and an `of: [...]` list of module type references. It's likely in `src/studio/schemas/documents/page.ts` or a shared `modules.ts` fragment.

Add the entry in alphabetical order:

```ts
{ type: '$ARGUMENTS' },
```

---

## Step 5 — Run TypeGen

Run the following command to regenerate Sanity types:

```bash
npm run typegen
```

Or if that script doesn't exist:

```bash
npx sanity typegen generate
```

Confirm that the new type (in PascalCase, e.g. `ClassSchedule`) is now exported from `src/sanity/types.ts` or wherever generated types live. If the types file path differs, find it first with: `find . -name "sanity-typegen.json"` to locate the output path.

---

## Step 6 — Create the React component

**First, decide the component type based on Ignite's architecture:**

- **`src/components/sections/`** — Large, structured page builder sections. This is almost always where a new CMS-driven module should live.
- **`src/components/modules/`** — Smaller components that receive Sanity data but aren't full page sections.
- **`src/components/ui/`** — Pure presentational components with no Sanity awareness. Don't put Sanity types here.

**For a standard page builder module, create `src/components/sections/<PascalCase>.tsx`:**

If it's a pure Server Component (no interactivity):

```tsx
import type { $ArgumentsPayload } from '@/sanity/types'

export type { $ArgumentsPayload as $ArgumentsProps }

export default function $Arguments({ heading, eyebrow, body, uid }: $ArgumentsPayload) {
  return (
    <section id={uid?.current}>
      {eyebrow && <p>{eyebrow}</p>}
      {heading && <h2>{heading}</h2>}
      {/* render body, items, etc. */}
    </section>
  )
}
```

If it needs client-side interactivity, create a subdirectory instead:

- `src/components/sections/<PascalCase>/index.tsx` — Server wrapper, imports and renders the client component
- `src/components/sections/<PascalCase>/client.tsx` — `'use client'` component with interactive logic

---

## Step 7 — Register the component in the component map

Find the file that maps Sanity module type names to React components. This is typically something like `src/components/sections/index.tsx` or a `moduleMap` / `components` object somewhere in the sections or modules directory.

Add the import and register it:

```tsx
import $Arguments from './<PascalCase>'

export const sections = {
  // ... existing entries in alphabetical order ...
  '$ARGUMENTS': $Arguments,
}
```

If the mapping pattern differs in your repo (e.g. a switch statement, a dynamic import), follow whatever convention is already established.

---

## Step 8 — Verify

Run through this checklist before finishing:

- [ ] `npm run typegen` ran cleanly with no errors
- [ ] `npm run build` (or `tsc --noEmit`) passes with no TypeScript errors
- [ ] The new module appears in Sanity Studio under the page builder block options
- [ ] Adding the module to a page and previewing locally renders the component (even if unstyled)
- [ ] The `uid` anchor field works if applicable

---

## Notes for the Actors Craft Room site

Common modules you'll likely scaffold for this project:

- `class-schedule` — table or card grid of classes with age group, day/time, rate
- `instructor-list` — person cards referencing an `instructor` document type
- `registration-cta` — CTA section linking to registration form/payment
- `news-post-list` — filtered list of recent posts/updates
- `program-benefits` — icon + text grid for childhood development messaging
- `location-info` — address, map embed, parking/transit info
- `faq-list` — accordion of frequently asked questions
