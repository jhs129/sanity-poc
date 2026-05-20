import {defineField, defineArrayMember} from 'sanity'

/**
 * Reusable field definitions mirroring the Builder.io "metadata" model.
 *
 * Spread into a document's `fields` array with `...metadataFields` (see page.ts).
 * The fields live at the top level of whatever document spreads them — there is no
 * wrapping object and nothing is managed as a separate document.
 *
 * Builder's `people` field (a list of references to a "person" model) is omitted —
 * add a "person" schema type first to map it.
 */
export const metadataFields = [
  defineField({
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'keywords',
    title: 'Keywords',
    type: 'array',
    of: [defineArrayMember({type: 'string'})],
    options: {layout: 'tags'},
  }),
  defineField({
    name: 'shareImage',
    title: 'Share Image',
    description: 'Image used for sharing on social networks and search',
    type: 'image',
    options: {hotspot: true},
  }),
]
