import {defineType, defineField} from 'sanity'

export const module6 = defineType({
  name: 'module6',
  title: 'Module6 — Knowledge & Action',
  type: 'object',
  fields: [
    defineField({name: 'mainHeading', title: 'Main Heading', type: 'string'}),
    defineField({
      name: 'advocateSection',
      title: 'Advocate Section',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'statNumber', title: 'Stat Number', type: 'string'}),
        defineField({name: 'statDescription', title: 'Stat Description', type: 'string'}),
        defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
        defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
      ],
    }),
    defineField({name: 'learnCard', title: 'Learn Card', type: 'linkCard'}),
    defineField({name: 'engageCard', title: 'Engage Card', type: 'linkCard'}),
    defineField({
      name: 'careSection',
      title: 'Care Section',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'caregiverCard', title: 'Caregiver Card', type: 'linkCard'}),
        defineField({name: 'providerCard', title: 'Provider Card', type: 'linkCard'}),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'object',
      fields: [
        defineField({
          name: 'advocateImage',
          title: 'Advocate Image',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({name: 'arrowIcon', title: 'Arrow Icon', type: 'image'}),
        defineField({
          name: 'decorativeImage',
          title: 'Decorative Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'mainHeading'},
    prepare: ({title}) => ({title: title || 'Module6'}),
  },
})
