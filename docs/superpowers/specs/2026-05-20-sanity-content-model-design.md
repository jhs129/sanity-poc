# Sanity Content Model — Design Spec

**Date:** 2026-05-20
**Subsystem:** #1 of 5 — Builder.io → Sanity migration
**Repo:** `sanity-poc` (`/Users/johnhschneider/dev/rds/sanity-poc`)
**Status:** Approved design — ready for implementation planning

---

## 1. Background

The `gacore` project (`/Users/johnhschneider/dev/rds/node/gacore`) is a Next.js 14 +
Builder.io site for Georgia CORE (cancer care). All page content lives in Builder.io.
The goal is to migrate the site, its content, and its frontend to Sanity.

### Findings from the Builder.io space (API key `7bf199de15724d268c1417f75ca31ce1`)

- **One Builder model:** `page`. There is **no** `navigation` or `metadata` model.
- **Page model fields:** `title`, `description`, `url`, `blocks` (plus Builder internals
  `jsCode`, `tsCode`, `themeId`, `state`).
- **5 published pages:** `home` (`/`), `campaign` (`/campaign`), `member-app`
  (`/cancer-patient-navigators-georgia/membership-application`), `member-app-2`
  (`/member-app-2`), `clinical-trial-search` (`/clinical-trial-search`).
- Pages are freeform `blocks` trees mixing Builder built-ins (`Core:Section`,
  `Columns`, `Text`, `Image`, `Raw:Img`, `Custom Code`, unnamed `Box` wrappers) with
  custom React components.
- The existing `sanity-poc` schemas (`page` with `theme`/`image`/nav references,
  `navigation`, `metadataFields`) were scaffolded speculatively and **do not match**
  the real Builder content. They are replaced/removed by this spec.

### The 5-subsystem decomposition (full migration)

| # | Subsystem | Status |
|---|-----------|--------|
| 1 | **Sanity content model** — schema types | **This spec** |
| 2 | App scaffold + embedded Studio (Next.js 15, Studio at `/studio`) | Later |
| 3 | Frontend rendering — port components, catch-all route, section renderer | Later |
| 4 | Content migration ETL — pull 5 Builder pages, transform, import (images → Sanity assets) | Later |
| 5 | Interactive features — GraphQL API, Algolia search, membership form | Later |

Build order: 1 → 2 → 3 → 4 → 5. Each subsystem gets its own spec → plan → build cycle.

---

## 2. Scope of this subsystem

**In scope:** Design and implement the Sanity schema types (documents + objects) that
represent the `gacore` site as an idiomatic Sanity page builder. The Studio must
build and type-check cleanly with the new schema.

**Out of scope:** Content import (Subsystem #4), frontend/Studio app scaffolding
(#2), component rendering (#3), interactive backends (#5). No actual page documents
are created by this subsystem.

### Approved decisions

- **Content model:** page builder of typed sections.
- **Layout primitives:** flat page builder, max one nesting level. `Core:Section` and
  `Box` wrappers flatten away; `Columns` is a first-class section whose columns hold
  Portable Text.
- **Component coverage:** all registered Builder components become schema types.
- **ProductCard:** deferred — modelled as a placeholder type that preserves imported
  data; no React component yet.
- **Navigation:** stays hardcoded React — no navigation schema. The speculative
  `navigation.ts` is deleted.
- **SEO:** flat `description` + `shareImage` fields on the `page` document.
- **Images:** all image fields use Sanity's native `image` type (assets uploaded
  during Subsystem #4 import).

---

## 3. Document type: `page`

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Required. Builder `data.title`. SEO title + document identity. |
| `slug` | `slug` | Required. Builder `data.url` verbatim (e.g. `/`, `/campaign`). Custom `slugify` lowercases and **preserves `/`**; validation requires a leading `/`. Home page = `/`. |
| `description` | `text` (3 rows) | Builder `data.description`. SEO meta description. |
| `shareImage` | `image` (hotspot) | Optional. OG/social share image. New field. |
| `pageBuilder` | `array` | The page content — members are the 17 section types in §4–5. |

`preview`: title = `title`, subtitle = `slug.current`.

---

## 4. Section types — components (13)

One section type per registered Builder component. Fields mirror each component's
Builder `inputs` exactly, so the React components ported in Subsystem #3 need minimal
prop changes. `image` fields replace Builder `file`/URL-string inputs.

### 4.1 `heroCancerCare` (Builder: `CancerCareHero`)
`tagline` string · `title` string · `searchTitle` string · `heroImage` image(hotspot)
· `heroImageAlt` string

### 4.2 `mod2` (Builder: `Mod2`)
`heading` string · `tabs` array of `{ id: string, label: string, isActive: boolean }`
· `cards` array of `{ icon: image, text: string, linkUrl: string }` · `image`
image(hotspot) · `imageAlt` string

### 4.3 `supportResources` (Builder: `Module4`, friendlyName "Support Resources")
`backgroundImage` image · `heading` string · `buttonText` string · `buttonUrl` string
· `cards` array of `{ iconType: string enum [financial|emotional|practical], title:
string, description: portableText, linkText: string, linkUrl: string }`

### 4.4 `module6` (Builder: `Module6`)
`mainHeading` string ·
`advocateSection` object `{ title, description: text, statNumber, statDescription,
buttonText, buttonUrl }` ·
`learnCard` `linkCard` · `engageCard` `linkCard` ·
`careSection` object `{ heading: string, caregiverCard: linkCard, providerCard:
linkCard }` ·
`images` object `{ advocateImage: image, arrowIcon: image, decorativeImage: image }`

### 4.5 `faqSection` (Builder: `FAQ Section`)
`title` string · `theme` string enum [primaryLight|secondaryLight|secondaryAccent] ·
`backgroundColor` string enum [bg-red-50|bg-green-50|bg-blue-50|bg-yellow-50|bg-white]
· `items` array of `{ question: string, answer: text }`

### 4.6 `blockQuote` (Builder: `BlockQuote`)
`quote` text (required) · `attribution` string

### 4.7 `cta` (Builder: `CTA`)
`theme` string enum [primaryLight|secondaryLight|secondaryAccent] · `title` string ·
`description` text · `statNumber` string · `statDescription` string · `buttonText`
string · `buttonUrl` string · `image` image

### 4.8 `ctaButton` (Builder: `CTAButton`)
`label` string (required) · `href` string · `variant` string enum
[filled-green|outlined-green|outlined-white|link-underlined] · `size` string enum
[md|sm] · `external` boolean

### 4.9 `resourceCard` (Builder: `ResourceCard`, friendlyName "Card")
`theme` string enum [primaryLight|secondaryLight|secondaryAccent] · `label` string
(required) · `title` string · `description` text (required) · `linkText` string
(required) · `linkUrl` string

### 4.10 `eventCardVertical` (Builder: `EventCardVertical`)
`eventType` string (required) · `title` string (required) · `dateTime` string
(required) · `location` string (required) · `image` image · `imageAlt` string ·
`href` string (required)

### 4.11 `clinicalTrialSearch` (Builder: `ClinicalTrialSearch`)
`backgroundImage` image · `mainTitle` string · `subtitle` string · `searchPlaceholder`
string · `searchButtonTitle` string · `clearSearchButtonTitle` string ·
`refinementSections` array of `{ title: string, attribute: string }`

### 4.12 `memberApp` (Builder: `MemberApp`)
Marker block — no editable fields (Builder registered it with `inputs: []`). Implement
as an object whose `preview.prepare` returns a static title "Member Application Form".
If the Studio requires at least one field, add a single hidden read-only marker field.

### 4.13 `productCardPlaceholder` (Builder: `ProductCard` — deferred)
`ProductCard` has no source component in the `gacore` repo (registered cloud-side in
Builder). Modelled as a placeholder that preserves imported data without loss:
`title` string · `eyebrow` string · `handle` string · `price` string · `theme` string
· `alignment` string. The `preview` clearly labels it "ProductCard — pending
implementation". A React component is built in a later subsystem.

---

## 5. Section types — layout primitives (4)

For Builder's freeform built-ins. `Core:Section` and unnamed `Box` wrappers do **not**
get types — they flatten away (they only carried max-width/padding).

### 5.1 `richText`
`body` — Portable Text array (the shared `portableText` config, §6.1). Absorbs runs of
Builder `Text` blocks. Images, `ctaButton`, and `blockQuote` are embeddable inline.

### 5.2 `columns`
`columns` — array of `column` objects `{ content: portableText, width?: string enum
[half|third|quarter|full] }`. Handles the campaign 2-column layouts and the home page
stat/logo grids. One nesting level only (page → columns → column → Portable Text).

### 5.3 `imageBlock`
`image` image(hotspot, required) · `alt` string · `caption` string (optional). For
standalone `Image` / `Raw:Img` blocks not inside a `richText` body.

### 5.4 `htmlEmbed`
`html` text (required). For Builder `Custom Code` blocks (raw HTML/SVG).

---

## 6. Shared objects

### 6.1 `portableText`
Exported Portable Text array definition, reused by `richText.body`, each
`columns` column `content`, and `supportResources` card `description`.
- Block styles: `normal`, `h1`, `h2`, `h3`, `h4`, `blockquote`.
- Lists: bullet, numbered.
- Marks (decorators): `strong`, `em`.
- Annotations: `link` `{ href: url, blank: boolean }`.
- Inline/block members: `image` (hotspot). `richText.body` additionally allows
  embedded `ctaButton` and `blockQuote`.

### 6.2 `linkCard`
Object `{ label: string, title: string (optional), description: text, linkText:
string, linkUrl: string }`. Reused by `module6` (`learnCard`, `engageCard`,
`careSection.caregiverCard`, `careSection.providerCard`). `title` is optional because
the caregiver/provider cards omit it.

### Field conventions
- Link/button pairs stay **flat** (`buttonText`/`buttonUrl`, `linkText`/`linkUrl`) —
  matches existing React component props, minimizing rewrites in Subsystem #3.
- Every section type and array member defines a `preview` so the Studio is legible.
- Every enum uses `options.list` with explicit `{title, value}` entries.

---

## 7. File organization

```
schemaTypes/
  index.ts                      # imports + exports schemaTypes array
  documents/
    page.ts
  objects/
    sections/
      heroCancerCare.ts
      mod2.ts
      supportResources.ts
      module6.ts
      faqSection.ts
      blockQuote.ts
      cta.ts
      ctaButton.ts
      resourceCard.ts
      eventCardVertical.ts
      clinicalTrialSearch.ts
      memberApp.ts
      productCardPlaceholder.ts
      richText.ts
      columns.ts
      imageBlock.ts
      htmlEmbed.ts
    shared/
      portableText.ts
      linkCard.ts
```

Existing files `schemaTypes/page.ts`, `schemaTypes/navigation.ts`,
`schemaTypes/metadataFields.ts` are removed (their content is superseded or deleted
as described above). `schemaTypes/index.ts` is rewritten to register all new types.

All types use `defineType` / `defineField` / `defineArrayMember`. Existing repo
conventions (Prettier: no semicolons, single quotes, 100 print width) are kept.

---

## 8. Success criteria

1. `pnpm build` (`sanity build`) succeeds with no schema errors.
2. `pnpm lint` passes with no errors.
3. `pnpm dev` starts the Studio; the `page` document and all 17 section types are
   creatable, and every section type renders an editable form and a sensible preview.
4. No remaining references to the deleted `navigation` / `metadataFields` schemas.
5. The schema covers every component and built-in block observed across all 5 Builder
   pages (verified against the block inventory in §1).

---

## 9. Known gaps / follow-ups

- `mod2` and `module6` keep Builder's internal names as type names (with friendly
  Studio titles). They could be renamed to semantic names in a later pass.
- `productCardPlaceholder` is a deliberate deferral — a real `ProductCard` type +
  component is a follow-up.
- `mod2.heading` was Builder type `html` (may contain inline `<em>`); modelled here as
  a plain `string`. Inline emphasis in that heading is dropped — acceptable per the
  agreed "manual mapping" tradeoff.
- The HTML→Portable Text conversion logic itself belongs to Subsystem #4 (import ETL);
  this subsystem only defines the target Portable Text shape.
