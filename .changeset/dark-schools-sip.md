---
"@tinybigui/react": minor
---

feat(textfield)!: rebuild TextField to strict MD3 Expressive specs

**Breaking changes:**

- Removed `size` prop (`"small" | "medium" | "large"`) — MD3 text fields are a fixed 56dp height with no size scale. Remove any `size` prop usage.
- Removed `TextFieldSize` type export.

**New features:**

- `prefix` prop: inline prefix text (e.g. `"$"`) — rendered before the input value, visible once the label floats.
- `suffix` prop: inline suffix text (e.g. `"kg"`, `"%"`) — rendered after the input value, visible once the label floats.

**Architecture / styling:**

- Rebuilt on the Variants-vs-States architecture: all interaction states (`hovered`, `focused`, `invalid`, `disabled`, `readonly`) are emitted as `data-*` attributes on the root `group/text-field` element and consumed via `group-data-[x]/text-field:` selectors — state variants removed from CVA.
- Added MD3 **state layer** (filled variant): `bg-on-surface` overlay at 8% hover / 10% focus opacity.
- Added MD3 **active indicator** (filled variant): 1px bottom line animating to 2px on focus, `primary` color on focus, `error` on invalid.
- Added MD3 **notched outline** (outlined variant): `aria-hidden` `<fieldset>/<legend>` that opens a gap in the border for the floating label.
- Label transitions use MD3 `body-large` → `body-small` typography swap with spring-standard-fast-spatial motion token (replaces `scale-75` transform).
- All hardcoded `duration-200` replaced with `duration-spring-standard-fast-effects` / `duration-spring-standard-fast-spatial` + matching easing tokens (Standard personality — no Expressive overshoot for utility form UI).
- Supporting text + character counter now render on **one flex row** (text left, counter right) per MD3 spec.
- Icon size corrected to 24×24dp (MD3 spec).
- Field typography: `text-body-large` for input; `text-body-small` for floating label and supporting text.
