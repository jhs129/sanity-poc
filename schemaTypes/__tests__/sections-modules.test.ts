import {describe, it, expect} from 'vitest'
import {getType, fieldNames, getField} from './helpers'

describe('supportResources', () => {
  it('has backgroundImage/heading/buttonText/buttonUrl/cards', () => {
    expect(fieldNames(getType('supportResources'))).toEqual([
      'backgroundImage',
      'heading',
      'buttonText',
      'buttonUrl',
      'cards',
    ])
  })
})

describe('module6', () => {
  it('has the module6 field set', () => {
    expect(fieldNames(getType('module6'))).toEqual([
      'mainHeading',
      'advocateSection',
      'learnCard',
      'engageCard',
      'careSection',
      'images',
    ])
  })

  it('learnCard and engageCard reuse the linkCard type', () => {
    const t = getType('module6')
    expect(getField(t, 'learnCard').type).toBe('linkCard')
    expect(getField(t, 'engageCard').type).toBe('linkCard')
  })
})
