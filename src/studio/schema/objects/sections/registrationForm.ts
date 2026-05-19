import { ClipboardIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'registrationForm',
  type: 'object',
  icon: ClipboardIcon,
  title: 'Registration Form',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Intro text',
      type: 'blockContent',
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Submit button label',
      type: 'string',
      placeholder: 'Continue to Payment',
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Leave empty to show all available products in the dropdown.',
    }),
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #register)',
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return {
        title: heading || 'Registration Form',
        media: ClipboardIcon,
      };
    },
  },
});
