import {defineType, defineArrayMember} from 'sanity'

/**
 * Factory for the standard Portable Text block member. A factory (not a shared
 * constant) so each consumer array gets its own object instance.
 */
export const portableTextBlock = () =>
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Heading 1', value: 'h1'},
      {title: 'Heading 2', value: 'h2'},
      {title: 'Heading 3', value: 'h3'},
      {title: 'Heading 4', value: 'h4'},
      {title: 'Quote', value: 'blockquote'},
    ],
    lists: [
      {title: 'Bullet', value: 'bullet'},
      {title: 'Numbered', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {name: 'href', type: 'string', title: 'URL'},
            {name: 'blank', type: 'boolean', title: 'Open in new tab'},
          ],
        },
      ],
    },
  })

/** Shared Portable Text array type: block text + inline images. */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [portableTextBlock(), defineArrayMember({type: 'image', options: {hotspot: true}})],
})
