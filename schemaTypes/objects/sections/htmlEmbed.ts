import {defineType, defineField} from 'sanity'

export const htmlEmbed = defineType({
  name: 'htmlEmbed',
  title: 'HTML Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'html',
      title: 'HTML',
      type: 'text',
      rows: 8,
      validation: (r) => r.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'HTML Embed'})},
})
