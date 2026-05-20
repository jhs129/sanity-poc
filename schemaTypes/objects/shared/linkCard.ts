import {defineType, defineField} from 'sanity'

/** Reusable label/title/description/link card. `title` is optional. */
export const linkCard = defineType({
  name: 'linkCard',
  title: 'Link Card',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'linkText', title: 'Link Text', type: 'string'}),
    defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'label'}},
})
