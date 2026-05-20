import {defineType, defineField} from 'sanity'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'alt', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Image', media}),
  },
})
