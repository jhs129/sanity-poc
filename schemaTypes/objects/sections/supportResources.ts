import {defineType, defineField, defineArrayMember} from 'sanity'

export const supportResources = defineType({
  name: 'supportResources',
  title: 'Support Resources',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
    defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'supportCard',
          fields: [
            defineField({
              name: 'iconType',
              title: 'Icon Type',
              type: 'string',
              initialValue: 'financial',
              options: {
                list: [
                  {title: 'Financial', value: 'financial'},
                  {title: 'Emotional', value: 'emotional'},
                  {title: 'Practical', value: 'practical'},
                ],
              },
            }),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'portableText'}),
            defineField({name: 'linkText', title: 'Link Text', type: 'string'}),
            defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'iconType'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'backgroundImage'},
    prepare: ({title, media}) => ({title: title || 'Support Resources', media}),
  },
})
