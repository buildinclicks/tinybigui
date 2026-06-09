---
"@tinybigui/react": patch
---

fix(badge): anchor indicator to icon corner per MD3 spec

## What changed

The Badge indicator now straddles the wrapped element's top-right corner instead of floating fully outside it.

**Before:** `absolute -top-1 -right-1` pushed the badge 4dp outside the host's top-right edge. When wrapping a padded `IconButton`, the badge landed on the button border rather than on the icon itself.

**After:** `absolute top-0 right-0 -translate-y-1/2 translate-x-1/2` places the badge center on the host's top-right corner (half-in, half-out), matching the MD3 spec diagram. This is host-size-agnostic — the badge sits correctly on a 24dp bare icon, a nav chip, or any other wrapped element.

> Tailwind v4 note: `translate-*` and `scale-*` map to independent native CSS `translate:` / `scale:` properties, so the static corner translate does not interfere with the existing `scale-0`/`scale-100` show/hide animation.

## Drawer trailing badge

`DrawerItem`'s config-based badge (`badge={{ count: N }}`) no longer uses `<Badge><span/>` (which would apply the absolute translate to a 0-size anchor). It now renders a direct `<span role="status">` using the new `badgeStaticVariants` — same visual appearance (colors, sizing, dot/invisible flags) but inline (no absolute positioning).

## New export

`badgeStaticVariants` and `BadgeStaticVariants` are now exported from `@tinybigui/react` for consumers who need an inline badge pill in custom layouts.

## Migration

No API changes. If you relied on the `absolute -top-1 -right-1` offset for a custom layout workaround, update your wrapping to match the new `top-0 right-0 -translate-y-1/2 translate-x-1/2` placement.
