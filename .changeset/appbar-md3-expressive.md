---
"@tinybigui/react": minor
"@tinybigui/tokens": minor
---

**AppBar: M3 Expressive Flexible architecture refactor**

**Styling architecture (Variants vs States):**

- Rewrote `AppBar.variants.ts` into slot-based CVAs matching the Button/Switch pattern: `appBarVariants`, `appBarTopRowVariants`, `appBarLeadingVariants`, `appBarHeadlineBlockVariants`, `appBarTitleVariants`, `appBarSubtitleVariants`, `appBarTrailingVariants`, `appBarExpandedTitleVariants`
- Scroll elevation migrated from a CVA boolean variant to presence-based `data-scrolled=""` on the root + `group-data-[scrolled]/appbar:*` selectors (breaking: `shadow-elevation-2` / `bg-surface-container` are no longer bare classes when scrolled)
- Motion tokens corrected: `transition-shadow duration-medium2 ease-standard` → `transition-[background-color,box-shadow] duration-spring-standard-default-effects ease-spring-standard-default-effects`

**M3 Expressive Flexible subtitle type scales (corrected):**

- small / center-aligned: `label-medium` + `on-surface-variant` (was `title-medium`)
- medium expanded: `label-large` + `on-surface-variant` (was `title-large` + `on-surface`)
- large expanded: `title-medium` + `on-surface-variant` (was `headline-small` + `on-surface`)

**M3 Expressive Flexible height growth:**

- medium with subtitle grows to 136dp (new `--spacing-appbar-medium-subtitle` token)
- large with subtitle grows to 152dp (new `--spacing-appbar-large-subtitle` token)
- Driven by `data-with-subtitle=""` content flag + `group-data-[with-subtitle]/appbar:*` selectors

**API:**

- `AppBarHeadlessProps` now extends `React.HTMLAttributes<HTMLElement>` for `data-*` forwarding
- All new slot CVA fns exported from `index.ts`
- Public `AppBar` props are unchanged
