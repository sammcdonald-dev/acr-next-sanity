import { EnvelopeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactForm',
  type: 'object',
  icon: EnvelopeIcon,
  title: 'Contact Form',
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
      name: 'submitButtonLabel',
      title: 'Submit Button Label',
      type: 'string',
      initialValue: 'Send Message',
    }),
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #contact)',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled Contact Form',
        media: EnvelopeIcon,
      };
    },
  },
});
