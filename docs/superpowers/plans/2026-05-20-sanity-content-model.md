# Sanity Content Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Sanity schema (a `page` document + 17 section types + 2 shared objects) that represents the Builder.io `gacore` site as an idiomatic Sanity page builder.

**Architecture:** A single `page` document holds a flat `pageBuilder` array of typed section objects. 13 section types mirror registered Builder components field-for-field; 4 cover Builder's freeform layout primitives (rich text, columns, image, HTML embed). Two shared objects (`portableText`, `linkCard`) are reused across sections. Development is test-driven: a vitest suite introspects the exported `schemaTypes` array to assert every type is registered with the expected fields.

**Tech Stack:** Sanity v5, TypeScript (strict), vitest, pnpm.

**Reference spec:** `docs/superpowers/specs/2026-05-20-sanity-content-model-design.md`

**Conventions:**
- Package manager is **pnpm**. Prettier config (in `package.json`): no semicolons, single quotes, 100 print width, `bracketSpacing: false`.
- Every commit message ends with the trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` (shown via a second `-m` flag below).
- Work happens on the existing branch `migrate/builder-to-sanity-content-model`.

---

## File Structure

Created in this plan:

| File | Responsibility |
|---|---|
| `vitest.config.ts` | vitest configuration (node env, test glob) |
| `schemaTypes/__tests__/helpers.ts` | Schema introspection helpers used by all tests |
| `schemaTypes/__tests__/*.test.ts` | One test file per task verifying registered types/fields |
| `schemaTypes/objects/shared/portableText.ts` | Shared Portable Text array type + block factory |
| `schemaTypes/objects/shared/linkCard.ts` | Shared `linkCard` object type |
| `schemaTypes/objects/sections/*.ts` | 17 section object types |
| `schemaTypes/documents/page.ts` | The `page` document type |
| `schemaTypes/index.ts` | Rewritten — imports and exports the `schemaTypes` array |

Removed in this plan: `schemaTypes/page.ts` (old), `schemaTypes/navigation.ts`, `schemaTypes/metadataFields.ts`.

Each section file owns exactly one type. `index.ts` is the single registration point consumed by `sanity.config.ts`.

---

## Task 1: Test harness and tooling

**Files:**
- Create: `vitest.config.ts`
- Create: `schemaTypes/__tests__/helpers.ts`
- Create: `schemaTypes/__tests__/harness.test.ts`
- Modify: `package.json` (add devDependency + scripts)

- [ ] **Step 1: Install vitest**

Run: `pnpm add -D vitest`
Expected: `vitest` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Add scripts to `package.json`**

In the `"scripts"` block of `package.json`, add these three entries (keep the existing `build`/`dev`/etc. entries):

```json
    "test": "vitest run",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['schemaTypes/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Create `schemaTypes/__tests__/helpers.ts`**

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
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

/** The exported schemaTypes array. */
export {schemaTypes}
```

- [ ] **Step 5: Write the harness test**

Create `schemaTypes/__tests__/harness.test.ts`:

```ts
import {describe, it, expect} from 'vitest'
import {schemaTypes} from './helpers'

describe('schema registry', () => {
  it('exports an array', () => {
    expect(Array.isArray(schemaTypes)).toBe(true)
  })

  it('every registered type has a unique name', () => {
    const names = (schemaTypes as Array<{name: string}>).map((t) => t.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
```

- [ ] **Step 6: Run the test suite**

Run: `pnpm test`
Expected: PASS — 2 tests in `harness.test.ts` pass (the current `schemaTypes` still holds the old `page`/`navigation`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: add vitest schema test harness" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Reset the schema registry

Removes the speculative schemas that do not match the real Builder content. After this task the Studio builds with an empty schema; types are added back in Tasks 3–10.

**Files:**
- Delete: `schemaTypes/page.ts`, `schemaTypes/navigation.ts`, `schemaTypes/metadataFields.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Delete the old schema files**

```bash
git rm schemaTypes/page.ts schemaTypes/navigation.ts schemaTypes/metadataFields.ts
```

- [ ] **Step 2: Replace `schemaTypes/index.ts` with an empty registry**

Full new contents of `schemaTypes/index.ts`:

```ts
export const schemaTypes = []
```

- [ ] **Step 3: Run the test suite**

Run: `pnpm test`
Expected: PASS — `harness.test.ts` still passes against the now-empty array.

- [ ] **Step 4: Verify the Studio still builds**

Run: `pnpm build`
Expected: `sanity build` completes with no errors (an empty schema is valid).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove speculative schemas, reset registry" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Shared objects — `portableText` and `linkCard`

**Files:**
- Create: `schemaTypes/objects/shared/portableText.ts`
- Create: `schemaTypes/objects/shared/linkCard.ts`
- Create: `schemaTypes/__tests__/shared.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/shared.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/shared.test.ts`
Expected: FAIL — `Schema type "portableText" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/shared/portableText.ts`**

```ts
import {defineType, defineArrayMember} from 'sanity'

/**
 * Factory for the standard Portable Text block member. A factory (not a shared
 * constant) so each consumer array gets its own object instance.
 */
export const portableTextBlock = () =>
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Heading 1', value: 'h1'},
      {title: 'Heading 2', value: 'h2'},
      {title: 'Heading 3', value: 'h3'},
      {title: 'Heading 4', value: 'h4'},
      {title: 'Quote', value: 'blockquote'},
    ],
    lists: [
      {title: 'Bullet', value: 'bullet'},
      {title: 'Numbered', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {name: 'href', type: 'string', title: 'URL'},
            {name: 'blank', type: 'boolean', title: 'Open in new tab'},
          ],
        },
      ],
    },
  })

/** Shared Portable Text array type: block text + inline images. */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [portableTextBlock(), defineArrayMember({type: 'image', options: {hotspot: true}})],
})
```

- [ ] **Step 4: Create `schemaTypes/objects/shared/linkCard.ts`**

```ts
import {defineType, defineField} from 'sanity'

/** Reusable label/title/description/link card. `title` is optional. */
export const linkCard = defineType({
  name: 'linkCard',
  title: 'Link Card',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'linkText', title: 'Link Text', type: 'string'}),
    defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'label'}},
})
```

- [ ] **Step 5: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

export const schemaTypes = [portableText, linkCard]
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/shared.test.ts`
Expected: PASS — both tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add portableText and linkCard shared schema objects" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Sections — `ctaButton`, `blockQuote`, `resourceCard`

**Files:**
- Create: `schemaTypes/objects/sections/ctaButton.ts`
- Create: `schemaTypes/objects/sections/blockQuote.ts`
- Create: `schemaTypes/objects/sections/resourceCard.ts`
- Create: `schemaTypes/__tests__/sections-cards.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/sections-cards.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/sections-cards.test.ts`
Expected: FAIL — `Schema type "ctaButton" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/sections/ctaButton.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'Href', type: 'string'}),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      initialValue: 'filled-green',
      options: {
        list: [
          {title: 'Filled Green', value: 'filled-green'},
          {title: 'Outlined Green', value: 'outlined-green'},
          {title: 'Outlined White', value: 'outlined-white'},
          {title: 'Link Underlined', value: 'link-underlined'},
        ],
      },
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Medium', value: 'md'},
          {title: 'Small', value: 'sm'},
        ],
      },
    }),
    defineField({
      name: 'external',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})
```

- [ ] **Step 4: Create `schemaTypes/objects/sections/blockQuote.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const blockQuote = defineType({
  name: 'blockQuote',
  title: 'Block Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({name: 'attribution', title: 'Attribution', type: 'string'}),
  ],
  preview: {select: {title: 'quote', subtitle: 'attribution'}},
})
```

- [ ] **Step 5: Create `schemaTypes/objects/sections/resourceCard.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const resourceCard = defineType({
  name: 'resourceCard',
  title: 'Resource Card',
  type: 'object',
  fields: [
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      initialValue: 'primaryLight',
      options: {
        list: [
          {title: 'Primary Light', value: 'primaryLight'},
          {title: 'Secondary Light', value: 'secondaryLight'},
          {title: 'Secondary Accent', value: 'secondaryAccent'},
        ],
      },
    }),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'label'}},
})
```

- [ ] **Step 6: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'

export const schemaTypes = [portableText, linkCard, ctaButton, blockQuote, resourceCard]
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/sections-cards.test.ts`
Expected: PASS — all 3 tests pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add ctaButton, blockQuote, resourceCard section types" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Sections — `cta`, `eventCardVertical`, `heroCancerCare`

**Files:**
- Create: `schemaTypes/objects/sections/cta.ts`
- Create: `schemaTypes/objects/sections/eventCardVertical.ts`
- Create: `schemaTypes/objects/sections/heroCancerCare.ts`
- Create: `schemaTypes/__tests__/sections-hero.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/sections-hero.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/sections-hero.test.ts`
Expected: FAIL — `Schema type "cta" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/sections/cta.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      initialValue: 'primaryLight',
      options: {
        list: [
          {title: 'Primary Light', value: 'primaryLight'},
          {title: 'Secondary Light', value: 'secondaryLight'},
          {title: 'Secondary Accent', value: 'secondaryAccent'},
        ],
      },
    }),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'statNumber', title: 'Stat Number', type: 'string'}),
    defineField({name: 'statDescription', title: 'Stat Description', type: 'string'}),
    defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
    defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
})
```

- [ ] **Step 4: Create `schemaTypes/objects/sections/eventCardVertical.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const eventCardVertical = defineType({
  name: 'eventCardVertical',
  title: 'Event Card (Vertical)',
  type: 'object',
  fields: [
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'dateTime',
      title: 'Date / Time',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Image Alt Text', type: 'string'}),
    defineField({name: 'href', title: 'Href', type: 'string', validation: (r) => r.required()}),
  ],
  preview: {select: {title: 'title', subtitle: 'eventType', media: 'image'}},
})
```

- [ ] **Step 5: Create `schemaTypes/objects/sections/heroCancerCare.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const heroCancerCare = defineType({
  name: 'heroCancerCare',
  title: 'Hero — Cancer Care',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'searchTitle', title: 'Search Title', type: 'string'}),
    defineField({name: 'heroImage', title: 'Hero Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroImageAlt', title: 'Hero Image Alt Text', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline', media: 'heroImage'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Hero — Cancer Care',
      subtitle,
      media,
    }),
  },
})
```

- [ ] **Step 6: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'
import {cta} from './objects/sections/cta'
import {eventCardVertical} from './objects/sections/eventCardVertical'
import {heroCancerCare} from './objects/sections/heroCancerCare'

export const schemaTypes = [
  portableText,
  linkCard,
  ctaButton,
  blockQuote,
  resourceCard,
  cta,
  eventCardVertical,
  heroCancerCare,
]
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/sections-hero.test.ts`
Expected: PASS — all 4 tests pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add cta, eventCardVertical, heroCancerCare section types" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Sections — `faqSection`, `mod2`

**Files:**
- Create: `schemaTypes/objects/sections/faqSection.ts`
- Create: `schemaTypes/objects/sections/mod2.ts`
- Create: `schemaTypes/__tests__/sections-faq-mod2.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/sections-faq-mod2.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/sections-faq-mod2.test.ts`
Expected: FAIL — `Schema type "faqSection" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/sections/faqSection.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      initialValue: 'primaryLight',
      options: {
        list: [
          {title: 'Primary Light', value: 'primaryLight'},
          {title: 'Secondary Light', value: 'secondaryLight'},
          {title: 'Secondary Accent', value: 'secondaryAccent'},
        ],
      },
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: 'bg-red-50',
      options: {
        list: [
          {title: 'Light Red', value: 'bg-red-50'},
          {title: 'Light Green', value: 'bg-green-50'},
          {title: 'Light Blue', value: 'bg-blue-50'},
          {title: 'Light Yellow', value: 'bg-yellow-50'},
          {title: 'White', value: 'bg-white'},
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4}),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'FAQ Section'}),
  },
})
```

- [ ] **Step 4: Create `schemaTypes/objects/sections/mod2.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const mod2 = defineType({
  name: 'mod2',
  title: 'Mod2 — Journey Guide',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mod2Tab',
          fields: [
            defineField({name: 'id', title: 'ID', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({
              name: 'isActive',
              title: 'Active by default',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mod2Card',
          fields: [
            defineField({name: 'icon', title: 'Icon', type: 'image'}),
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
          ],
          preview: {select: {title: 'text', media: 'icon'}},
        }),
      ],
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Image Alt Text', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Mod2', media}),
  },
})
```

- [ ] **Step 5: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'
import {cta} from './objects/sections/cta'
import {eventCardVertical} from './objects/sections/eventCardVertical'
import {heroCancerCare} from './objects/sections/heroCancerCare'
import {faqSection} from './objects/sections/faqSection'
import {mod2} from './objects/sections/mod2'

export const schemaTypes = [
  portableText,
  linkCard,
  ctaButton,
  blockQuote,
  resourceCard,
  cta,
  eventCardVertical,
  heroCancerCare,
  faqSection,
  mod2,
]
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/sections-faq-mod2.test.ts`
Expected: PASS — all 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add faqSection and mod2 section types" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Sections — `supportResources`, `module6`

**Files:**
- Create: `schemaTypes/objects/sections/supportResources.ts`
- Create: `schemaTypes/objects/sections/module6.ts`
- Create: `schemaTypes/__tests__/sections-modules.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/sections-modules.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/sections-modules.test.ts`
Expected: FAIL — `Schema type "supportResources" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/sections/supportResources.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const supportResources = defineType({
  name: 'supportResources',
  title: 'Support Resources',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
    defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'supportCard',
          fields: [
            defineField({
              name: 'iconType',
              title: 'Icon Type',
              type: 'string',
              initialValue: 'financial',
              options: {
                list: [
                  {title: 'Financial', value: 'financial'},
                  {title: 'Emotional', value: 'emotional'},
                  {title: 'Practical', value: 'practical'},
                ],
              },
            }),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'portableText'}),
            defineField({name: 'linkText', title: 'Link Text', type: 'string'}),
            defineField({name: 'linkUrl', title: 'Link URL', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'iconType'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'backgroundImage'},
    prepare: ({title, media}) => ({title: title || 'Support Resources', media}),
  },
})
```

- [ ] **Step 4: Create `schemaTypes/objects/sections/module6.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const module6 = defineType({
  name: 'module6',
  title: 'Module6 — Knowledge & Action',
  type: 'object',
  fields: [
    defineField({name: 'mainHeading', title: 'Main Heading', type: 'string'}),
    defineField({
      name: 'advocateSection',
      title: 'Advocate Section',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'statNumber', title: 'Stat Number', type: 'string'}),
        defineField({name: 'statDescription', title: 'Stat Description', type: 'string'}),
        defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
        defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
      ],
    }),
    defineField({name: 'learnCard', title: 'Learn Card', type: 'linkCard'}),
    defineField({name: 'engageCard', title: 'Engage Card', type: 'linkCard'}),
    defineField({
      name: 'careSection',
      title: 'Care Section',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'caregiverCard', title: 'Caregiver Card', type: 'linkCard'}),
        defineField({name: 'providerCard', title: 'Provider Card', type: 'linkCard'}),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'object',
      fields: [
        defineField({
          name: 'advocateImage',
          title: 'Advocate Image',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({name: 'arrowIcon', title: 'Arrow Icon', type: 'image'}),
        defineField({
          name: 'decorativeImage',
          title: 'Decorative Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'mainHeading'},
    prepare: ({title}) => ({title: title || 'Module6'}),
  },
})
```

- [ ] **Step 5: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'
import {cta} from './objects/sections/cta'
import {eventCardVertical} from './objects/sections/eventCardVertical'
import {heroCancerCare} from './objects/sections/heroCancerCare'
import {faqSection} from './objects/sections/faqSection'
import {mod2} from './objects/sections/mod2'
import {supportResources} from './objects/sections/supportResources'
import {module6} from './objects/sections/module6'

export const schemaTypes = [
  portableText,
  linkCard,
  ctaButton,
  blockQuote,
  resourceCard,
  cta,
  eventCardVertical,
  heroCancerCare,
  faqSection,
  mod2,
  supportResources,
  module6,
]
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/sections-modules.test.ts`
Expected: PASS — all 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add supportResources and module6 section types" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Sections — `clinicalTrialSearch`, `memberApp`, `productCardPlaceholder`

**Files:**
- Create: `schemaTypes/objects/sections/clinicalTrialSearch.ts`
- Create: `schemaTypes/objects/sections/memberApp.ts`
- Create: `schemaTypes/objects/sections/productCardPlaceholder.ts`
- Create: `schemaTypes/__tests__/sections-interactive.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/sections-interactive.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/sections-interactive.test.ts`
Expected: FAIL — `Schema type "clinicalTrialSearch" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/sections/clinicalTrialSearch.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const clinicalTrialSearch = defineType({
  name: 'clinicalTrialSearch',
  title: 'Clinical Trial Search',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'mainTitle', title: 'Main Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'searchPlaceholder', title: 'Search Placeholder', type: 'string'}),
    defineField({name: 'searchButtonTitle', title: 'Search Button Title', type: 'string'}),
    defineField({
      name: 'clearSearchButtonTitle',
      title: 'Clear Search Button Title',
      type: 'string',
    }),
    defineField({
      name: 'refinementSections',
      title: 'Refinement Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'refinementSection',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'attribute', title: 'Attribute', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'attribute'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'mainTitle'},
    prepare: ({title}) => ({title: title || 'Clinical Trial Search'}),
  },
})
```

- [ ] **Step 4: Create `schemaTypes/objects/sections/memberApp.ts`**

The Builder `MemberApp` component has no inputs. A Sanity object type must declare at least one field, so a single read-only informational field is used.

```ts
import {defineType, defineField} from 'sanity'

export const memberApp = defineType({
  name: 'memberApp',
  title: 'Member Application Form',
  type: 'object',
  fields: [
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      readOnly: true,
      initialValue: 'Renders the membership application form. No configuration needed.',
    }),
  ],
  preview: {prepare: () => ({title: 'Member Application Form'})},
})
```

- [ ] **Step 5: Create `schemaTypes/objects/sections/productCardPlaceholder.ts`**

```ts
import {defineType, defineField} from 'sanity'

/**
 * Placeholder for Builder's `ProductCard` (registered cloud-side, no source
 * component in the gacore repo). Preserves the imported data so nothing is lost;
 * a real ProductCard type + React component is a follow-up.
 */
export const productCardPlaceholder = defineType({
  name: 'productCardPlaceholder',
  title: 'Product Card (pending implementation)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'handle', title: 'Handle', type: 'string'}),
    defineField({name: 'price', title: 'Price', type: 'string'}),
    defineField({name: 'theme', title: 'Theme', type: 'string'}),
    defineField({name: 'alignment', title: 'Alignment', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: `ProductCard — ${title || 'untitled'}`,
      subtitle: 'Pending implementation',
    }),
  },
})
```

- [ ] **Step 6: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'
import {cta} from './objects/sections/cta'
import {eventCardVertical} from './objects/sections/eventCardVertical'
import {heroCancerCare} from './objects/sections/heroCancerCare'
import {faqSection} from './objects/sections/faqSection'
import {mod2} from './objects/sections/mod2'
import {supportResources} from './objects/sections/supportResources'
import {module6} from './objects/sections/module6'
import {clinicalTrialSearch} from './objects/sections/clinicalTrialSearch'
import {memberApp} from './objects/sections/memberApp'
import {productCardPlaceholder} from './objects/sections/productCardPlaceholder'

export const schemaTypes = [
  portableText,
  linkCard,
  ctaButton,
  blockQuote,
  resourceCard,
  cta,
  eventCardVertical,
  heroCancerCare,
  faqSection,
  mod2,
  supportResources,
  module6,
  clinicalTrialSearch,
  memberApp,
  productCardPlaceholder,
]
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/sections-interactive.test.ts`
Expected: PASS — all 3 tests pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add clinicalTrialSearch, memberApp, productCardPlaceholder types" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Layout sections — `richText`, `columns`, `imageBlock`, `htmlEmbed`

**Files:**
- Create: `schemaTypes/objects/sections/richText.ts`
- Create: `schemaTypes/objects/sections/columns.ts`
- Create: `schemaTypes/objects/sections/imageBlock.ts`
- Create: `schemaTypes/objects/sections/htmlEmbed.ts`
- Create: `schemaTypes/__tests__/sections-layout.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/sections-layout.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/sections-layout.test.ts`
Expected: FAIL — `Schema type "richText" is not registered`.

- [ ] **Step 3: Create `schemaTypes/objects/sections/richText.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'
import {portableTextBlock} from '../shared/portableText'

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        portableTextBlock(),
        defineArrayMember({type: 'image', options: {hotspot: true}}),
        defineArrayMember({type: 'ctaButton'}),
        defineArrayMember({type: 'blockQuote'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Rich Text'})},
})
```

- [ ] **Step 4: Create `schemaTypes/objects/sections/columns.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const columns = defineType({
  name: 'columns',
  title: 'Columns',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          fields: [
            defineField({
              name: 'width',
              title: 'Width',
              type: 'string',
              initialValue: 'full',
              options: {
                list: [
                  {title: 'Full', value: 'full'},
                  {title: 'Half', value: 'half'},
                  {title: 'Third', value: 'third'},
                  {title: 'Quarter', value: 'quarter'},
                ],
              },
            }),
            defineField({name: 'content', title: 'Content', type: 'portableText'}),
          ],
          preview: {
            select: {width: 'width'},
            prepare: ({width}) => ({title: `Column (${width || 'full'})`}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Columns'})},
})
```

- [ ] **Step 5: Create `schemaTypes/objects/sections/imageBlock.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'alt', media: 'image'},
    prepare: ({title, media}) => ({title: title || 'Image', media}),
  },
})
```

- [ ] **Step 6: Create `schemaTypes/objects/sections/htmlEmbed.ts`**

```ts
import {defineType, defineField} from 'sanity'

export const htmlEmbed = defineType({
  name: 'htmlEmbed',
  title: 'HTML Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'html',
      title: 'HTML',
      type: 'text',
      rows: 8,
      validation: (r) => r.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'HTML Embed'})},
})
```

- [ ] **Step 7: Update `schemaTypes/index.ts`**

Full new contents:

```ts
import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'
import {cta} from './objects/sections/cta'
import {eventCardVertical} from './objects/sections/eventCardVertical'
import {heroCancerCare} from './objects/sections/heroCancerCare'
import {faqSection} from './objects/sections/faqSection'
import {mod2} from './objects/sections/mod2'
import {supportResources} from './objects/sections/supportResources'
import {module6} from './objects/sections/module6'
import {clinicalTrialSearch} from './objects/sections/clinicalTrialSearch'
import {memberApp} from './objects/sections/memberApp'
import {productCardPlaceholder} from './objects/sections/productCardPlaceholder'
import {richText} from './objects/sections/richText'
import {columns} from './objects/sections/columns'
import {imageBlock} from './objects/sections/imageBlock'
import {htmlEmbed} from './objects/sections/htmlEmbed'

export const schemaTypes = [
  portableText,
  linkCard,
  ctaButton,
  blockQuote,
  resourceCard,
  cta,
  eventCardVertical,
  heroCancerCare,
  faqSection,
  mod2,
  supportResources,
  module6,
  clinicalTrialSearch,
  memberApp,
  productCardPlaceholder,
  richText,
  columns,
  imageBlock,
  htmlEmbed,
]
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/sections-layout.test.ts`
Expected: PASS — all 4 tests pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add richText, columns, imageBlock, htmlEmbed layout types" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: The `page` document

**Files:**
- Create: `schemaTypes/documents/page.ts`
- Create: `schemaTypes/__tests__/page.test.ts`
- Modify: `schemaTypes/index.ts`

- [ ] **Step 1: Write the failing test**

Create `schemaTypes/__tests__/page.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test schemaTypes/__tests__/page.test.ts`
Expected: FAIL — `Schema type "page" is not registered`.

- [ ] **Step 3: Create `schemaTypes/documents/page.ts`**

```ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'URL Path',
      type: 'slug',
      description: 'The page path, e.g. / or /campaign',
      validation: (r) => r.required(),
      options: {
        source: 'title',
        slugify: (input: string) =>
          '/' +
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9/-]/g, ''),
      },
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO meta description',
    }),
    defineField({
      name: 'shareImage',
      title: 'Share Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Image used when the page is shared on social networks',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroCancerCare'}),
        defineArrayMember({type: 'mod2'}),
        defineArrayMember({type: 'supportResources'}),
        defineArrayMember({type: 'module6'}),
        defineArrayMember({type: 'faqSection'}),
        defineArrayMember({type: 'blockQuote'}),
        defineArrayMember({type: 'cta'}),
        defineArrayMember({type: 'ctaButton'}),
        defineArrayMember({type: 'resourceCard'}),
        defineArrayMember({type: 'eventCardVertical'}),
        defineArrayMember({type: 'clinicalTrialSearch'}),
        defineArrayMember({type: 'memberApp'}),
        defineArrayMember({type: 'productCardPlaceholder'}),
        defineArrayMember({type: 'richText'}),
        defineArrayMember({type: 'columns'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'htmlEmbed'}),
      ],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
```

- [ ] **Step 4: Update `schemaTypes/index.ts`**

Full new contents (adds the `page` import and places it first in the array):

```ts
import {page} from './documents/page'

import {portableText} from './objects/shared/portableText'
import {linkCard} from './objects/shared/linkCard'

import {ctaButton} from './objects/sections/ctaButton'
import {blockQuote} from './objects/sections/blockQuote'
import {resourceCard} from './objects/sections/resourceCard'
import {cta} from './objects/sections/cta'
import {eventCardVertical} from './objects/sections/eventCardVertical'
import {heroCancerCare} from './objects/sections/heroCancerCare'
import {faqSection} from './objects/sections/faqSection'
import {mod2} from './objects/sections/mod2'
import {supportResources} from './objects/sections/supportResources'
import {module6} from './objects/sections/module6'
import {clinicalTrialSearch} from './objects/sections/clinicalTrialSearch'
import {memberApp} from './objects/sections/memberApp'
import {productCardPlaceholder} from './objects/sections/productCardPlaceholder'
import {richText} from './objects/sections/richText'
import {columns} from './objects/sections/columns'
import {imageBlock} from './objects/sections/imageBlock'
import {htmlEmbed} from './objects/sections/htmlEmbed'

export const schemaTypes = [
  page,
  portableText,
  linkCard,
  ctaButton,
  blockQuote,
  resourceCard,
  cta,
  eventCardVertical,
  heroCancerCare,
  faqSection,
  mod2,
  supportResources,
  module6,
  clinicalTrialSearch,
  memberApp,
  productCardPlaceholder,
  richText,
  columns,
  imageBlock,
  htmlEmbed,
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test schemaTypes/__tests__/page.test.ts`
Expected: PASS — all 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add page document with full pageBuilder array" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Full verification

No new code — confirms the whole subsystem against the spec's success criteria.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: PASS — every test file passes (harness, shared, all section files, page).

- [ ] **Step 2: Type-check**

Run: `pnpm typecheck`
Expected: `tsc --noEmit` completes with no errors.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: `eslint .` completes with no errors.

- [ ] **Step 4: Build the Studio**

Run: `pnpm build`
Expected: `sanity build` completes with no schema errors.

- [ ] **Step 5: Manual Studio check**

Run: `pnpm dev`
Open `http://localhost:3333`. Confirm:
- A "Page" document type is creatable.
- Creating a page shows `title`, `slug`, `description`, `shareImage`, and a `pageBuilder` array.
- The `pageBuilder` "Add item" menu lists all 17 section types.
- Adding one of each section type renders an editable form with a sensible preview.
- No console errors referencing `navigation`, `metadata`, or `metadataFields`.

Stop the dev server when done.

- [ ] **Step 6: Final commit**

If Steps 1–5 surfaced no fixes, there is nothing to commit. If any step required a fix, commit it:

```bash
git add -A
git commit -m "fix: resolve verification issues in content model" -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- `page` document (title/slug/description/shareImage/pageBuilder) → Task 10 ✓
- Removal of `navigation.ts` / `metadataFields.ts` / old `page.ts` → Task 2 ✓
- 13 component section types → Tasks 4–8 ✓ (ctaButton, blockQuote, resourceCard, cta, eventCardVertical, heroCancerCare, faqSection, mod2, supportResources, module6, clinicalTrialSearch, memberApp, productCardPlaceholder)
- 4 layout section types (richText, columns, imageBlock, htmlEmbed) → Task 9 ✓
- Shared `portableText` + `linkCard` → Task 3 ✓
- File organization under `documents/` and `objects/{sections,shared}/` → all tasks ✓
- Success criteria (build, lint, dev, all types creatable) → Task 11 ✓

**Placeholder scan:** No "TBD"/"TODO"/"handle edge cases" — every step has complete code or an exact command. `productCardPlaceholder` is an intentional spec-defined type, not a plan placeholder.

**Type consistency:** `getType`/`fieldNames`/`getField`/`memberTypes` are defined once in Task 1 and used consistently. The `portableTextBlock` factory is defined in Task 3 and consumed in Task 9. Type names match between each section file, its test, `index.ts`, and the `page.pageBuilder` array.

**Known risk:** Importing `sanity` helpers under vitest's node environment is expected to work (the helpers are pure functions), but if it fails, the first failing run is Task 3 Step 2 — resolve by adding `server: {deps: {inline: ['sanity']}}` to `vitest.config.ts`.
