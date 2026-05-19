import { CreditCardIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'registrationCta',
  type: 'object',
  icon: CreditCardIcon,
  title: 'Registration CTA',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{ type: 'button' }],
      description: 'Link to the registration page, e.g. /register or /register?product=<id>.',
    }),
    defineField({
      name: 'note',
      title: 'Fine Print / Note',
      type: 'string',
      description: 'Optional small text below buttons, e.g. "Limited spots available".',
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Optional. When set, remaining spots are displayed on this section.',
    }),
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #register)',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
    },
    prepare({ heading, eyebrow }) {
      return {
        title: heading || 'Unnamed Registration CTA',
        subtitle: eyebrow,
        media: CreditCardIcon,
      };
    },
  },
});
