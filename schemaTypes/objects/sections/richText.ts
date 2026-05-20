import {defineType, defineField, defineArrayMember} from 'sanity'
import {portableTextBlock} from '../shared/portableText'

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        portableTextBlock(),
        defineArrayMember({type: 'image', options: {hotspot: true}}),
        defineArrayMember({type: 'ctaButton'}),
        defineArrayMember({type: 'blockQuote'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Rich Text'})},
})
