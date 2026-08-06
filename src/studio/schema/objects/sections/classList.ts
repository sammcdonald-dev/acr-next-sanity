import { CalendarIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'classList',
  type: 'object',
  icon: CalendarIcon,
  title: 'Class List',
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
      name: 'classes',
      title: 'Classes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'classListItem',
          title: 'Class',
          fields: [
            defineField({ name: 'title', title: 'Class Name', type: 'string' }),
            defineField({
              name: 'ageGroup',
              title: 'Age Group',
              type: 'string',
              description: 'e.g. Ages 8–12',
            }),
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              description: 'e.g. Mondays',
            }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              description: 'e.g. 4:00–5:30 PM',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'ageGroup' },
          },
        }),
      ],
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
    },
    prepare({ heading, eyebrow }) {
      return {
        title: heading || 'Untitled Class List',
        subtitle: eyebrow,
        media: CalendarIcon,
      };
    },
  },
});
