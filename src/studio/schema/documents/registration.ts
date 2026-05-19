import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'registration',
  title: 'Registrations',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'studentFirstName',
      title: 'Student First Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'studentLastName',
      title: 'Student Last Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'studentEmail',
      title: 'Student Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'studentPhone',
      title: 'Student Phone',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'studentAge',
      title: 'Student Age',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'parentFirstName',
      title: 'Parent / Guardian First Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'parentLastName',
      title: 'Parent / Guardian Last Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'parentEmail',
      title: 'Parent / Guardian Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'parentPhone',
      title: 'Parent / Guardian Phone',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending payment', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      first: 'studentFirstName',
      last: 'studentLastName',
      product: 'product.name',
      status: 'status',
    },
    prepare({ first, last, product, status }) {
      const statusEmoji = status === 'confirmed' ? '✓' : status === 'cancelled' ? '✗' : '…';
      return {
        title: `${first ?? ''} ${last ?? ''}`.trim() || 'Unknown',
        subtitle: `${product ?? 'No product'} — ${statusEmoji} ${status}`,
        media: UsersIcon,
      };
    },
  },
});
