import {defineType, defineField, defineArrayMember} from 'sanity'

export const mod2 = defineType({
  name: 'mod2',
  title: 'Mod2 — Journey Guide',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mod2Tab',
          fields: [
            defineField({name: 'id', title: 'ID', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({
              name: 'isActive',
              title: 'Active by default',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mod2Card',
          fields: [
            defineField({name: 'icon', title: 'Icon', type: 'image'}),
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
          ],
          preview: {select: {title: 'text', media: 'icon'}},
        }),
      ],
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Image Alt Text', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Mod2', media}),
  },
})
