import {defineType, defineField} from 'sanity'

/**
 * Placeholder for Builder's `ProductCard` (registered cloud-side, no source
 * component in the gacore repo). Preserves the imported data so nothing is lost;
 * a real ProductCard type + React component is a follow-up.
 */
export const productCardPlaceholder = defineType({
  name: 'productCardPlaceholder',
  title: 'Product Card (pending implementation)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'handle', title: 'Handle', type: 'string'}),
    defineField({name: 'price', title: 'Price', type: 'string'}),
    defineField({name: 'theme', title: 'Theme', type: 'string'}),
    defineField({name: 'alignment', title: 'Alignment', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: `ProductCard — ${title || 'untitled'}`,
      subtitle: 'Pending implementation',
    }),
  },
})
