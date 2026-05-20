import {defineType, defineField, defineArrayMember} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'URL Path',
      type: 'slug',
      description: 'The page path, e.g. / or /campaign',
      validation: (r) => r.required(),
      options: {
        source: 'title',
        slugify: (input: string) =>
          '/' +
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9/-]/g, ''),
      },
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO meta description',
    }),
    defineField({
      name: 'shareImage',
      title: 'Share Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Image used when the page is shared on social networks',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroCancerCare'}),
        defineArrayMember({type: 'mod2'}),
        defineArrayMember({type: 'supportResources'}),
        defineArrayMember({type: 'module6'}),
        defineArrayMember({type: 'faqSection'}),
        defineArrayMember({type: 'blockQuote'}),
        defineArrayMember({type: 'cta'}),
        defineArrayMember({type: 'ctaButton'}),
        defineArrayMember({type: 'resourceCard'}),
        defineArrayMember({type: 'eventCardVertical'}),
        defineArrayMember({type: 'clinicalTrialSearch'}),
        defineArrayMember({type: 'memberApp'}),
        defineArrayMember({type: 'productCardPlaceholder'}),
        defineArrayMember({type: 'richText'}),
        defineArrayMember({type: 'columns'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'htmlEmbed'}),
      ],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
