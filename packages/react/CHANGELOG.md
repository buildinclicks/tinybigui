# @tinybigui/react

## 0.24.3

### Patch Changes

- 9ae0cbb: **Checkbox:** fix margin and layout alignment for checkbox variants

  Adjust root negative margin, control padding, and label spacing to match MD3 touch-target and label alignment spec.

## 0.24.1

### Patch Changes

- 6af11ff: **Button:** fix loading usage, outlined variant styling, and disabled state selectors
  - **fix:** outlined variant uses `border-outline-variant` and explicit `bg-transparent` per MD3 spec
  - **fix:** filled disabled overrides use `group-data-[disabled]/button:` selectors so background and text colors apply correctly on the root group host
  - **fix:** focus/pressed shadow overrides use `group-data-[focus-visible]/button` and `group-data-[pressed]/button` for consistent cascade with hover
  - **fix:** state layer hover opacity uses explicit `opacity-[0.08]` token; pressed state layer no longer requires doubled selector
  - **docs:** loading Storybook examples simplified (icons removed from loading demos)

## 0.24.0

### Minor Changes

- b3f41d2: Refactor Navigation Drawer to MD3 slot-based "Variants-vs-States" architecture.

  **Architectural Changes**
  - `DrawerItem` now follows the slot pattern used by `Button` and `MenuItem`: the root element is `group/draweritem` and each visual part (active indicator, state layer, focus ring, ripple, icon, label, badge) is a discrete `<span>` slot whose appearance is driven by `group-data-[x]/draweritem` Tailwind selectors.
  - Interaction states (hover, focus-visible, pressed) are owned by the styled layer via `useHover` / `useFocusRing` / press callbacks and emitted as `data-*` attributes through `getInteractionDataAttributes` — no CVA variants for states.
  - All color/opacity slot transitions now use `duration-spring-standard-fast-effects ease-spring-standard-fast-effects` (effects tokens, no overshoot). Slide-in animation retains legacy navigation-level tokens (`duration-medium4 ease-emphasized-decelerate`).

  **MD3 Spec Alignment**
  - Container: `bg-surface-container-low` for both standard and modal variants; modal adds `shadow-elevation-1`.
  - Corner radius corrected: `rounded-r-lg` (16dp, MD3 corner-large) — was `rounded-r-xl` (28dp).
  - Item height: `h-14` (56dp); shape `rounded-full`; padding `pl-4 pr-6`; icon-to-label gap `gap-3` (12dp).
  - Inactive content (icon / label / badge): `text-on-surface-variant`. Active: `bg-secondary-container` indicator, `text-on-secondary-container` content.
  - State-layer colors: `bg-on-surface-variant` inactive / `bg-on-secondary-container` active; hover 8% / press 10% opacity.
  - Scrim: `bg-scrim opacity-32`.
  - Icon size corrected to 24dp (`h-6 w-6`).

  **Breaking Changes**
  - `iconOnly` prop removed from `Drawer` and `DrawerItem` (belongs to NavigationRail, not MD3 nav drawer). `DrawerIconOnlyContext` removed.
  - `secondaryText` prop removed from `DrawerItem` (not in MD3 nav-drawer anatomy).
  - `badge` prop type changed from `DrawerItemBadgeConfig | ReactNode` to `number | string`. The badge now renders as plain inline text colored by item state instead of an error-colored pill.
  - `DrawerItemBadgeConfig` type removed.

  **New Additions**
  - `DrawerHeadline` component: MD3 anatomy element 2 — header text for the drawer (`text-title-small text-on-surface-variant`).
  - `DrawerContext` exported (replaces the removed `DrawerIconOnlyContext`).
  - All slot CVA functions exported: `drawerItemActiveIndicatorVariants`, `drawerItemStateLayerVariants`, `drawerItemFocusRingVariants`, `drawerItemIconVariants`, `drawerItemLabelVariants`, `drawerItemBadgeVariants`, `drawerHeadlineVariants`.

### Patch Changes

- b3f41d2: Close MD3 Navigation Drawer spec gaps: measurements, typography, motion, and states.

  **Container / Measurements**
  - Added `w-drawer` (360dp) class to `drawerVariants` — was accidentally absent despite the doc comment claiming it.
  - Standard variant now has `rounded-none` (square trailing edge, flush with viewport). Modal variant retains `rounded-r-lg` (16dp trailing corner per MD3). Both previously used `rounded-r-lg`.
  - Standard variant `z-50` stacking context added for correct overlay ordering.

  **Motion (Standard)**
  - Replaced legacy `duration-medium4 / ease-emphasized-decelerate / ease-emphasized-accelerate` slide tokens with `duration-spring-standard-default-spatial / ease-spring-standard-default-spatial` (spring, no overshoot) per md3-motion.mdc spatial navigation guidelines.
  - Standard slide direction: `translate-x-0` (open) / `-translate-x-full` (closed) via CVA `open` variant.

  **Motion (Modal — broken → fixed)**
  - Modal drawer enter/exit animation was broken: `{isOpen && ...}` immediately unmounted the panel/scrim, preventing any exit animation from playing.
  - Replaced with the library-standard animation state machine pattern (mirrors `BottomSheetHeadless` / `DialogHeadless`): `entering → visible → exiting → exited`.
  - Modal panel now renders via `createPortal` to `document.body` with a portal gate that only unmounts after `animationState === "exited"`.
  - Panel enter: `animate-md-slide-in-left` (spring-standard-default-spatial, 500ms). Exit: `animate-md-slide-out-left`. Applied via `drawerAnimationVariants` CVA + `getAnimationClassName` callback.
  - Scrim fade: CSS `transition-opacity` from `opacity-0` → `opacity-32` on enter, reversed on exit. Applied via `drawerScrimAnimationVariants`.
  - Both panel and scrim carry `data-animation-state` attribute for visual testing and potential CSS hooks.
  - `useReducedMotion()` gate: all animations suppressed when `prefers-reduced-motion: reduce` is active; `transition-none` appended to standard variant.

  **Typography**
  - `text-label-large` and `text-title-small` Tailwind classes apply only font-size and line-height (known Tailwind v4 theme limitation). Added explicit `font-medium` (weight 500) and `tracking-[0.1px]` to: `DrawerItem` root, `DrawerItemBadge`, `DrawerHeadline`, and section headers — matching the MD3 Label Large / Title Small specification.

  **States**
  - Focus state now shows both the outline ring (`outline-secondary`, WCAG 2.4.7) and a 10% state layer (`group-data-[focus-visible]/draweritem:opacity-10`), matching MD3 focus spec and the BottomSheet handle reference implementation.
  - Added explicit icon disabled color override: `group-data-[disabled]/draweritem:text-on-surface/38` on the icon slot (mirrors Menu icon pattern).

  **Exports**
  - Added: `drawerAnimationVariants`, `drawerScrimAnimationVariants`, `drawerScrimVariants`, `DrawerAnimationState`, `DrawerAnimationVariants`, `DrawerScrimAnimationVariants`, `DrawerScrimVariants`.
  - Removed: dead `drawerDividerVariants` (DrawerSection uses the shared `Divider` component), `scrimVariants` (renamed to `drawerScrimVariants` to avoid collision with DatePicker's export of the same name).
  - `HeadlessDrawerProps` extended with `getAnimationClassName` and `getScrimAnimationClassName` optional callbacks.

## 0.23.0

### Minor Changes

- 3308ff5: Add `MenuItemGroup` component — a sibling-aware grouping primitive for MD3 Expressive vertical menus.

  `MenuItemGroup` wraps related `MenuItem` elements in a semantic `role="group"` block and automatically inserts a 2dp MD3 Expressive gap between consecutive sibling groups (`menuStyle="vertical"`), so no manual `<MenuGap />` placement is required. An `aria-label` is required on every group to satisfy the ARIA `group` accessible-name requirement (WCAG 2.1).

  New exports from `@tinybigui/react`:
  - `MenuItemGroup` component (Layer 3)
  - `MenuItemGroupProps` type
  - `menuItemGroupVariants` CVA function
  - `MenuItemGroupVariants` type

- 3308ff5: **Menu**: fix MD3 Expressive segmented vertical menu rendering

  The vertical (`menuStyle="vertical"`) menu now correctly renders as the MD3 Expressive segmented model: groups of items form distinct rounded cards (16dp outer corners, 4dp inner corners) separated by transparent `MenuGap` spacers that reveal the page background — acting as visual dividers without a line.

  ### Changes
  - **Segmented corner rounding fixed** — uses adjacent-sibling CSS selectors relative to `[data-menu-gap]` elements (`[[data-menu-gap]+&]:rounded-t-lg`, `[&:has(+[data-menu-gap])]:rounded-b-lg`) so the top/bottom corners of each segment group are correctly rounded at 16dp while middle items use 4dp inner corners.
  - **Full-bleed highlight and state layer** — both slots are now `inset-0 rounded-[inherit]` so they always fill the item and respect whichever corner radius the item currently has.
  - **New focus-ring slot** — a dedicated `z-[2]` overlay with `outline-secondary` and `-outline-offset-2` renders the keyboard-focus indicator separately from the state layer, matching the MD3 Expressive reference state grid.
  - **Exact color token mapping applied**:
    - Standard: item bg `surface-container-low`; selected/active highlight `tertiary-container`; content `on-tertiary-container`
    - Vibrant: item bg `tertiary-container`; selected/active highlight `tertiary`; content `on-tertiary`
  - **Scheme-aware text colors** — trailing text, description (supporting text), and section headers now receive `colorScheme` from context and use the correct token (`on-surface-variant` / `on-tertiary-container`).
  - **Icon size corrected** — vertical leading icons use 20dp (`h-5 w-5`) per `SegmentedMenuTokens.ItemLeadingIconSize`.
  - **Vertical item height corrected** — density 0 → 48dp (`h-12`), -1 → 44dp (`h-11`), -2 → 40dp (`h-10`), -3 → 36dp (`h-9`).
  - **`menuItemFocusRingVariants` exported** from `@tinybigui/react` for advanced consumers.
  - **Storybook** — Expressive Vertical Menu story shows standard + vibrant side-by-side with a selected item; new _States_ story covers all 6 MD3 interaction states; new _Reference Example_ story matches the MD3 anatomy two-segment layout.

### Patch Changes

- 3308ff5: fix(button): move container background to child slot so disabled state overrides apply

  Tailwind `group-data-[disabled]/button:` generates a descendant combinator selector, so it cannot target the root `<button>` group host directly. Background color now lives on an absolutely-positioned `buttonContainerVariants` child span, matching the Switch track pattern and ensuring `group-data-[disabled]/button:bg-on-surface/12` wins over variant backgrounds. Elevation overrides on the root use self-targeting `data-[disabled]:` selectors for the same reason.

- 3308ff5: fix(menu): align Menu styling with component-variants.mdc slot architecture
  - Replace hardcoded `menu-enter`/`menu-exit` animations with `animate-md-scale-in`/`animate-md-scale-out` composite utilities (350ms expressive spring enter, 200ms emphasized-accelerate exit)
  - Remove `isDisabled`/`isSelected` CVA variant keys from `menuItemVariants`; interaction states are now driven by React Aria's native `data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-disabled` attributes via `group-data-[x]/menuitem` selectors
  - Add dedicated `menuItemStateLayerVariants` slot with hover 8% / focus+press 10% opacities using MD3 spring tokens (no more `before:` pseudo-element on the root)
  - Add `menuItemIconVariants` slot so leading/trailing icons recolor on selection in vertical/vibrant menus
  - Fix disabled treatment: per-slot `text-on-surface/38` instead of whole-item `opacity-38`
  - Update item typography: Body Large → Label Large per MD3 menu spec
  - Fix state-layer color transition to `duration-spring-standard-fast-effects ease-spring-standard-fast-effects`

  fix(menu): fire open/close motion on popover and inset expressive highlight
  - Add `menuPopoverVariants` CVA and apply to all three React Aria `<Popover>` elements (main trigger, submenu, context menu); RAC emits `data-entering`/`data-exiting`/`data-placement` on the Popover, not the inner RACMenu, so animation classes must live there
  - Strip dead `will-change`, `data-[entering]`, `data-[exiting]`, `origin-*`, and `motion-reduce:` classes from `menuContainerVariants` (those now belong exclusively to `menuPopoverVariants`)
  - Add `menuItemHighlightVariants` selected-background layer: `inset-0` (baseline) / `inset-1 rounded-lg` (vertical) — creates the inset, pill-shaped MD3 Expressive highlight matching the spec reference
  - Update `menuItemStateLayerVariants` geometry to be menuStyle-aware: baseline `inset-0 rounded-[inherit]`, vertical `inset-1 rounded-lg`
  - Remove `data-[selected]:bg-*` from `menuItemVariants` root; background now lives exclusively on the highlight layer
  - Render highlight → state layer → ripple → content DOM order in `MenuItem.tsx`; ripple container geometry also respects menuStyle

  fix(menu): align expressive vertical menu gap and spacing to MD3 segmented spec
  - `menuContainerVariants` vertical: transparent background (was `bg-surface-container-low`) — the container is now a clear overlay; group surface color moves onto individual items
  - `menuItemVariants` vertical: each item carries its own group surface (`bg-surface-container-low` / `bg-tertiary-container` vibrant) and CSS sibling selectors on `[data-menu-gap]` produce segmented corner rounding (leading group 16/8dp, trailing group 8/16dp, middle group 8/8dp), matching the MD3 Expressive segmented-group model (`SegmentedMenuTokens`)
  - `MenuGap`: height reduced from `h-2` (8dp) to `h-0.5` (2dp) matching `SegmentedMenuTokens.SegmentedGap = 2dp`; `data-menu-gap` attribute added to enable CSS sibling selectors for segmented rounding on adjacent items
  - `MenuItem` vertical height map: default density 0 = `h-11` (44dp) instead of `h-12` (48dp), matching `SegmentedMenuTokens.Item = 44dp`; density steps -1/-2/-3 adjusted accordingly (h-10/h-9/h-8)
  - `menuItemIconVariants` vertical: icon size `h-5 w-5` (20dp) matching `SegmentedMenuTokens.ItemLeadingIconSize = 20dp`; baseline stays `h-6 w-6` (24dp)
  - `menuItemHighlightVariants` vertical: `inset-x-1 inset-y-0 rounded-md` (horizontal-only 4dp inset, 12dp CornerMedium per `ItemSelectedShape`) — replaces `inset-1 rounded-lg`; selection no longer spans full width but fills item height eliminating vertical detachment
  - `menuItemStateLayerVariants` vertical: geometry updated to match highlight layer: `inset-x-1 inset-y-0 rounded-md`
  - `menuDividerVariants`: `my-0.5 mx-3` (2dp vertical, 12dp horizontal inset) for consistency with gap and vertical layout
  - All changes are vertical-only; baseline menu visuals, public API, and props are unchanged

## 0.22.0

### Minor Changes

- 5acff62: Dialog: MD3 Expressive motion, hero icon, scroll dividers, reduced-motion support

  **New features:**
  - `icon` prop on `Dialog` and `DialogHeadless` — renders a centered 24dp hero icon above the headline per MD3 spec. When present, headline and supporting text center-align automatically via `group-data-[with-icon]/dialog:text-center` (no extra props needed).
  - Scroll dividers in `DialogContent` — MD3 `border-outline-variant` dividers appear at the top and/or bottom of the scrollable area when content overflows. Managed by a `ResizeObserver` + scroll handler that sets `data-scroll-divider-top` / `data-scroll-divider-bottom` attributes.
  - `prefers-reduced-motion` support — all keyframe animations are suppressed when the user prefers reduced motion (via `useReducedMotion`). Dialog appears/disappears instantly. Mirrors the `BottomSheet` pattern.
  - `dialogIconVariants` exported from the package for consumers extending the headless layer.

  **Motion improvements:**
  - Replaced legacy `transition-[opacity,transform]` (mixing spatial + effects on one declaration) with composite `animate-md-*` keyframe utilities per `md3-motion.mdc`:
    - Basic enter: `animate-md-scale-in` (expressive-fast-spatial, 350ms)
    - Basic exit: `animate-md-scale-out` (emphasized-accelerate, 200ms)
    - Fullscreen enter: `animate-md-slide-in-bottom` (standard-default-spatial, 500ms)
    - Fullscreen exit: `animate-md-slide-out-bottom` (emphasized-accelerate, 200ms)
    - Scrim: `animate-md-fade-in` / `animate-md-fade-out`
  - Switched `onTransitionEnd` → `onAnimationEnd` with `e.target === e.currentTarget` guard so child element animations (e.g. button ripples) cannot accidentally advance the exit state machine.
  - Exit fallback timer bumped to 250ms (≥ longest exit animation duration).

  **Architecture:**
  - `dialogWrapperVariants` (previously dead code) is now computed in the styled `Dialog` layer and passed as `wrapperClassName` to `DialogHeadless`.
  - Scrim animation is state-driven via a new `getScrimClassName` prop on `DialogHeadless`.
  - `getAnimationClassName` prop on `DialogHeadless` enables reduced-motion gating at the styled layer without touching the headless primitive.
  - MD3 spacing aligned: 24dp panel padding, `mb-4` headline, `pt-3` actions.

## 0.21.1

### Patch Changes

- e5245f0: refactor(tooltip): slot-based MD3 styling, token and reduced-motion fixes
  - Rewrote `Tooltip.variants.ts` to use documented slot CVA functions, matching the Button/Switch architecture
  - Replaced the binary `isVisible` variant with a 3-state `animation` variant (`enter` | `exit` | `none`) that supports `prefers-reduced-motion`
  - Added rich tooltip slot variants: `richTooltipTitleVariants`, `richTooltipSupportingTextVariants`, `richTooltipActionsVariants`
  - Fixed MD3 token: rich tooltip subhead (title) now uses `text-on-surface-variant` per spec (was `text-on-surface`)
  - Added action row layout slot with correct `-ml-2 mt-3` alignment per MD3 spec
  - Added `prefers-reduced-motion` guard in `TooltipTrigger`: overlay unmounts immediately on close under reduced motion, fixing a stuck-mount bug where `animationend` never fires when CSS animations are suppressed
  - Added `reducedMotion` field to `TooltipAnimationContextValue` for consumer access
  - Extended test suite with 9 new tests covering token correctness and reduced-motion behaviour

## 0.21.0

### Minor Changes

- 1379c87: refactor(split-button): MD3 Expressive architecture, new variant + 5-size scale

  **BREAKING CHANGES**
  - `SplitButtonSize` values renamed to match the MD3 Expressive size scale:
    - `"small"` → `"xs"` (32dp)
    - `"medium"` → `"sm"` (40dp, new default)
    - `"large"` → `"md"` (56dp)
    - New: `"lg"` (96dp) and `"xl"` (136dp)
  - CVA export `splitButtonPrimaryVariants` renamed to `splitButtonLeadingVariants`.
  - CVA export `splitButtonDropdownVariants` renamed to `splitButtonTrailingVariants`.
  - Type `SplitButtonPrimaryVariants` renamed to `SplitButtonLeadingVariants`.
  - Type `SplitButtonDropdownVariants` renamed to `SplitButtonTrailingVariants`.

  **New features**
  - `variant="elevated"` added — `bg-surface-container-low` with `shadow-elevation-1` base, matching the Button elevated variant.
  - New CVA slot exports: `splitButtonStateLayerVariants`, `splitButtonFocusRingVariants`, `splitButtonLabelVariants`, `splitButtonIconVariants`, `splitButtonMenuVariants`, `splitButtonMenuItemVariants`.

  **Architecture improvements**
  - Variants-vs-States: all interaction states now use React Aria `useHover` / `useFocusRing` / `onPressStart`/`onPressEnd` → `data-*` attributes → `group-data-[x]/sb-leading` and `group-data-[x]/sb-trailing` Tailwind selectors. No interaction state logic lives in CVA.
  - Per-segment state layers (hover 8%, focus 10%, pressed 10%) and dedicated focus-ring spans, matching the Button component architecture.
  - MD3 Expressive inner-corner shape morphing: leading-right / trailing-left corners animate on hover/focus/press via a `--sb-inner-radius` CSS variable.
  - 2dp `gap-0.5` gap replaces the `border-l` visual divider.
  - Trailing segment receives `data-selected` when the dropdown menu is open.
  - `useReducedMotion` guard on all JS-driven chevron rotation and shape transitions.
  - Motion: `duration-expressive-fast-spatial` / `ease-expressive-fast-spatial` for border-radius; `duration-spring-standard-fast-effects` / `ease-spring-standard-fast-effects` for opacity and shadow.

## 0.20.0

### Minor Changes

- b80b94a: **Snackbar**: MD3 slot-based architecture refactor — visual and motion corrections

  **State-layer color fixes (MD3 spec compliance on inverse surface)**
  - Action button: replaced shared `Button` (state layer `bg-primary`) with a dedicated `SnackbarActionButton` slot using `bg-inverse-primary` state layer — the MD3-correct color for the inverse-surface container
  - Close icon button: replaced shared `IconButton` (state layer `bg-on-surface-variant`) with a dedicated `SnackbarCloseButton` slot using `bg-inverse-on-surface` state layer — the MD3-correct color

  **Close button sizing fix**
  - Close button was `size="medium"` (56dp), taller than the 48dp snackbar, causing overflow. Now 32dp (`size-8`) — fits within 48dp with 8dp margin on each side.

  **Motion migration to spring-standard tokens**
  - Enter/exit animation changed from legacy scale/zoom (`ease-emphasized-decelerate` + `duration-medium1`) to position-aware slide + fade using `duration-spring-standard-default-effects` (200ms enter) and `duration-spring-standard-fast-effects` (150ms exit)
  - Bottom positions slide up from below; top positions slide down from above
  - `prefers-reduced-motion`: translate suppressed — fade-only with no spatial motion

  **Other fixes**
  - `supportingText`: removed non-spec `opacity-80` reduction; now full `text-inverse-on-surface`
  - Two-line density: `min-h-[4.25rem]` (68dp) + `items-start` for two-line; `min-h-12` (48dp) + `items-center` for single-line

  **New exports** (action + close slot CVAs): `snackbarActionVariants`, `snackbarActionStateLayerVariants`, `snackbarActionFocusRingVariants`, `snackbarCloseVariants`, `snackbarCloseStateLayerVariants`, `snackbarCloseFocusRingVariants`, `snackbarCloseIconVariants` and their `VariantProps` types.

## 0.19.0

### Minor Changes

- 45d59aa: **Slider: MD3 Expressive architecture refactor with spring motion, range/vertical layout fixes, and vertical orientation improvements**

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

## 0.18.0

### Minor Changes

- 4cf98eb: refactor(search): md3 expressive variants-vs-states architecture

  Aligns the Search component with the project-wide Variants-vs-States architecture used by Button and Switch:
  - Rebuilds `Search.variants.ts` into per-slot CVAs (root, stateLayer, focusRing, leadingIcon, trailingAction, avatar, input for the bar; container, header, backButton, clearButton, input, divider, content for the view). Removes interaction-state CVA variants (`focused`, `disabled`, `noActions`) — all states now driven by `data-*` attributes via `group-data-[x]/search` selectors.
  - Refactors `SearchBar.tsx` to use React Aria `useHover` + `useFocusRing({ within: true })` + `getInteractionDataAttributes`, with a sibling focus-ring span (outside `overflow-hidden`) matching the Button/Switch pattern. The M3 Expressive pane-margin transition (24dp → 12dp on focus) now uses the correct Expressive fast spatial spring token, guarded by `useReducedMotion`.
  - Refactors `SearchView.tsx` to apply per-slot CVAs directly instead of descendant-selector `[&>[data-slot=...]]` blobs and the `getHeaderClasses()` helper. Enter motion is layout-aware: docked → `animate-md-scale-in`, fullscreen → `animate-md-fade-in`.
  - Replaces literal `←` back glyph and `✕` clear glyph in `SearchHeadless.tsx` with inline MD3 SVG icons (24×24, `currentColor`, `aria-hidden`).
  - Updates `SearchViewHeadless` to accept per-slot `className` props so styled classes are applied directly on each element.
  - Updates tests to assert on the new slot elements and data-attribute–driven class names.

## 0.17.0

### Minor Changes

- ed870e2: Radio: align styling with MD3 Expressive variants-vs-states architecture

  Rewrites the Radio component visual layer to match the Switch component's architecture:
  - All interaction/selection/error states are now driven by `group-data-[x]/radio` Tailwind selectors on the root label — no state variants or compoundVariants in CVA.
  - Replaces the SVG + `animate-pulse` focus ring with div-based slots (state layer, outer ring, inner dot, MD3 focus ring) using proper MD3 spring motion token pairs (`spring-standard-fast-effects` for color/opacity, `spring-standard-fast-spatial` for dot scale).
  - Fixes `isInvalid` forwarding in `RadioGroup` so `data-invalid` is correctly emitted on individual Radio elements.
  - Inner dot animates scale 0→1 on selection using the spatial spring token.

## 0.16.0

### Minor Changes

- 69806d2: feat(progress): MD3 Expressive refactor — colorful tokens, gap, wavy shape, thick track

  **Visual changes (non-breaking by default)**
  - Inactive track color changed from `surface-container-highest` to `primary-container` (MD3 Expressive "colorful" style). Consumers relying on the specific old token will see a visual difference.
  - 4dp indicator-track gap introduced between the active and inactive segments (linear + circular). The linear track now renders as two sibling segments rather than an `overflow: hidden` clipping approach.
  - Stop indicator dot updated to 4dp (`size-1`) — previously `w-1 h-1` which was already 4px.
  - Circular inactive track is now always visible in `primary-container` color (previously transparent/hidden in many states).
  - Determinate transition updated from `duration-medium4 ease-standard` (legacy tokens) to `duration-spring-standard-default-spatial ease-spring-standard-default-spatial` (spring motion tokens). Progress updates now feel smoother and consistent with other components.

  **New props**
  - `shape?: "flat" | "wavy"` (default `"flat"`) — wavy uses an SVG sine-wave active indicator. Automatically falls back to flat when `prefers-reduced-motion: reduce` is set.
  - `thickness?: "default" | "thick"` (default `"default"`) — thick renders an 8dp track per the MD3 Expressive thick variant.

  **Architecture**
  - `Progress.variants.ts` rewritten as slot-based CVA blocks following the Button/Switch/Tabs pattern.
  - `progressInactiveSegmentVariants` added (new export) for the gap-based inactive track segment.
  - `progressIndicatorVariants` kept as a backward-compat alias for `progressActiveIndicatorVariants`.
  - `ProgressHeadless` `renderProgress` state now includes `shape` and `thickness`.

## 0.15.0

### Minor Changes

- 193d76a: Refactor List to Variants-vs-States architecture with MD3 state layers, focus ring, and spring motion
  - Move all interaction/selection state out of CVA variant keys into data-\* attributes + group-data-[x]/list-item slot selectors (matches Button, Tabs, Switch pattern)
  - Add dedicated state layer span with MD3 spring-standard-fast-effects motion (opacity 8/10/10 for hover/focus/pressed)
  - Add keyboard focus ring span (outline-secondary, inset-0, opacity transition)
  - Replace scoped `group` with named `group/list-item` to prevent style leakage
  - Use `getInteractionDataAttributes` helper for consistent presence-based encoding
  - Propagate selected/disabled colors to leading, trailing, overline, headline, and supporting text slots via group-data selectors
  - Convert ListItemLeading, ListItemTrailing, ListItemText to slot CVAs
  - Fix ListDensity JSDoc: correct min-heights to 56/72/88dp (was 48/64dp)
  - Remove unused per-item `onAction` from `ListItemProps` (List-level `onAction` is the correct API)
  - Export all new slot CVA variants and VariantProps types

## 0.14.0

### Minor Changes

- 54af3fb: feat(textfield)!: rebuild TextField to strict MD3 Expressive specs

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

## 0.13.0

### Minor Changes

- e4dbe4b: Refactor DatePicker to MD3 Expressive two-axis slot architecture

  **Breaking changes:**
  - Removed `cellType` and `state` CVA variant axes from `calendarCellVariants` and `yearItemVariants`. These were dead code and violated the component-variants rule by putting runtime interaction states in CVA. All cell states (today, selected, range-start, range-end, range-middle, outside-month, disabled, unavailable) are now driven by presence-based `data-*` attributes on the element and consumed by `group-data-[x]` selectors.
  - Removed old exported variant names: `datePickerHeaderVariants`, `datePickerNavVariants`, `datePickerDividerVariants`, `datePickerActionVariants`, `datePickerActionButtonVariants`, `datePickerWeekdayVariants`, `datePickerRangeIndicatorVariants`, `datePickerHeadlineVariants`, `datePickerSupportingTextVariants`, `datePickerScrimVariants`.
  - Removed `CalendarCellProps.cellType` prop (the semantic `CalendarCellType` type is retained for documentation).

  **New exports:**

  Layer-3 styled slot components (injectable into the headless layer):
  - `StyledCalendarCell`, `StyledNavButton`, `StyledCalendarTitle`, `StyledYearItem`, `StyledWeekday`, `StyledActionButton`

  New CVA slot variants following the two-axis model:
  - `calendarCellVariants` + `calendarCellStateLayerVariants` + `calendarCellFocusRingVariants`
  - `navButtonVariants` + `navButtonStateLayerVariants` + `navButtonFocusRingVariants`
  - `calendarTitleVariants` + `calendarTitleStateLayerVariants`
  - `yearItemVariants` + `yearItemStateLayerVariants` + `yearItemFocusRingVariants`
  - `weekdayVariants`, `calendarDividerVariants`, `actionRowVariants`
  - `actionButtonVariants` + `actionButtonStateLayerVariants` + `actionButtonFocusRingVariants`
  - `modalDialogVariants`, `modalHeaderVariants`, `headlineVariants`, `supportingTextVariants`
  - `modeToggleVariants` + `modeToggleStateLayerVariants`
  - `scrimVariants`, `dateInputFieldVariants`, `dateInputFieldGroupVariants`
  - `dockedFieldGroupVariants`, `dockedTriggerVariants` + `dockedTriggerStateLayerVariants`
  - `popoverVariants`

  New slot injection API — `CalendarCore` now accepts a `slots` prop:
  - `slots.CellComponent` — styled calendar date cell
  - `slots.NavButtonComponent` — styled prev/next month nav button
  - `slots.TitleComponent` — styled month/year title pill
  - `slots.YearItemComponent` — styled year selection item
  - `slots.WeekdayComponent` — styled weekday header label

  `DatePickerActions` accepts a `ButtonComponent` slot for styled action buttons.

  **Architecture:**

  Replaces three large duplicated `[&_[data-x]]:` descendant-selector blobs in the `*Styled.tsx` wrappers with injected styled slot components. Only purely structural, non-interactive layout wrappers (popover panel, modal dialog, field group, action row container, header row, year grid container) retain a minimal consolidated structural selector string — acceptable for non-interaction-state layout. Motion remains `useReducedMotion`-gated; screen-level container transitions use legacy standard tokens; small interactive elements (`< 48dp`) use spring-standard-fast tokens.

### Patch Changes

- e4dbe4b: fix(date-picker): popover anchoring, grid centering, and modal/scrim positioning
  - **Popover anchor**: `usePopover` now anchors to the `[data-field-group]` element
    (the full outlined field) instead of the calendar icon button, so the calendar
    popover opens directly below the date field as per MD3 spec.
  - **Calendar grid centering**: Added `[&_table]:mx-auto` to `CALENDAR_GRID_STRUCTURAL`
    so the fixed-width 336px grid is equally inset within the 360px container.
  - **Modal/scrim positioning fix**: `className` is now applied directly on
    `[data-modal-dialog]` using `modalDialogVariants` (providing `fixed` centering
    immediately), and `scrimClassName` is applied directly on `[data-scrim]` via a
    new headless prop. Previously both used descendant selectors that never matched —
    the dialog rendered in-flow and the scrim was invisible.
  - **New internal exports**: `MODAL_CONTENT_STRUCTURAL`, `MODAL_INPUT_CONTENT_STRUCTURAL`,
    `MODAL_DIALOG_MOTION` in `datePickerStructuralStyles.ts`.
  - **Story polish**: Raised `iframeHeight` to 720 and `min-h` to 600px so open
    docked/modal stories are never clipped in Storybook autodocs.

## 0.12.0

### Minor Changes

- 8e60f75: refactor(divider)!: slot-based CVA, CSS-var thickness, logical RTL insets; remove subheader label

  **BREAKING CHANGES:**
  - `label` prop removed from `Divider`. The subheader variant (text centered between two rules) was not part of the MD3 divider spec and has been removed.
  - Inset variants now use logical inline properties (`margin-inline-start` / `margin-inline-end`) instead of physical margins. This is a visual change only in RTL layouts.

  **What changed:**
  - Styling switched from `border-*` to a background-fill approach (`bg-outline-variant`) on a zero-border element. Matches the `@material/web` `MdDivider` implementation.
  - Thickness is now controlled by the `--md-divider-thickness` CSS custom property (default `1px`, MD3 1dp). Override per instance: `<Divider style={{ "--md-divider-thickness": "2px" }} />`.
  - `Divider.variants.ts` rewritten following the documented slot-CVA architecture used by Button and Switch (spec header comment, array-form base, explicit `defaultVariants`).
  - `DividerHeadless` simplified — `label` and `children` props removed from the interface.
  - All MD3 design token classes (no arbitrary values).
  - 22 tests cover orientation, insets, bg token, ref forwarding, and axe accessibility.

## 0.11.2

### Patch Changes

- 1aeb698: refactor(tabs): MD3 Expressive styling refactor — Variants-vs-States architecture, correct state-layer/indicator tokens, spring motion, content-width primary indicator

## 0.11.1

### Patch Changes

- 548322d: **Card:** align styling, motion, and tokens with MD3 spec
  - **fix:** `CardMedia` `aspectRatio="4/3"` was incorrectly rendered at 16:9 (`aspect-video`); now renders at the correct 4:3 ratio (`aspect-[4/3]`)
  - **refactor:** card motion transitions switch from the `fast` tier to the `default` tier (`duration-spring-standard-default-effects` / `ease-spring-standard-default-effects`, 200ms) per MD3's standard-size component rule (cards are standard-size, alongside dialogs/menus)
  - **refactor:** root transition broadened from `transition-shadow` to `transition-[box-shadow,opacity,border-color]` so disabled fades and outlined border-color changes animate correctly
  - **style:** `CardHeader` headline typescale refined from `title-large` to `title-medium` for correct MD3 card density
  - **feat:** `cardStateLayerVariants` and `cardFocusRingVariants` (plus their `VariantProps` types) are now exported from the package, matching Button/Switch/FAB export parity

## 0.11.0

### Minor Changes

- 3d312de: feat(bottomsheet): refactor handle to Variants-vs-States architecture with MD3 state layer

  Refactors the BottomSheet drag handle to match the Button/Switch component pattern:
  - **Handle state layer**: new `bottomSheetHandleStateLayerVariants` slot — semi-transparent ring driven by `data-*` attributes. Opacities follow MD3 spec: hover 8%, focus/pressed 10%, dragged 16%.
  - **Handle focus ring**: new `bottomSheetHandleFocusRingVariants` slot — opacity-driven `outline-secondary` overlay replacing the previous raw `focus-visible:ring-*` utility classes. Avoids clipping by the container's `overflow-hidden`.
  - **Handle pill**: removed non-token `opacity-40`; `on-surface-variant` is already a low-emphasis color role and requires no opacity override per MD3 spec.
  - **React Aria wiring**: `useHover` and `useFocusRing` now drive `data-hovered` and `data-focus-visible` on the handle wrapper via `getInteractionDataAttributes`. The wrapper carries `group/handle` so all child slots consume state via `group-data-[x]/handle:` selectors.
  - **Presence-based encoding**: all `data-dragging` attributes (panel + handle) now use ternary encoding (`isDragging ? "" : undefined`) per component-variants architecture rule.
  - Exports two new variant functions (`bottomSheetHandleStateLayerVariants`, `bottomSheetHandleFocusRingVariants`) and their corresponding types.

## 0.10.0

### Minor Changes

- 9a855bf: **AppBar: M3 Expressive Flexible architecture refactor**

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

## 0.9.0

### Minor Changes

- d869fd7: **chip: MD3 Expressive refactor — slot-based architecture, token corrections, new elevated support**

  ### Architecture

  The Chip component has been rewritten to follow the same slot-based "Variants vs States"
  architecture used by `Button` and `Switch`:
  - All interaction/selection states are now driven by `data-*` attributes set via
    `getInteractionDataAttributes` and consumed by each slot via `group-data-[x]/chip`
    Tailwind selectors — no state values in CVA variants.
  - `useHover`, `useFocusRing`, and `isPressed` (via press lifecycle callbacks) are now
    tracked in `Chip.tsx` and threaded to `ChipHeadless` via `bodyPassthrough` and
    `removePassthrough`.
  - Dedicated focus ring slot (`chipFocusRingVariants`) rendered outside `overflow-hidden`
    so it extends 3px beyond the chip boundary and is never clipped.
  - Remove button gets its own `group/chip-remove` scope with an independent circular
    state layer (`chipRemoveStateLayerVariants`).
  - Spring motion tokens throughout: `ease-spring-standard-fast-effects` for
    color/opacity/shadow; `ease-spring-standard-fast-spatial` for the filter checkmark
    width animation.

  ### MD3 Token Corrections

  Per-type color tokens now match the MD3 Expressive spec exactly:

  | Type                  | Container             | Border            | Label                    | Leading icon             |
  | --------------------- | --------------------- | ----------------- | ------------------------ | ------------------------ |
  | `assist`              | transparent           | `outline`         | `on-surface`             | **`primary`**            |
  | `filter` (unselected) | transparent           | `outline`         | `on-surface-variant`     | `on-surface-variant`     |
  | `filter` (selected)   | `secondary-container` | none              | `on-secondary-container` | `on-secondary-container` |
  | `input`               | transparent           | `outline-variant` | `on-surface-variant`     | `on-surface-variant`     |
  | `suggestion`          | transparent           | `outline`         | `on-surface-variant`     | `on-surface-variant`     |

  ### New Features
  - **Elevated surface for all chip types** — `surface="elevated"` now works on `filter`
    and `input` chips in addition to `assist` and `suggestion`.

  ### Breaking Changes (pre-1.0 minor)
  - **`surface` default changed from `"tonal"` to `"flat"`**. If you relied on the
    default, add `surface="elevated"` explicitly if you want the elevated style, or
    omit `surface` / use `surface="flat"` for the MD3 default transparent outlined style.
  - **`surface="tonal"` is deprecated.** It maps to `"flat"` internally and emits a
    `console.warn` in non-production environments. Migrate: replace `surface="tonal"` with
    `surface="flat"` (or simply omit `surface`).

  ### New Exports

  ```ts
  // Slot variant functions
  (chipStateLayerVariants,
    chipFocusRingVariants,
    chipLeadingIconVariants,
    chipTrailingIconVariants,
    chipCheckmarkVariants,
    chipCheckmarkIconVariants,
    chipLabelVariants,
    chipRemoveButtonVariants,
    chipRemoveStateLayerVariants);

  // Variant prop types
  (ChipStateLayerVariants, ChipLeadingIconVariants);

  // Passthrough prop types (for advanced headless usage)
  (ChipBodyPassthroughProps, ChipRemovePassthroughProps);
  ```

## 0.8.1

### Patch Changes

- a3f3f4d: refactor(checkbox): migrate to MD3 Variants-vs-States architecture

  Rewrites Checkbox styling to match the slot-based CVA pattern used by Switch:
  - All interaction/selection states (hover, focus-visible, pressed, selected, disabled, invalid, indeterminate) are now expressed as `data-*` attributes on the root element via `getInteractionDataAttributes`, consumed by `group-data-[x]/checkbox` Tailwind selectors in each slot — no state variants or state compoundVariants in CVA.
  - Replaces the `animate-pulse` SVG focus ring with a proper MD3 focus-ring slot (outline, opacity transition via `*-spring-standard-fast-effects`).
  - Replaces hardcoded `duration-200` with MD3 motion token pairs: effects transitions use `*-spring-standard-fast-effects`, spatial transitions use `*-spring-standard-fast-spatial`.
  - State-layer opacities corrected to MD3 spec: hover 8% (`opacity-8`), focus/pressed 10% (`opacity-10`).
  - Box visual now uses a `div` with `border-2 rounded-[2px]` + inline SVG icons, matching the Switch div-slot pattern.
  - Invalid and disabled color cascades use doubly-chained `group-data` selectors for correct CSS specificity ordering.
  - Exports updated to new slot variant names (`checkboxRootVariants`, `checkboxControlVariants`, `checkboxStateLayerVariants`, `checkboxFocusRingVariants`, `checkboxBoxVariants`, `checkboxIconVariants`, `checkboxLabelVariants`).

  No behavioral or API changes — `CheckboxProps` and React Aria integration are unchanged.

## 0.8.0

### Minor Changes

- ff26d45: **Badge: align with MD3 spec and variants/states architecture (breaking)**

  Removes the non-spec `color` prop (and `BadgeColor` type) from `Badge`, `BadgeContent`, and `DrawerItemBadgeConfig`. The MD3 badge specification defines only the error color role (`bg-error` / `text-on-error`), which is now hardcoded in the CVA base.

  **Migration:** Remove any `color` prop usage from `<Badge>` and `<DrawerItem badge={{ color: … }}>`.

  **Styling changes:**
  - Migrates from CVA variant keys for `size`, `color`, `invisible`, and `reducedMotion` to the variants-vs-states architecture used by Button and Switch.
  - Dot vs count is now a content flag (`data-dot`) set directly on the element; visibility is a runtime flag (`data-invisible`).
  - Show/hide animation uses MD3 Expressive spatial token pair (`duration-expressive-fast-spatial` + `ease-expressive-fast-spatial`) instead of mixed scale+opacity transitions.
  - Reduced-motion guard applied at the component level (conditional class, not a CVA variant).

### Patch Changes

- ff26d45: fix(badge): anchor indicator to icon corner per MD3 spec

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

## 0.7.0

### Minor Changes

- 8eaeb6f: **BREAKING** `FABMenu`: redesign action items to MD3 Expressive pill buttons

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

## 0.6.0

### Minor Changes

- 4a422b9: refactor(fab): M3 Expressive refactor — slot architecture, new size scale, solid colors

  **Breaking changes (pre-1.0 minor bump):**
  - Default `size` changed from `"medium"` to `"fab"`. Update `size="medium"` if you relied on the 56dp size — it now renders the 80dp M3 Expressive Medium FAB.
  - `size="medium"` now renders a **80dp** container (M3 Expressive Medium FAB), not 56dp.
  - Default `color` changed from `"primary"` to `"primary-container"`. The old `color="primary"` is now a **solid** color style (`bg-primary / text-on-primary`).
  - `color="secondary"` and `color="tertiary"` are now **solid** styles (bg-secondary / bg-tertiary).

  **New features:**
  - `size="fab"` (56dp) — new canonical default size.
  - `size="medium"` (80dp) — M3 Expressive Medium FAB with 20dp corners and 28dp icon.
  - `color="primary-container"` / `"secondary-container"` / `"tertiary-container"` — container color styles (previous default behaviour).
  - `color="primary"` / `"secondary"` / `"tertiary"` — new solid color styles (M3 Expressive).
  - Dedicated focus-ring slot (`inset-[-3px]`, keyboard-only, never clipped).
  - Dedicated state-layer slot with correct opacities: hover 8% / focus 10% / pressed 10%.
  - State-layer color matches icon/on-color per MD3 spec.
  - Elevation 3 base → 4 hover → 3 focus/pressed per MD3 spec.
  - `useHover` + `useFocusRing` + `isPressed` via React Aria — full `group-data-[x]/fab` attribute system.
  - MD3 motion tokens (`duration-spring-standard-fast-effects`, `ease-spring-standard-fast-effects`) replace hardcoded `duration-200`.

  **Deprecated (functional, with dev warning):**
  - `size="small"` — use `size="fab"` instead.
  - `color="surface"` — use `color="primary-container"` instead.

## 0.5.0

### Minor Changes

- 692d699: refactor(icon-button): M3 Expressive sizing system, Variants-vs-States architecture, press shape-morph

  **Breaking changes:**
  - `size` prop values renamed to the M3 Expressive 5-tier system. Map your existing values as follows:
    - old `small` (32dp) → new `xsmall`
    - old `medium` (40dp) → new `small`
    - old `large` (48dp) → new `medium`
    - new `large` (96dp) and `xlarge` (136dp) are added

  **New props:**
  - `width: 'narrow' | 'default' | 'wide'` — adjusts container width relative to height (default: `'default'`)
  - `shape: 'round' | 'square'` — `round` = circular (default); `square` = MD3 size-tiered corner radius
  - `selectedIcon: React.ReactNode` — icon shown when a toggle button (`selected` prop defined) is in the ON state

  **Improvements:**
  - Migrated to the Variants-vs-States architecture (same pattern as `Switch`): all interaction and selection states are driven by `data-*` attributes emitted by `IconButtonHeadless` and consumed by slot CVA classes via `group-data-[x]/icon-button` selectors — no state variants in CVA
  - `IconButtonHeadless` now runs `useHover` + `useFocusRing` and emits `data-hovered`, `data-focus-visible`, `data-pressed`, `data-selected`, `data-disabled`, `data-toggle` via `getInteractionDataAttributes`
  - MD3-correct state layers: per-variant overlay color via `--ib-sl` CSS variable, hover 8% / focus-visible 10% / pressed 10% opacity
  - MD3-correct disabled: icon content `text-on-surface/38`; filled/tonal containers collapse to `bg-on-surface/12`; outlined border collapses to `border-on-surface/12`
  - Press shape-morph: `round` shape springs to size-tiered square corners on press via `data-[pressed]:rounded-[var(--ib-radius-press)]` + expressive-fast-spatial easing
  - Toggle-off filled/tonal: correct `surface-container-highest` background per MD3 Flutter spec
  - Slot-based CVA with CSS role variables (`--ib-bg`, `--ib-bg-off`, `--ib-bg-on`, `--ib-fg`, `--ib-fg-off`, `--ib-fg-on`, `--ib-sl`, `--ib-border`, `--ib-radius`, `--ib-radius-press`) for clean variant × state separation
  - New exports: `iconButtonRootVariants`, `iconButtonStateLayerVariants`, `iconButtonIconVariants`, `IconButtonWidth`, `IconButtonShape`

## 0.4.2

### Patch Changes

- 7e5661f: Refactor Button, ButtonGroup, and IconButton to align with MD3 specs — adopt variants-vs-states architecture with data-attribute interaction layers, remove non-spec `color` prop, correct size heights and state layer opacities, and enhance ripple and focus ring behavior.

## 0.4.1

### Patch Changes

- 6021b03: Fix Switch component styling to match MD3 specs — correct track alignment, refactor variant system to reduce CVA combinatorial explosion, and add shared interaction state utilities for consistent hover/focus/pressed styling.

## 0.4.0

### Minor Changes

- cfd9af7: feat(badge): add MD3 Badge component with dot and count variants, error/primary colors, and composable overlay wrapper
- 9b89f1d: feat(bottom-sheet): add MD3 Bottom Sheet component with standard and modal variants, draggable snap-point handle, and keyboard accessibility
- 42db9f8: Add MD3 ButtonGroup component with connected button layout, single and multi-select selection modes, and ButtonGroupContext for propagating variant/size to child buttons. Modularize @tinybigui/tokens into focused CSS files: color.css, elevation.css, motion.css, shape.css, theme.css, and typography.css, each available as a standalone import alongside the combined tokens.css.
- a9be72e: feat(card): add MD3 Card component with elevated, filled, and outlined variants, composable sub-components, and interactive mode with ripple and state layer
- a9be72e: feat(chip): add MD3 Chip component with Assist, Filter, Input, and Suggestion types, ChipSet container, and MD3 animations
- b005db0: feat(date-time-pickers): add MD3 Date Picker and Time Picker components with docked, modal, and input variants, range selection, 12h/24h clock dial, and full accessibility
- 8efcd34: feat(divider): add MD3 Divider component with horizontal/vertical orientations, inset variants, and subheader label support
- 1877960: feat(fab-menu): add MD3 FAB Menu speed-dial component with stagger animation and direction variants
- e76fb76: feat(list): add MD3 List component with static and interactive modes, slot-based sub-components, selection management, and Divider integration
- 5c40b1e: feat(drawer): enhance MD3 Navigation Drawer with section dividers, badge support on items, active indicator polish, scrim animation, and icon-only mode
- 17a1813: feat(search): add MD3 Search component with SearchBar and SearchView overlay, portal rendering, and suggestions slot
- 47912be: feat(slider): add MD3 Slider component with standard, centered, and range variants, five size presets, vertical orientation, discrete stops, value indicator, and inset icon
- 5c3dd3e: feat(split-button): add MD3 Split Button component composing Button and Menu with filled, tonal, and outlined variants
- 762e0cc: feat(tooltip): add MD3 Tooltip and RichTooltip components with portal rendering, smart positioning, 300ms hover delay, and MD3 entry/exit animations

### Patch Changes

- 4850568: Fix AppBar component — resolve missing style gaps, correct Tailwind utilities generation, and expand AppBar stories and test coverage. Refine token layer by extracting a `preset.css` for token presets, and update `theme.css`/`tokens.css` to clean up the semantic layer structure. Add THEMING guide and update README with usage documentation.

## 0.3.0

### Minor Changes

- Add MD3 Dialog component with basic and fullscreen variants, composable `DialogHeadline`, `DialogContent`, and `DialogActions` slots, focus trap, Escape-to-dismiss, and WCAG 2.1 AA accessibility via React Aria `useDialog`/`useOverlay`.
- Add MD3 Menu component with `MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, and `MenuDivider`; full keyboard navigation (arrows, Home/End, Enter/Space, type-ahead); single and multi-select modes; and WCAG 2.1 AA accessibility via React Aria collections.
- 5f22cde: Add `ContextMenuTrigger`, `SubmenuTrigger`, and `MenuGap`; expand headless menu primitives and types; update menu styles and stories.
- Add MD3 Progress Indicator component with linear and circular variants, determinate and indeterminate modes, full WCAG 2.1 AA accessibility via `role="progressbar"`, and three-layer architecture (React Aria → Headless → Styled).
- Add MD3 Snackbar component with `SnackbarProvider`, imperative `useSnackbar` hook, auto-dismiss timer, pause-on-hover/focus, action button support, multi-position placement, and WCAG 2.1 AA live-region accessibility.
- 7cfb578: Add snackbar stacking with per-position queues and configurable `maxVisible` on `SnackbarProvider`; move layout positioning into the portal stack container; refine enter and exit animations; expose `--spacing-snackbar-max` in token CSS.

## 0.2.0

### Minor Changes

- dcc0b60: Add MD3 Top App Bar component with four size variants (small, center-aligned, medium, large), composable navigation and action icon slots, scroll-triggered elevation, and useScrollElevation hook. Add typography, motion, easing, and spacing token mappings to Tailwind @theme.
- b044688: Add MD3 Navigation Drawer component with modal and standard variants, composable DrawerItem and DrawerSection slots, scrim overlay, focus trap, and WCAG 2.1 AA accessibility using React Aria's useDialog/useOverlay hooks.
- 67768ae: feat(navigation-bar): add MD3 Navigation Bar (Bottom Navigation) component

  Implements the Material Design 3 Navigation Bar component with full
  accessibility support, three-layer architecture, and TDD.

  **Features:**
  - `NavigationBar` — fixed bottom bar, 3–5 destination items, MD3 styled
  - `NavigationBarItem` — standalone styled item with animated indicator pill
  - `HeadlessNavigationBar` — headless layer using React Aria's `useTabList`/`useTabListState`
  - `HeadlessNavigationBarItem` — headless item using React Aria's `useTab`/`useFocusRing`

  **Highlights:**
  - Animated active indicator pill (MD3 motion tokens: `duration-medium2`, `ease-emphasized`)
  - Badge support: dot indicator, numeric count, "999+" truncation, hidden at 0
  - `hideLabels` prop for icon-only mode (requires `aria-label` per WCAG)
  - Controlled (`activeKey`/`onActiveChange`) and uncontrolled (`defaultActiveKey`) usage
  - Full keyboard navigation: Arrow Left/Right, Home, End, roving `tabIndex`
  - WCAG 2.1 AA: `role="navigation"` + `aria-label`, `role="tablist"`, `role="tab"` + `aria-selected`
  - Dev warning for item count outside 3–5 range
  - Ripple effect via `useRipple`
  - State layers: hover `opacity-8`, pressed `opacity-12`
  - 46 unit/integration tests including axe accessibility audit

- b044688: Add MD3 Tabs component with Primary and Secondary variants, composable Tab and TabPanel slots, animated active indicator, full keyboard navigation (Arrow Left/Right, Home, End), and WCAG 2.1 AA accessibility using React Aria's useTabList/useTab hooks.

## 0.1.1

### Patch Changes

- 9a84c28: fix misleading pre-release language in npm readme

## 0.1.0

### Minor Changes

- 89f418f: Initial release with 7 MD3 components: Button, IconButton, FAB, TextField, Checkbox, Switch, Radio
