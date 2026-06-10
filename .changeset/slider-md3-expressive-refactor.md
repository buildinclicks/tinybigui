---
"@tinybigui/react": minor
---

**Slider: MD3 Expressive architecture refactor with spring motion, range/vertical layout fixes, and vertical orientation improvements**

The Slider component has been fully migrated to the "Variants-vs-States" architecture used by Button and Switch, all motion tokens have been updated to the MD3 spring system, range/vertical track alignment has been corrected to absolute positioning, and the vertical orientation now renders correctly at all sizes.

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

The value indicator motion has also been corrected for Tailwind CSS v4: `scale-*` utilities now use the CSS `scale` property (not `transform`), so the transition list uses `transition-[scale,opacity]` instead of `transition-[transform,opacity]`.

**Track layout fixes (range & vertical)**

- All active and inactive track segments are now `position: absolute` within the track region, aligned to the same percentage coordinate space as React Aria's thumb positions. This fixes the range slider fill not meeting handles at extreme values.
- The MD3 6dp thumb-track gap is implemented as a symmetric 3px inset on each side of the thumb.
- The vertical slider track region now uses `flex-1 min-h-0` instead of `h-full`, reliably filling its flex container regardless of nesting depth. At `value=0`, the active track collapses to zero height (no longer half-filled).

**Vertical orientation improvements**

- The vertical handle bar now has an explicit per-size width (xsmall/small: 44px, medium: 52px, large: 68px, xlarge: 108px) matching the track region width, per MD3 §10.9 transposed dimensions. The handle bar was previously sized to `w-full` which collapsed to zero width when the RA thumb had no explicit width.
- Both `standard` and `centered` variants now render correctly in vertical orientation.

**New `SliderHeadless` props**

- `renderThumbContent?: (state: SliderThumbRenderState) => React.ReactNode` — render prop for injecting visual thumb content inside the RA thumb element.
- `onThumbDraggingChange?: (index: number, isDragging: boolean) => void` — callback for tracking per-thumb drag state.

**Deprecations (no removal)**

`SliderThumbState` and `SliderRenderState` are marked `@deprecated`. They remain exported and unchanged for backwards compatibility.
