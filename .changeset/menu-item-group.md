---
"@tinybigui/react": minor
---

Add `MenuItemGroup` component — a sibling-aware grouping primitive for MD3 Expressive vertical menus.

`MenuItemGroup` wraps related `MenuItem` elements in a semantic `role="group"` block and automatically inserts a 2dp MD3 Expressive gap between consecutive sibling groups (`menuStyle="vertical"`), so no manual `<MenuGap />` placement is required. An `aria-label` is required on every group to satisfy the ARIA `group` accessible-name requirement (WCAG 2.1).

New exports from `@tinybigui/react`:

- `MenuItemGroup` component (Layer 3)
- `MenuItemGroupProps` type
- `menuItemGroupVariants` CVA function
- `MenuItemGroupVariants` type
