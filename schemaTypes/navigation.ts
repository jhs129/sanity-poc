import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Mirrors the Builder.io "navigation" model (kind: data).
 *
 * Builder's model defines a single `level1` list, where each item may contain a
 * nested `level2` list. A `title` field is added here (not present on the Builder
 * model) so editors can tell navigation entries apart — it stands in for the
 * Builder entry name and is used as the document preview title.
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name for this navigation (e.g. "Primary Header", "Footer")',
    }),
    defineField({
      name: 'level1',
      title: 'Level 1',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'level1Item',
          title: 'Level 1 Item',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({name: 'href', title: 'Href', type: 'string'}),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'level2',
              title: 'Level 2',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'level2Item',
                  title: 'Level 2 Item',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({name: 'href', title: 'Href', type: 'string'}),
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: {hotspot: true},
                    }),
                  ],
                  preview: {
                    select: {title: 'text', subtitle: 'href', media: 'image'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'text', subtitle: 'href', media: 'image'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', level1: 'level1'},
    prepare({title, level1}) {
      const count = Array.isArray(level1) ? level1.length : 0
      return {
        title: title || 'Navigation',
        subtitle: `${count} top-level item${count === 1 ? '' : 's'}`,
      }
    },
  },
})
