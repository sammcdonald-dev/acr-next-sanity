import { UsersIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'team',
  type: 'object',
  icon: UsersIcon,
  title: 'Team',
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
      name: 'intro',
      title: 'Intro',
      type: 'blockContent',
    }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
    }),
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #team)',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
    },
    prepare({ heading, eyebrow }) {
      return {
        title: heading || 'Untitled Team',
        subtitle: eyebrow,
        media: UsersIcon,
      };
    },
  },
});
