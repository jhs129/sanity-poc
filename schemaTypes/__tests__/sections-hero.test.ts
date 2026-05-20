import {describe, it, expect} from 'vitest'
import {getType, fieldNames, getField} from './helpers'

describe('cta', () => {
  it('has the full CTA field set', () => {
    expect(fieldNames(getType('cta'))).toEqual([
      'theme',
      'title',
      'description',
      'statNumber',
      'statDescription',
      'buttonText',
      'buttonUrl',
      'image',
    ])
  })
})

describe('eventCardVertical', () => {
  it('has the event card field set', () => {
    expect(fieldNames(getType('eventCardVertical'))).toEqual([
      'eventType',
      'title',
      'dateTime',
      'location',
      'image',
      'imageAlt',
      'href',
    ])
  })
})

describe('heroCancerCare', () => {
  it('has tagline/title/searchTitle/heroImage/heroImageAlt', () => {
    expect(fieldNames(getType('heroCancerCare'))).toEqual([
      'tagline',
      'title',
      'searchTitle',
      'heroImage',
      'heroImageAlt',
    ])
  })

  it('heroImage is an image field', () => {
    expect(getField(getType('heroCancerCare'), 'heroImage').type).toBe('image')
  })
})
