---
title: "feat(tabs): Implement MD3 Tabs component"
labels: ["enhancement", "component", "phase-2", "v0.2.0", "accessibility"]
milestone: "v0.2.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Tabs** component for `@tinybigui/react` as part of the Phase 2 Navigation milestone. Tabs organize content across different screens, data sets, and other interactions. This implementation supports two variants (Primary and Secondary), both fixed and scrollable layouts, three tab content modes (icon-only, label-only, icon + label), an animated active indicator, optional badges per tab, and full keyboard navigation via React Aria.

## Design Reference

- [MD3 Tabs — Overview](https://m3.material.io/components/tabs/overview)
- [MD3 Tabs — Specs](https://m3.material.io/components/tabs/specs)

## Scope

### Variants

- [ ] `primary` — active indicator: full-width underline using `bg-primary`; active label/icon `text-primary`
- [ ] `secondary` — active indicator: full-width underline using `bg-on-surface-variant`; active label/icon `text-on-surface`

### Layouts

- [ ] `fixed` — tabs fill available width equally
- [ ] `scrollable` — tabs overflow horizontally, no wrapping; scroll affordance shown when needed

### Tab Content Modes

- [ ] Icon-only (`icon` prop only)
- [ ] Label-only (`label` prop only)
- [ ] Icon + label stacked (`icon` + `label` props)

### Features

- [ ] Animated active indicator — sliding underline driven by MD3 motion tokens (no CSS-in-JS)
- [ ] Badge support — optional `badge` prop on `Tab` (numeric count, dot indicator, or 999+)
- [ ] Disabled tab support
- [ ] Controlled (`selectedKey`) and uncontrolled (`defaultSelectedKey`) usage via `Tabs` wrapper
- [ ] Full keyboard navigation — Arrow Left/Right, Home, End, roving `tabIndex`
- [ ] Dark mode support via existing token system

### Deliverables

- [ ] `Tabs.tsx` — context provider wrapper; manages shared selected state
- [ ] `TabList.tsx` — MD3 styled tab row container
- [ ] `Tab.tsx` — individual tab item (styled layer)
- [ ] `TabPanel.tsx` — associated content panel
- [ ] `TabsHeadless.tsx` — React Aria headless primitives (`HeadlessTabList`, `HeadlessTab`, `HeadlessTabPanel`)
- [ ] `Tabs.variants.ts` — CVA variant definitions
- [ ] `Tabs.types.ts` — TypeScript types extending React Aria props
- [ ] `Tabs.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `Tabs.stories.tsx` — Storybook stories for all variants, layouts, content modes, badge, disabled
- [ ] `index.ts` — named exports for all public sub-components, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — Tabs.tsx / TabList.tsx / Tab.tsx / TabPanel.tsx  (MD3 styled, CVA variants, 'use client')
Layer 2 — TabsHeadless.tsx                                 (React Aria: useTabList, useTab, useTabPanel)
Layer 1 — React Aria                                       (useTabList, useTab, useTabPanel, FocusRing)
```

**React Aria hooks:**

- `useTabList` — on the `<TabList>` container (manages `role="tablist"`, keyboard navigation)
- `useTab` — on each `<Tab>` item (`role="tab"`, `aria-selected`, `aria-disabled`, roving `tabIndex`)
- `useTabPanel` — on each `<TabPanel>` (`role="tabpanel"`, `aria-labelledby`)

**CVA variants:** `variant` (`primary` | `secondary`), `layout` (`fixed` | `scrollable`), `contentMode` (`icon` | `label` | `icon-label`)

**Token usage (no arbitrary values):**

- Container: `bg-surface`
- Primary active indicator: `bg-primary`; active text: `text-primary`
- Secondary active indicator: `bg-on-surface-variant`; active text: `text-on-surface`
- Inactive text: `text-on-surface-variant`
- Type scale: `title-small` (per MD3 Tab spec)
- State layers: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] `Tabs` wrapper correctly manages shared selected state across `TabList` and `TabPanel`
- [ ] Both `primary` and `secondary` variant styles match MD3 specifications
- [ ] Fixed layout distributes tab widths equally; scrollable layout overflows horizontally without wrapping
- [ ] All three content modes (icon-only, label-only, icon + label) render correctly
- [ ] Active indicator slides to the newly selected tab using MD3 motion tokens
- [ ] Badge renders correctly for numeric values, dot indicator, and truncates to "999+" beyond 999
- [ ] Badge is hidden when numeric value is `0`
- [ ] Disabled tabs are not focusable and cannot be selected
- [ ] Full keyboard navigation: Arrow Left/Right cycles tabs, Home/End jump to first/last
- [ ] `role="tablist"`, `role="tab"`, and `role="tabpanel"` are applied correctly
- [ ] `aria-selected`, `aria-controls`, `aria-labelledby`, and `aria-disabled` attributes are wired correctly
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + keyboard interaction tests)
- [ ] Storybook stories cover Primary/Secondary variants, fixed/scrollable layouts, all content modes, badge, disabled tab
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.1.0` released (Button, IconButton, FAB, TextField, Checkbox, Switch, Radio)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)

## Out of Scope

- **Vertical tabs** — not part of MD3 Tabs spec
- **Nested tabs** — not supported by MD3
- **Lazy-loading of tab panels** — future enhancement
- **Separate `Badge` component** — badge is a simple inline implementation within `Tab` for now

## Resources

- [MD3 Tabs Spec](https://m3.material.io/components/tabs/specs)
- [React Aria `useTabList`](https://react-spectrum.adobe.com/react-aria/useTabList.html)
- [React Aria `useTab`](https://react-spectrum.adobe.com/react-aria/useTab.html)
- [React Aria `useTabPanel`](https://react-spectrum.adobe.com/react-aria/useTabPanel.html)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `Radio` component](packages/react/src/components/Radio/) (group + item pattern)
