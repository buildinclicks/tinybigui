---
"@tinybigui/react": minor
---

**Slider: MD3 Expressive architecture refactor with spring motion**

The Slider component has been fully migrated to the "Variants-vs-States" architecture used by Button and Switch, and all motion tokens have been updated to the MD3 spring system.

**Architecture changes (no API breakage)**

- Interaction states (hover, pressed/dragging, disabled, focus-visible) are now driven by React Aria's `isDragging`, `isHovered`, and `isFocusVisible` hooks via `getInteractionDataAttributes`, emitting `data-*` presence attributes on the RA thumb element (`group/slider-thumb`). All visual state changes — handle width, state-layer opacity, value-indicator visibility — are now handled entirely by `group-data-[x]/slider-thumb:*` CSS selectors.
- The manual `thumbStates` React state and `onPointerEnter/Leave/Down/Up` handlers have been removed. React Aria is the single source of truth for interaction state.
- The visual handle, state layer, and value indicator are now rendered **inside** the React Aria thumb element (which is absolutely positioned at the value percentage), via a `renderThumbContent` render prop on `SliderHeadless`.
- Disabled track/stop colors are driven by `group-data-[disabled]/slider:*` selectors from the root `group/slider` scope.

**Motion token changes (user-visible)**

| Element                           | Before                                                                                  | After                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Handle width (4dp → 2dp on press) | `duration-short2 ease-standard`                                                         | `duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial` |
| State layer opacity               | `duration-short1 ease-standard`                                                         | `duration-spring-standard-fast-effects ease-spring-standard-fast-effects` |
| Value indicator (enter/exit)      | `duration-short3 ease-standard-decelerate` / `duration-short2 ease-standard-accelerate` | `duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial` |

**Value indicator change (user-visible)**

The value indicator is now always rendered in the DOM when `showValueIndicator=true` (previously only rendered when the thumb was pressed). Visibility is CSS-driven via `group-data-[pressed]/slider-thumb:opacity-100 scale-100`. `aria-hidden="true"` is set permanently since the accessible value is in the React Aria `<output>` element.

**New `SliderHeadless` props**

- `renderThumbContent?: (state: SliderThumbRenderState) => React.ReactNode` — render prop for injecting visual thumb content inside the RA thumb element.
- `onThumbDraggingChange?: (index: number, isDragging: boolean) => void` — callback for tracking per-thumb drag state.

**Deprecations (no removal)**

`SliderThumbState` and `SliderRenderState` are marked `@deprecated`. They remain exported and unchanged for backwards compatibility.
