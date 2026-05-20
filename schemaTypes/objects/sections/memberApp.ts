import {defineType, defineField} from 'sanity'

export const memberApp = defineType({
  name: 'memberApp',
  title: 'Member Application Form',
  type: 'object',
  fields: [
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      readOnly: true,
      initialValue: 'Renders the membership application form. No configuration needed.',
    }),
  ],
  preview: {prepare: () => ({title: 'Member Application Form'})},
})
