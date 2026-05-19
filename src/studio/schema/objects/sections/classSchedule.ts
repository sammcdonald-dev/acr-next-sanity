import { CalendarIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'classSchedule',
  type: 'object',
  icon: CalendarIcon,
  title: 'Class Schedule',
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
      name: 'classes',
      title: 'Classes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'classItem',
          title: 'Class',
          fields: [
            defineField({ name: 'title', title: 'Class Name', type: 'string' }),
            defineField({ name: 'ageGroup', title: 'Age Group', type: 'string', description: 'e.g. Ages 8–12' }),
            defineField({ name: 'day', title: 'Day', type: 'string', description: 'e.g. Mondays' }),
            defineField({ name: 'time', title: 'Time', type: 'string', description: 'e.g. 4:00–5:30 PM' }),
            defineField({ name: 'rate', title: 'Rate', type: 'string', description: 'e.g. $150/month' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'ageGroup' },
          },
        }),
      ],
    }),
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #class-schedule)',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
    },
    prepare({ heading, eyebrow }) {
      return {
        title: heading || 'Unnamed Class Schedule',
        subtitle: eyebrow,
        media: CalendarIcon,
      };
    },
  },
});
