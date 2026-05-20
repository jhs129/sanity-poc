import {describe, it, expect} from 'vitest'
import {getType, fieldNames, getField, memberTypes} from './helpers'

describe('faqSection', () => {
  it('has title/theme/backgroundColor/items', () => {
    expect(fieldNames(getType('faqSection'))).toEqual([
      'title',
      'theme',
      'backgroundColor',
      'items',
    ])
  })

  it('items is an array of faqItem objects', () => {
    expect(memberTypes(getField(getType('faqSection'), 'items'))).toEqual(['object'])
  })
})

describe('mod2', () => {
  it('has heading/tabs/cards/image/imageAlt', () => {
    expect(fieldNames(getType('mod2'))).toEqual(['heading', 'tabs', 'cards', 'image', 'imageAlt'])
  })
})
