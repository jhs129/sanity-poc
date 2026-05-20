import {describe, it, expect} from 'vitest'
import {getType, fieldNames, memberTypes} from './helpers'

describe('portableText', () => {
  it('is a registered array type of block + image', () => {
    const t = getType('portableText')
    expect(t.type).toBe('array')
    expect(memberTypes(t)).toEqual(['block', 'image'])
  })
})

describe('linkCard', () => {
  it('is an object with label/title/description/linkText/linkUrl', () => {
    const t = getType('linkCard')
    expect(t.type).toBe('object')
    expect(fieldNames(t)).toEqual(['label', 'title', 'description', 'linkText', 'linkUrl'])
  })
})
