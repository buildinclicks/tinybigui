---
"@tinybigui/react": minor
---

**Badge: align with MD3 spec and variants/states architecture (breaking)**

Removes the non-spec `color` prop (and `BadgeColor` type) from `Badge`, `BadgeContent`, and `DrawerItemBadgeConfig`. The MD3 badge specification defines only the error color role (`bg-error` / `text-on-error`), which is now hardcoded in the CVA base.

**Migration:** Remove any `color` prop usage from `<Badge>` and `<DrawerItem badge={{ color: … }}>`.

**Styling changes:**

- Migrates from CVA variant keys for `size`, `color`, `invisible`, and `reducedMotion` to the variants-vs-states architecture used by Button and Switch.
- Dot vs count is now a content flag (`data-dot`) set directly on the element; visibility is a runtime flag (`data-invisible`).
- Show/hide animation uses MD3 Expressive spatial token pair (`duration-expressive-fast-spatial` + `ease-expressive-fast-spatial`) instead of mixed scale+opacity transitions.
- Reduced-motion guard applied at the component level (conditional class, not a CVA variant).
