import {describe, it, expect} from 'vitest'
import {getType, fieldNames, getField, memberTypes} from './helpers'

describe('page document', () => {
  it('is a registered document type', () => {
    expect(getType('page').type).toBe('document')
  })

  it('has title/slug/description/shareImage/pageBuilder', () => {
    expect(fieldNames(getType('page'))).toEqual([
      'title',
      'slug',
      'description',
      'shareImage',
      'pageBuilder',
    ])
  })

  it('pageBuilder accepts all 17 section types', () => {
    const pageBuilder = getField(getType('page'), 'pageBuilder')
    expect(pageBuilder.type).toBe('array')
    expect(memberTypes(pageBuilder).sort()).toEqual(
      [
        'blockQuote',
        'clinicalTrialSearch',
        'columns',
        'cta',
        'ctaButton',
        'eventCardVertical',
        'faqSection',
        'heroCancerCare',
        'htmlEmbed',
        'imageBlock',
        'memberApp',
        'mod2',
        'module6',
        'productCardPlaceholder',
        'resourceCard',
        'richText',
        'supportResources',
      ].sort(),
    )
  })
})
