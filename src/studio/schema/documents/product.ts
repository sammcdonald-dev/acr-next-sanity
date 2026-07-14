import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      description:
        'Find this in Stripe Dashboard → Products → select product → copy the Price ID (starts with price_)',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (value && !value.startsWith('price_')) {
            return 'Must be a Stripe Price ID starting with price_';
          }
          return true;
        }),
    }),
    defineField({
      name: 'stripeMode',
      title: 'Checkout Mode',
      type: 'string',
      options: {
        list: [
          { title: 'One-time payment', value: 'payment' },
          { title: 'Subscription', value: 'subscription' },
        ],
        layout: 'radio',
      },
      initialValue: 'payment',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'termStartDate',
      title: 'Term Start Date',
      type: 'date',
      description:
        'Informational — shown to families. E.g. the first day of the Fall or Spring semester.',
      hidden: ({ parent }) => parent?.stripeMode !== 'subscription',
    }),
    defineField({
      name: 'termEndDate',
      title: 'Term End Date (billing stops after this date)',
      type: 'date',
      description:
        'Monthly billing automatically cancels after this date — e.g. the last day of the Fall or Spring semester.',
      hidden: ({ parent }) => parent?.stripeMode !== 'subscription',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as
            | { stripeMode?: string; termStartDate?: string }
            | undefined;
          if (parent?.stripeMode !== 'subscription') return true;
          if (!value) return 'Required for subscription programs';
          if (parent.termStartDate && value < parent.termStartDate) {
            return 'Term end date must be on or after the term start date';
          }
          return true;
        }),
    }),
    defineField({
      name: 'maxSpots',
      title: 'Max Spots',
      type: 'number',
      description:
        'Leave blank for unlimited. When set, registrations are capped at this number.',
      validation: (Rule) => Rule.min(1).integer(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'stripePriceId',
      media: 'image',
    },
  },
});
