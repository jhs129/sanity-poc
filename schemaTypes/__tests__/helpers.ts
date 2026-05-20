import {schemaTypes} from '../index'

/** Returns the registered schema type with the given name, or throws. */
export function getType(name: string): any {
  const type = (schemaTypes as any[]).find((t) => t.name === name)
  if (!type) throw new Error(`Schema type "${name}" is not registered in schemaTypes`)
  return type
}

/** Field names of an object/document type, in declared order. */
export function fieldNames(typeDef: any): string[] {
  return (typeDef.fields ?? []).map((f: any) => f.name as string)
}

/** A single named field of an object/document type, or throws. */
export function getField(typeDef: any, name: string): any {
  const field = (typeDef.fields ?? []).find((f: any) => f.name === name)
  if (!field) throw new Error(`Field "${name}" not found on type "${typeDef.name}"`)
  return field
}

/** The `type` of each member in an array type or array field, in declared order. */
export function memberTypes(arrayDef: any): string[] {
  return (arrayDef.of ?? []).map((m: any) => m.type as string)
}

