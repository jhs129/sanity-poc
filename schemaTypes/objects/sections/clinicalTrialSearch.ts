import {defineType, defineField, defineArrayMember} from 'sanity'

export const clinicalTrialSearch = defineType({
  name: 'clinicalTrialSearch',
  title: 'Clinical Trial Search',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'mainTitle', title: 'Main Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'searchPlaceholder', title: 'Search Placeholder', type: 'string'}),
    defineField({name: 'searchButtonTitle', title: 'Search Button Title', type: 'string'}),
    defineField({
      name: 'clearSearchButtonTitle',
      title: 'Clear Search Button Title',
      type: 'string',
    }),
    defineField({
      name: 'refinementSections',
      title: 'Refinement Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'refinementSection',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'attribute', title: 'Attribute', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'attribute'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'mainTitle'},
    prepare: ({title}) => ({title: title || 'Clinical Trial Search'}),
  },
})
