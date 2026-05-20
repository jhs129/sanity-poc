import {defineType, defineField} from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'Href', type: 'string'}),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      initialValue: 'filled-green',
      options: {
        list: [
          {title: 'Filled Green', value: 'filled-green'},
          {title: 'Outlined Green', value: 'outlined-green'},
          {title: 'Outlined White', value: 'outlined-white'},
          {title: 'Link Underlined', value: 'link-underlined'},
        ],
      },
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Medium', value: 'md'},
          {title: 'Small', value: 'sm'},
        ],
      },
    }),
    defineField({
      name: 'external',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})
