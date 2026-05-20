import {describe, it, expect} from 'vitest'
import {schemaTypes} from '../index'

describe('schema registry', () => {
  it('exports an array', () => {
    expect(Array.isArray(schemaTypes)).toBe(true)
  })

  it('every registered type has a unique name', () => {
    const names = (schemaTypes as Array<{name: string}>).map((t) => t.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
