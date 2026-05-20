import {defineType, defineField} from 'sanity'

export const blockQuote = defineType({
  name: 'blockQuote',
  title: 'Block Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({name: 'attribution', title: 'Attribution', type: 'string'}),
  ],
  preview: {select: {title: 'quote', subtitle: 'attribution'}},
})
