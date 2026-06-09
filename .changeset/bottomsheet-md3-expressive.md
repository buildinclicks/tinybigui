---
"@tinybigui/react": minor
---

feat(bottomsheet): refactor handle to Variants-vs-States architecture with MD3 state layer

Refactors the BottomSheet drag handle to match the Button/Switch component pattern:

- **Handle state layer**: new `bottomSheetHandleStateLayerVariants` slot — semi-transparent ring driven by `data-*` attributes. Opacities follow MD3 spec: hover 8%, focus/pressed 10%, dragged 16%.
- **Handle focus ring**: new `bottomSheetHandleFocusRingVariants` slot — opacity-driven `outline-secondary` overlay replacing the previous raw `focus-visible:ring-*` utility classes. Avoids clipping by the container's `overflow-hidden`.
- **Handle pill**: removed non-token `opacity-40`; `on-surface-variant` is already a low-emphasis color role and requires no opacity override per MD3 spec.
- **React Aria wiring**: `useHover` and `useFocusRing` now drive `data-hovered` and `data-focus-visible` on the handle wrapper via `getInteractionDataAttributes`. The wrapper carries `group/handle` so all child slots consume state via `group-data-[x]/handle:` selectors.
- **Presence-based encoding**: all `data-dragging` attributes (panel + handle) now use ternary encoding (`isDragging ? "" : undefined`) per component-variants architecture rule.
- Exports two new variant functions (`bottomSheetHandleStateLayerVariants`, `bottomSheetHandleFocusRingVariants`) and their corresponding types.
