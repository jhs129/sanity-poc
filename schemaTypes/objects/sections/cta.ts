import {defineType, defineField} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
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
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'statNumber', title: 'Stat Number', type: 'string'}),
    defineField({name: 'statDescription', title: 'Stat Description', type: 'string'}),
    defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
    defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
})
