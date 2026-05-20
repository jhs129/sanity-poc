import {describe, it, expect} from 'vitest'
import {getType, fieldNames, getField, memberTypes} from './helpers'

describe('richText', () => {
  it('has a body field that embeds block/image/ctaButton/blockQuote', () => {
    const body = getField(getType('richText'), 'body')
    expect(body.type).toBe('array')
    expect(memberTypes(body)).toEqual(['block', 'image', 'ctaButton', 'blockQuote'])
  })
})

describe('columns', () => {
  it('has a columns array field', () => {
    expect(fieldNames(getType('columns'))).toEqual(['columns'])
    expect(getField(getType('columns'), 'columns').type).toBe('array')
  })
})

describe('imageBlock', () => {
  it('has image/alt/caption', () => {
    expect(fieldNames(getType('imageBlock'))).toEqual(['image', 'alt', 'caption'])
  })
})

describe('htmlEmbed', () => {
  it('has a single html field', () => {
    expect(fieldNames(getType('htmlEmbed'))).toEqual(['html'])
  })
})
