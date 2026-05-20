import {describe, it, expect} from 'vitest'
import {getType, fieldNames} from './helpers'

describe('clinicalTrialSearch', () => {
  it('has the search config field set', () => {
    expect(fieldNames(getType('clinicalTrialSearch'))).toEqual([
      'backgroundImage',
      'mainTitle',
      'subtitle',
      'searchPlaceholder',
      'searchButtonTitle',
      'clearSearchButtonTitle',
      'refinementSections',
    ])
  })
})

describe('memberApp', () => {
  it('is a registered object type', () => {
    expect(getType('memberApp').type).toBe('object')
  })
})

describe('productCardPlaceholder', () => {
  it('preserves the imported ProductCard fields', () => {
    expect(fieldNames(getType('productCardPlaceholder'))).toEqual([
      'title',
      'eyebrow',
      'handle',
      'price',
      'theme',
      'alignment',
    ])
  })
})
