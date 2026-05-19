import { createClient, type SanityClient } from '@sanity/client';

const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-22',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function k(): string {
  return Math.random().toString(36).slice(2, 10);
}

function block(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: k(),
    style,
    children: [{ _type: 'span', _key: k(), text, marks: [] as string[] }],
    markDefs: [] as unknown[],
  };
}

function externalLink(href: string) {
  return { _type: 'link', type: 'external', external: href, href, openInNewTab: false };
}

const CATEGORY_TECH_ID = 'seed-category-technology';
const CATEGORY_DESIGN_ID = 'seed-category-design';
const PERSON_ID = 'seed-person-jane-doe';

const documents = [
  // ── Site Settings ──────────────────────────────────────────────────
  {
    _id: 'siteSettings',
    _type: 'settings',
    title: 'ACR',
    menu: [
      {
        _key: k(),
        _type: 'menuItem',
        type: 'link',
        text: 'Home',
        link: externalLink('/'),
      },
      {
        _key: k(),
        _type: 'menuItem',
        type: 'link',
        text: 'Blog',
        link: externalLink('/blog'),
      },
    ],
  },

  // ── Home Page ──────────────────────────────────────────────────────
  {
    _id: 'homePage',
    _type: 'homePage',
    name: 'Home Page',
    pageSections: [
      {
        _key: k(),
        _type: 'hero',
        heading: 'Welcome to ACR',
        text: [block('Discover our latest news, insights, and resources.')],
        buttons: [
          {
            _key: k(),
            _type: 'button',
            text: 'Read the Blog',
            variant: 'default',
            link: externalLink('/blog'),
          },
          {
            _key: k(),
            _type: 'button',
            text: 'Learn More',
            variant: 'outline',
            link: externalLink('#'),
          },
        ],
      },
      {
        _key: k(),
        _type: 'postList',
        heading: 'Latest Posts',
        numberOfPosts: 3,
      },
      {
        _key: k(),
        _type: 'cta',
        heading: 'Stay in the loop',
        text: 'Subscribe to our newsletter for the latest updates.',
        buttons: [
          {
            _key: k(),
            _type: 'button',
            text: 'Subscribe',
            variant: 'default',
            link: externalLink('#'),
          },
        ],
      },
    ],
  },

  // ── Blog Page ──────────────────────────────────────────────────────
  {
    _id: 'blogPage',
    _type: 'blogPage',
    name: 'Blog',
  },

  // ── Categories ────────────────────────────────────────────────────
  {
    _id: CATEGORY_TECH_ID,
    _type: 'category',
    title: 'Technology',
    slug: { _type: 'slug', current: 'technology' },
    description: 'Articles about web technology, tools, and engineering.',
  },
  {
    _id: CATEGORY_DESIGN_ID,
    _type: 'category',
    title: 'Design',
    slug: { _type: 'slug', current: 'design' },
    description: 'Articles about UI/UX, design systems, and visual craft.',
  },

  // ── Person ────────────────────────────────────────────────────────
  {
    _id: PERSON_ID,
    _type: 'person',
    firstName: 'Jane',
    lastName: 'Doe',
    slug: { _type: 'slug', current: 'jane-doe' },
    role: 'Editor',
    biography: [
      block('Jane is a writer and developer with a passion for clear communication and modern web technology.'),
    ],
  },

  // ── Posts ─────────────────────────────────────────────────────────
  {
    _id: 'seed-post-getting-started',
    _type: 'post',
    title: 'Getting Started with Next.js and Sanity',
    slug: { _type: 'slug', current: 'getting-started-nextjs-sanity' },
    date: '2025-01-15T10:00:00Z',
    excerpt: 'A walkthrough of setting up a Next.js project with Sanity as the headless CMS, covering routing, data fetching, and live preview.',
    author: { _type: 'reference', _ref: PERSON_ID },
    categories: [{ _type: 'reference', _ref: CATEGORY_TECH_ID }],
    content: [
      block('Introduction', 'h2'),
      block('Next.js and Sanity are a powerful combination for building content-driven websites. Next.js provides the React framework and routing while Sanity handles content management.'),
      block('Setting Up', 'h2'),
      block('Start by creating a new Next.js app with the Sanity Ignite template. This gives you a pre-configured project with schemas for pages, posts, and global settings.'),
      block('Data Fetching', 'h2'),
      block('Use the sanityFetch helper from next-sanity to query your content. It automatically handles caching and live preview mode when the Presentation Tool is active.'),
    ],
  },
  {
    _id: 'seed-post-design-systems',
    _type: 'post',
    title: 'Building a Design System with Tailwind CSS',
    slug: { _type: 'slug', current: 'design-system-tailwind' },
    date: '2025-02-03T10:00:00Z',
    excerpt: 'How to structure a scalable design system using Tailwind CSS v4, shadcn/ui primitives, and class-variance-authority for variant management.',
    author: { _type: 'reference', _ref: PERSON_ID },
    categories: [{ _type: 'reference', _ref: CATEGORY_DESIGN_ID }],
    content: [
      block('Why a Design System?', 'h2'),
      block('A design system creates consistency across your UI and speeds up development by providing a shared vocabulary of components and styles.'),
      block('Tailwind + CVA', 'h2'),
      block('Combining Tailwind CSS with class-variance-authority lets you define component variants cleanly. Each variant maps to a set of utility classes, making it easy to maintain and extend.'),
      block('Component Structure', 'h2'),
      block('Keep pure presentational components in src/components/ui. These should have no side effects and no dependency on Sanity data, making them easy to test and reuse.'),
    ],
  },
  {
    _id: 'seed-post-live-preview',
    _type: 'post',
    title: 'Real-Time Content with Sanity Live Preview',
    slug: { _type: 'slug', current: 'sanity-live-preview' },
    date: '2025-03-10T10:00:00Z',
    excerpt: 'Explore how the Sanity Presentation Tool enables real-time visual editing, and how next-sanity wires up live preview with minimal configuration.',
    author: { _type: 'reference', _ref: PERSON_ID },
    categories: [{ _type: 'reference', _ref: CATEGORY_TECH_ID }],
    content: [
      block('How Live Preview Works', 'h2'),
      block("Sanity's Presentation Tool embeds your frontend in an iframe and overlays click-to-edit controls. Draft changes stream to your app in real time via the Live Content API."),
      block('Configuring SanityLive', 'h2'),
      block('Wrap your root layout with the SanityLive component. It subscribes to content updates and triggers React re-renders automatically — no polling needed.'),
      block('Draft Mode', 'h2'),
      block('Next.js Draft Mode bypasses static generation so editors always see the latest draft. The /api/draft-mode/enable route enables it, and disableDraftMode server action disables it.'),
    ],
  },
];

async function seed() {
  console.log(`Seeding ${documents.length} documents to "${client.config().dataset}"...`);

  const tx = client.transaction();
  for (const doc of documents) {
    tx.createOrReplace(doc);
  }
  await tx.commit();

  console.log('Done. Documents seeded:');
  for (const doc of documents) {
    console.log(`  ${doc._type.padEnd(12)} ${doc._id}`);
  }
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
