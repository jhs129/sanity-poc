import {defineType, defineField} from 'sanity'

export const eventCardVertical = defineType({
  name: 'eventCardVertical',
  title: 'Event Card (Vertical)',
  type: 'object',
  fields: [
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'dateTime',
      title: 'Date / Time',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Image Alt Text', type: 'string'}),
    defineField({name: 'href', title: 'Href', type: 'string', validation: (r) => r.required()}),
  ],
  preview: {select: {title: 'title', subtitle: 'eventType', media: 'image'}},
})
