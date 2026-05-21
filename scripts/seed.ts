import { createClient, type SanityClient } from '@sanity/client';

const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-08-22', // update to use a recent date string UTC
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

function externalLink(href: string, openInNewTab = false) {
  return { _type: 'link', type: 'external', external: href, href, openInNewTab };
}

function button(text: string, href: string, variant = 'default') {
  return { _key: k(), _type: 'button', text, variant, link: externalLink(href) };
}

// ─── Reference IDs ────────────────────────────────────────────────────────────
// These are fixed so they can be referenced across documents.
const CATEGORY_TECH_ID = 'seed-category-technology';
const CATEGORY_DESIGN_ID = 'seed-category-design';
const PERSON_ID = 'seed-person-jane-doe';

const documents: Array<{ _id: string; _type: string } & Record<string, unknown>> = [

  // ── Site Settings ────────────────────────────────────────────────────────────
  {
    _id: 'siteSettings',
    _type: 'settings',
    title: 'ACR',
    menu: [
      { _key: k(), _type: 'menuItem', type: 'link', text: 'Home',    link: externalLink('/') },
      { _key: k(), _type: 'menuItem', type: 'link', text: 'About',   link: externalLink('/about') },
      { _key: k(), _type: 'menuItem', type: 'link', text: 'Blog',    link: externalLink('/blog') },
      { _key: k(), _type: 'menuItem', type: 'link', text: 'Contact', link: externalLink('/contact') },
    ],
  },

  // ── Home Page (singleton) ────────────────────────────────────────────────────
  {
    _id: 'homePage',
    _type: 'homePage',
    name: 'Home Page',
    pageSections: [
      {
        _key: k(), _type: 'hero',
        heading: 'Welcome to ACR',
        text: [block('Discover our latest news, insights, and resources.')],
        buttons: [
          button('Read the Blog', '/blog'),
          button('Learn More', '/about', 'outline'),
        ],
      },
      {
        _key: k(), _type: 'postList',
        heading: 'Latest Posts',
        numberOfPosts: 3,
      },
      {
        _key: k(), _type: 'cta',
        heading: 'Stay in the loop',
        text: 'Subscribe to our newsletter for the latest updates.',
        buttons: [button('Subscribe', '#')],
      },
    ],
  },

  // ── Blog Page (singleton) ────────────────────────────────────────────────────
  {
    _id: 'blogPage',
    _type: 'blogPage',
    name: 'Blog',
  },

  // ── About Page ───────────────────────────────────────────────────────────────
  {
    _id: 'seed-page-about',
    _type: 'page',
    name: 'About',
    slug: { _type: 'slug', current: 'about' },
    pageSections: [
      {
        _key: k(), _type: 'hero',
        heading: 'About ACR',
        text: [block('We are a team of builders, strategists, and creatives dedicated to delivering work that moves the needle. ACR is where thoughtful process meets bold execution.')],
        buttons: [
          button('See Our Work', '/blog'),
          button('Get in Touch', '/contact', 'outline'),
        ],
      },
      {
        _key: k(), _type: 'mediaText',
        heading: 'What We Do',
        imagePosition: 'right',
        content: [
          block('From strategy to execution, we partner with organizations to solve real problems. Our work spans brand identity, digital products, content strategy, and growth — always grounded in research and shaped by the people we serve.'),
          block('We believe the best outcomes happen when clients and collaborators are treated as partners, not just stakeholders. Transparency, craft, and accountability guide everything we do.'),
        ],
      },
      {
        _key: k(), _type: 'cta',
        heading: 'Ready to Work Together?',
        text: 'Whether you have a fully formed brief or just a problem worth solving, we would love to hear from you.',
        buttons: [button('Start a Conversation', '/contact')],
      },
    ],
  },

  // ── Contact Page ─────────────────────────────────────────────────────────────
  {
    _id: 'seed-page-contact',
    _type: 'page',
    name: 'Contact',
    slug: { _type: 'slug', current: 'contact' },
    pageSections: [
      {
        _key: k(), _type: 'hero',
        heading: 'Get in Touch',
        text: [block('Have a project in mind? A question? Or just want to say hello? We are easy to reach and quick to respond.')],
      },
      {
        _key: k(), _type: 'cta',
        heading: "Let's Talk",
        text: "Drop us a line and we'll get back to you within one business day. We work with clients at every stage — from early-stage ideas to full-scale production.",
        buttons: [
          button('Send an Email', 'mailto:hello@acr.com'),
          button('Read Our Work', '/blog', 'outline'),
        ],
      },
    ],
  },

  // ── Categories ───────────────────────────────────────────────────────────────
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

  // ── Author ───────────────────────────────────────────────────────────────────
  {
    _id: PERSON_ID,
    _type: 'person',
    firstName: 'Jane',
    lastName: 'Doe',
    slug: { _type: 'slug', current: 'jane-doe' },
    role: 'Editor',
    biography: [block('Jane is a writer and developer with a passion for clear communication and modern web technology.')],
  },

  // ── Posts ────────────────────────────────────────────────────────────────────
  {
    _id: 'seed-post-getting-started',
    _type: 'post',
    title: 'Getting Started with Next.js and Sanity',
    slug: { _type: 'slug', current: 'getting-started-nextjs-sanity' },
    date: '2025-01-15T10:00:00Z',
    excerpt: 'A walkthrough of setting up a Next.js project with Sanity as the headless CMS, covering routing, data fetching, and live preview.',
    author: { _type: 'reference', _ref: PERSON_ID },
    categories: [{ _key: k(), _type: 'reference', _ref: CATEGORY_TECH_ID }],
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
    categories: [{ _key: k(), _type: 'reference', _ref: CATEGORY_DESIGN_ID }],
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
    excerpt: "Explore how the Sanity Presentation Tool enables real-time visual editing, and how next-sanity wires up live preview with minimal configuration.",
    author: { _type: 'reference', _ref: PERSON_ID },
    categories: [{ _key: k(), _type: 'reference', _ref: CATEGORY_TECH_ID }],
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
