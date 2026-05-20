import {defineType, defineField, defineArrayMember} from 'sanity'

export const columns = defineType({
  name: 'columns',
  title: 'Columns',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          fields: [
            defineField({
              name: 'width',
              title: 'Width',
              type: 'string',
              initialValue: 'full',
              options: {
                list: [
                  {title: 'Full', value: 'full'},
                  {title: 'Half', value: 'half'},
                  {title: 'Third', value: 'third'},
                  {title: 'Quarter', value: 'quarter'},
                ],
              },
            }),
            defineField({name: 'content', title: 'Content', type: 'portableText'}),
          ],
          preview: {
            select: {width: 'width'},
            prepare: ({width}) => ({title: `Column (${width || 'full'})`}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Columns'})},
})
