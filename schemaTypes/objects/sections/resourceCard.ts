import {defineType, defineField} from 'sanity'

export const resourceCard = defineType({
  name: 'resourceCard',
  title: 'Resource Card',
  type: 'object',
  fields: [
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
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'label'}},
})
