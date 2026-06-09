---
"@tinybigui/react": minor
---

**BREAKING** `FABMenu`: redesign action items to MD3 Expressive pill buttons

`FABMenuItem` is now a full-rounded 56dp pill button (leading icon + inline label) matching the MD3 Expressive FAB Menu spec, replacing the previous 40dp mini-FAB with a detached floating label chip.

### Breaking changes

- `FABMenuItem` shape changes: was `size-10 rounded-xl` (40dp mini-FAB); now `h-14 rounded-full` (56dp pill).
- `label` is now rendered **inline inside the button** (not as a sibling chip). The `rounded-full` chip pattern is removed.
- `aria-label` on `FABMenuItem` is now **optional** when `label` is provided (the label text serves as the accessible name). A dev-mode warning is emitted if neither `aria-label` nor `label` is present.
- `fabMenuItemVariants` shape has changed: the old `isOpen: true/false` boolean CVA is replaced by the new slot-based CVA with a `color` variant. Update any direct usage accordingly.

### New features

- `color` prop on `FABMenuItem` (default `primary-container`): choose from 6 MD3 Expressive color roles — `primary-container`, `secondary-container`, `tertiary-container`, `primary`, `secondary`, `tertiary`.
- New exported slot CVAs: `fabMenuItemStateLayerVariants`, `fabMenuItemFocusRingVariants`, `fabMenuItemIconVariants`, `fabMenuItemLabelVariants`.
- New exported CVA: `fabMenuListVariants` — absolutely-positioned overlay with per-direction anchoring via logical insets (`end-0`, `start-full`, etc.) so RTL placement is automatic.
- New exported types: `FABMenuItemColor`, `FABMenuListVariants`.
- Correct MD3 state-layer opacities: hover 8% / focus 10% / pressed 10% (was hover-only).
- Dedicated focus ring slot (`inset-[-3px]`, keyboard-only) per Button/FAB architecture.
- Elevation 3 base → 4 hover → 3 focus/pressed per MD3 FAB spec.
- Trigger FAB is now the **sole in-flow child** of the root; action items render as an **absolutely-positioned overlay** so the FAB never shifts position when the menu opens or closes.
- Scale-in/out pivot (`transform-origin`) aligns with the FAB edge per direction so items appear to emanate from the trigger.
- Trigger FAB icon morph (+→×) now uses `expressive-fast-spatial` motion tokens, guarded by `useReducedMotion`.
- Ripple effect on menu items.
- Full React Aria keyboard accessibility via `useButton`/`useHover`/`useFocusRing`.
- Staggered items no longer flash on open/close: `--animate-md-scale-in` and `--animate-md-scale-out` tokens now use fill-mode `both`, holding the keyframe start frame during the stagger `animation-delay`.
