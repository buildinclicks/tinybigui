import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Switch Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no state variants, no state compoundVariants).
 * - All interaction/selection states are driven by data-* attributes on the root via
 *   group-data-[x]/switch Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-icon) are set explicitly by the component, not via helper.
 * - The root element sets inherited CSS variables for dynamic geometry.
 *
 * Slot responsibilities:
 *   switchRootVariants        — label wrapper; carries `group/switch`; sets --switch-handle-size
 *   switchTrackVariants       — 52×32dp pill background; owns color/border
 *   switchHandleContainerVariants — movement only (translate-x); hosts state layer
 *   switchStateLayerVariants  — hover/focus/pressed opacity ring
 *   switchHandleVariants      — size + color only (no positioning)
 *   switchIconVariants        — icon container inside handle
 *   switchLabelVariants       — text label next to track
 *
 * MD3 Spec:
 *   Track: 52×32dp, border-radius 16dp (full), 2dp border
 *   Handle: 16dp unselected | 24dp selected / with-icon | 28dp pressed
 *   State-layer container: 40dp, centered on handle
 *   State-layer opacities: hover 8% | focus 10% | pressed 10% | dragged 16%
 *   Disabled: container 12% opacity, content 38% opacity
 */

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Root label wrapper — carries `group/switch` and handle geometry variables.
 *
 * Sets --switch-handle-size as an inherited CSS variable so both the container
 * and the handle slot can consume it without coupling. Priority order (last wins
 * in CSS cascade at equal specificity): base → selected → with-icon → pressed.
 */
export const switchRootVariants = cva([
  "relative inline-flex items-center cursor-pointer select-none",
  // Interaction states are styled via group-data on children.
  // Root's own disabled state must use self-targeting data-[x]: selectors.
  "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  "data-[disabled]:opacity-38",
  // ── Handle size CSS variable ──────────────────────────────────────────────
  // Set via self-referential data-[x]: so all child slots inherit the value.
  // "data-[selected]" and "data-[with-icon]" have specificity (0,1,0).
  // "data-[pressed]:data-[pressed]:" doubles the attribute selector → (0,2,0),
  // guaranteeing it always wins regardless of Tailwind's CSS output order.
  "[--switch-handle-size:1rem]", // 16dp base
  "data-[selected]:[--switch-handle-size:1.5rem]", // 24dp selected
  "data-[with-icon]:[--switch-handle-size:1.5rem]", // 24dp with icon
  "data-[pressed]:data-[pressed]:[--switch-handle-size:1.75rem]", // 28dp pressed — doubled for higher specificity
]);

// ─── TRACK ────────────────────────────────────────────────────────────────────

/**
 * Track — the 52×32dp pill background rail.
 * Owns background color, border color, and focus outline.
 * overflow-hidden clips the state-layer ring to the pill shape.
 */
export const switchTrackVariants = cva([
  "relative flex items-center w-13 h-8 rounded-full border-2",
  // Effects transition (color — no spatial overshoot)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Unselected (base)
  "bg-surface-container-highest border-outline",
  // Selected
  "group-data-[selected]/switch:bg-primary group-data-[selected]/switch:border-primary",
  // Disabled (overrides selected via higher cascade position + same specificity)
  "group-data-[disabled]/switch:bg-on-surface/12 group-data-[disabled]/switch:border-on-surface/12",
]);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring overlay (sibling of the track, outside overflow-hidden).
 * Renders as an absolutely-positioned outline so it sits above the track
 * border without being clipped.
 *
 * Replaces the non-MD3 animate-pulse ring from the previous implementation.
 */
export const switchFocusRingVariants = cva([
  // Sits outside the track's overflow-hidden by being rendered as a sibling,
  // not a child — see Switch.tsx for the relative wrapper structure.
  "pointer-events-none absolute inset-[-3px] rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/switch:opacity-100",
]);

// ─── HANDLE CONTAINER ────────────────────────────────────────────────────────

/**
 * Handle container — movement only.
 *
 * Fixed 40dp circle (MD3 state-layer size), absolutely centred on the handle
 * position. Translates horizontally via group-data-[selected].
 *
 * Geometry:
 *   -left-1.5 → container left edge at –6px from track inner-left. (2dp border + 4px gap)
 *   Container center (40dp/2=20) at –4+20 = 16px from track inner-left.
 *   Handle 16dp: center at 16px (symmetric gap of ~0px from inner-left arc) ✓
 *   translate-x-5 (+20px): center at 36px from inner-left.
 *   Handle 24dp: edges at 24–48px (inner track spans 0–48px) ✓
 */
export const switchHandleContainerVariants = cva([
  "absolute top-1/2 -translate-y-1/2 -left-1.5 size-10",
  "flex items-center justify-center rounded-full",
  // Spatial transition for movement (position is spatial, not an effect)
  "transition-transform duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
  // Travel to selected position
  "group-data-[selected]/switch:translate-x-5",
]);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — the 40dp semi-transparent ring inside the handle container.
 *
 * Color: on-surface (unselected) → primary (selected).
 * Opacity: 0 at rest, 8% hover, 10% focus/pressed, hidden when disabled.
 */
export const switchStateLayerVariants = cva([
  "absolute inset-0 rounded-full pointer-events-none opacity-0",
  // Base state-layer color (unselected)
  "bg-on-surface",
  // Effects transition for opacity
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected state-layer color
  "group-data-[selected]/switch:bg-primary",
  // Interaction opacities (MD3: hover 8%, focus/pressed 10%)
  "group-data-[hovered]/switch:opacity-8",
  "group-data-[focus-visible]/switch:opacity-10",
  "group-data-[pressed]/switch:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/switch:hidden",
]);

// ─── HANDLE ───────────────────────────────────────────────────────────────────

/**
 * Handle (thumb) — size and color only, no positioning.
 *
 * Size: inherited from --switch-handle-size CSS variable set on root.
 *   16dp unselected → 24dp selected/icon → 28dp pressed.
 *
 * Color progression (singly-chained rules come first; doubly-chained win by
 * higher specificity; disabled rules placed last win by cascade order within
 * equal specificity):
 *   base:            outline
 *   selected:        on-primary
 *   unselected+int:  on-surface-variant  (singly-chained)
 *   selected+int:    primary-container   (doubly-chained → higher specificity)
 *   disabled:        on-surface/38       (singly-chained, placed last → cascade wins)
 *   disabled+sel:    surface             (doubly-chained → highest for this combo)
 */
export const switchHandleVariants = cva([
  "relative z-10 rounded-full flex items-center justify-center flex-shrink-0",
  // Size via inherited CSS variable
  "size-[var(--switch-handle-size,1rem)]",
  // Spatial transition for size changes + effects for color
  "transition-[width,height,background-color] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
  // ── Colors ────────────────────────────────────────────────────────────────
  // Base (unselected, enabled, no interaction)
  "bg-outline",
  // Selected
  "group-data-[selected]/switch:bg-on-primary",
  // Unselected + interaction (singly-chained — overrides base by cascade order)
  "group-data-[hovered]/switch:bg-on-surface-variant",
  "group-data-[focus-visible]/switch:bg-on-surface-variant",
  "group-data-[pressed]/switch:bg-on-surface-variant",
  // Selected + interaction (doubly-chained → higher specificity; wins over singly-chained above)
  "group-data-[selected]/switch:group-data-[hovered]/switch:bg-primary-container",
  "group-data-[selected]/switch:group-data-[focus-visible]/switch:bg-primary-container",
  "group-data-[selected]/switch:group-data-[pressed]/switch:bg-primary-container",
  // Disabled — placed last so cascade wins at equal specificity vs interaction colors
  "group-data-[disabled]/switch:bg-on-surface/38",
  // Disabled + selected — doubly-chained wins over singly-chained disabled
  "group-data-[selected]/switch:group-data-[disabled]/switch:bg-surface",
]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Icon container inside the handle.
 *
 * Color follows the MD3 spec:
 *   unselected: surface-container-highest (icon blends with track bg)
 *   selected:   on-primary-container
 *   disabled:   on-surface/38
 */
export const switchIconVariants = cva([
  "size-4 flex items-center justify-center flex-shrink-0",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Unselected icon color (matches track bg, visually "hidden" at rest)
  "text-surface-container-highest",
  // Selected icon color
  "group-data-[selected]/switch:text-on-primary-container",
  // Disabled
  "group-data-[disabled]/switch:text-on-surface/38",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Text label next to the track.
 * Disabled opacity is inherited from the root's data-[disabled]:opacity-38.
 */
export const switchLabelVariants = cva(["text-body-medium text-on-surface select-none ml-4"]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type SwitchRootVariants = VariantProps<typeof switchRootVariants>;
export type SwitchTrackVariants = VariantProps<typeof switchTrackVariants>;
export type SwitchHandleContainerVariants = VariantProps<typeof switchHandleContainerVariants>;
export type SwitchStateLayerVariants = VariantProps<typeof switchStateLayerVariants>;
export type SwitchHandleVariants = VariantProps<typeof switchHandleVariants>;
export type SwitchIconVariants = VariantProps<typeof switchIconVariants>;
export type SwitchLabelVariants = VariantProps<typeof switchLabelVariants>;
