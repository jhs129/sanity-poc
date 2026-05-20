import {defineType, defineField, defineArrayMember} from 'sanity'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      initialValue: 'primaryLight',
      options: {
        list: [
          {title: 'Primary Light', value: 'primaryLight'},
          {title: 'Secondary Light', value: 'secondaryLight'},
          {title: 'Secondary Accent', value: 'secondaryAccent'},
        ],
      },
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: 'bg-red-50',
      options: {
        list: [
          {title: 'Light Red', value: 'bg-red-50'},
          {title: 'Light Green', value: 'bg-green-50'},
          {title: 'Light Blue', value: 'bg-blue-50'},
          {title: 'Light Yellow', value: 'bg-yellow-50'},
          {title: 'White', value: 'bg-white'},
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4}),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'FAQ Section'}),
  },
})
