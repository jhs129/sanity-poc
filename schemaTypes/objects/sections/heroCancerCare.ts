import {defineType, defineField} from 'sanity'

export const heroCancerCare = defineType({
  name: 'heroCancerCare',
  title: 'Hero — Cancer Care',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'searchTitle', title: 'Search Title', type: 'string'}),
    defineField({name: 'heroImage', title: 'Hero Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroImageAlt', title: 'Hero Image Alt Text', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline', media: 'heroImage'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Hero — Cancer Care',
      subtitle,
      media,
    }),
  },
})
