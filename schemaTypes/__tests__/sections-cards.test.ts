import {describe, it, expect} from 'vitest'
import {getType, fieldNames} from './helpers'

describe('ctaButton', () => {
  it('has label/href/variant/size/external', () => {
    const t = getType('ctaButton')
    expect(t.type).toBe('object')
    expect(fieldNames(t)).toEqual(['label', 'href', 'variant', 'size', 'external'])
  })
})

describe('blockQuote', () => {
  it('has quote/attribution', () => {
    expect(fieldNames(getType('blockQuote'))).toEqual(['quote', 'attribution'])
  })
})

describe('resourceCard', () => {
  it('has theme/label/title/description/linkText/linkUrl', () => {
    expect(fieldNames(getType('resourceCard'))).toEqual([
      'theme',
      'label',
      'title',
      'description',
      'linkText',
      'linkUrl',
    ])
  })
})
