import {defineType, defineField} from 'sanity'
import {metadataFields} from './metadataFields'

/**
 * Mirrors the Builder.io "page" model (kind: page).
 *
 * The SEO fields (description, keywords, shareImage) are spread in from
 * metadataFields.ts. `headerNavigation1`, `headerNavigation2` and `footerNavigation`
 * are references to the "navigation" document — see navigation.ts.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'SEO page title',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      initialValue: 'light',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Gradient', value: 'gradient'},
          {title: 'Transparent Light', value: 'transparent-light'},
          {title: 'Transparent Dark', value: 'transparent-dark'},
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    ...metadataFields,
    defineField({
      name: 'headerNavigation1',
      title: 'Primary Header Navigation',
      type: 'reference',
      to: [{type: 'navigation'}],
    }),
    defineField({
      name: 'headerNavigation2',
      title: 'Header Navigation 2',
      type: 'reference',
      to: [{type: 'navigation'}],
    }),
    defineField({
      name: 'footerNavigation',
      title: 'Footer Navigation',
      type: 'reference',
      to: [{type: 'navigation'}],
    }),
  ],
})
