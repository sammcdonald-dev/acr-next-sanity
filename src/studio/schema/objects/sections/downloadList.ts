import { DownloadIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'downloadList',
  type: 'object',
  icon: DownloadIcon,
  title: 'Download List',
  fields: [
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
      name: 'files',
      title: 'Files',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'downloadItem',
          title: 'File',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              options: { accept: '.pdf,.doc,.docx' },
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
    }),
    defineField({
      name: 'uid',
      title: 'Anchor ID',
      type: 'slug',
      description: 'Used for in-page anchor links (e.g. #forms)',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled Download List',
        media: DownloadIcon,
      };
    },
  },
});
