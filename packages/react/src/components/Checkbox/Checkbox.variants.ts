import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Checkbox Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no state variants, no state compoundVariants).
 * - All interaction/selection states are driven by data-* attributes on the root via
 *   group-data-[x]/checkbox Tailwind selectors in each slot's base classes.
 * - Content flags (data-invalid, data-indeterminate) are set explicitly by the component.
 *
 * Slot responsibilities:
 *   checkboxRootVariants      — label wrapper; carries `group/checkbox`; cursor + disabled
 *   checkboxControlVariants   — 40dp state-layer + ripple container; centered on the box
 *   checkboxStateLayerVariants — 40dp circle, hover/focus/press opacity ring
 *   checkboxFocusRingVariants — keyboard-focus outline (sibling of the box, not clipped)
 *   checkboxBoxVariants       — 18dp square; border + bg per state; 2dp corner radius
 *   checkboxIconVariants      — SVG check / dash icon inside the box
 *   checkboxLabelVariants     — text label next to the control
 *
 * MD3 Spec:
 *   Box: 18×18dp, 2dp corner radius, 2dp border
 *   Touch target: 40×40dp (control slot)
 *   State-layer opacities: hover 8% | focus/pressed 10%
 *   Disabled: container 38% opacity (root-level) or specific slot overrides
 *   Label spacing: 16px (ml-4)
 */

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Root label wrapper — carries `group/checkbox`.
 *
 * Disabled state self-targets via data-[disabled]: so all children inherit
 * the cursor/pointer restriction. Opacity is applied here at 38% when disabled.
 */
export const checkboxRootVariants = cva([
  "relative inline-flex items-center cursor-pointer select-none -ml-3.75",
  "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  "data-[disabled]:opacity-38",
]);

// ─── CONTROL ──────────────────────────────────────────────────────────────────

/**
 * Control — 40dp state-layer + ripple host.
 *
 * Provides the touch target (40dp) centered on the 18dp box.
 * Uses overflow-hidden so ripples are clipped to the circular container.
 */
export const checkboxControlVariants = cva([
  "relative flex items-center justify-center flex-shrink-0",
  "w-10 h-10 rounded-full m-1",
  "overflow-hidden",
]);

// ─── STATE LAYER ──────────────────────────────────────────────────────────────

/**
 * State layer — the 40dp semi-transparent circle inside the control.
 *
 * Color progression:
 *   base (unselected):            on-surface
 *   selected / indeterminate:     primary
 *   invalid:                      error
 *   invalid + selected:           error (doubly-chained → higher specificity)
 *
 * Opacity:
 *   rest: 0 | hover: 8% | focus-visible: 10% | pressed: 10%
 *   hidden when disabled.
 */
export const checkboxStateLayerVariants = cva([
  "absolute inset-0 rounded-full pointer-events-none opacity-0",
  // Base state-layer color (unselected)
  "bg-on-surface",
  // Effects transition for opacity changes
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected / indeterminate → primary color
  "group-data-[selected]/checkbox:bg-primary",
  "group-data-[indeterminate]/checkbox:bg-primary",
  // Invalid → error color (singly-chained)
  "group-data-[invalid]/checkbox:bg-error",
  // Invalid + selected → error wins (doubly-chained for specificity)
  "group-data-[invalid]/checkbox:group-data-[selected]/checkbox:bg-error",
  // Interaction opacities (MD3: hover 8%, focus-visible 10%, pressed 10%)
  "group-data-[hovered]/checkbox:opacity-8",
  "group-data-[focus-visible]/checkbox:opacity-10",
  "group-data-[pressed]/checkbox:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/checkbox:hidden",
]);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring — an absolutely-positioned outline around the 40dp control area.
 *
 * Replaces the old `animate-pulse` SVG rect. Lives as an absolute overlay
 * inside the control div (40dp) so it correctly surrounds the full touch target.
 */
export const checkboxFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/checkbox:opacity-100",
]);

// ─── BOX ──────────────────────────────────────────────────────────────────────

/**
 * Box — the 18×18dp visual checkbox square.
 *
 * Sits inside the 40dp control, centered. Owns border, background, and
 * corner radius. 2dp radius expressed as rounded-[2px] (smallest token is 4px).
 *
 * Color progression (cascade order — disabled last):
 *   base (unselected):            transparent bg, outline border
 *   selected / indeterminate:     primary bg, primary border
 *   invalid (unselected):         transparent bg, error border
 *   invalid + selected:           error bg, error border (doubly-chained)
 *   disabled (unselected):        transparent bg, on-surface/38 border
 *   disabled + selected:          on-surface/38 bg, transparent border
 */
export const checkboxBoxVariants = cva([
  // Base geometry
  "relative flex items-center justify-center flex-shrink-0",
  "w-[18px] h-[18px] rounded-[2px] border-2",
  // Effects transition for color changes
  "transition-[background-color,border-color] duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // ── Unselected base ───────────────────────────────────────────────────────
  "bg-transparent border-outline",
  // ── Selected ──────────────────────────────────────────────────────────────
  "group-data-[selected]/checkbox:bg-primary group-data-[selected]/checkbox:border-primary",
  // ── Indeterminate ─────────────────────────────────────────────────────────
  "group-data-[indeterminate]/checkbox:bg-primary group-data-[indeterminate]/checkbox:border-primary",
  // ── Invalid (unselected) — singly chained ─────────────────────────────────
  "group-data-[invalid]/checkbox:border-error",
  // ── Invalid + selected — doubly chained (higher specificity) ──────────────
  "group-data-[invalid]/checkbox:group-data-[selected]/checkbox:bg-error",
  "group-data-[invalid]/checkbox:group-data-[selected]/checkbox:border-error",
  // ── Invalid + indeterminate — doubly chained ───────────────────────────────
  "group-data-[invalid]/checkbox:group-data-[indeterminate]/checkbox:bg-error",
  "group-data-[invalid]/checkbox:group-data-[indeterminate]/checkbox:border-error",
  // ── Disabled (placed last — cascade wins over interaction colors) ──────────
  "group-data-[disabled]/checkbox:border-on-surface/38",
  "group-data-[disabled]/checkbox:bg-transparent",
  // ── Disabled + selected — doubly chained ──────────────────────────────────
  "group-data-[selected]/checkbox:group-data-[disabled]/checkbox:bg-on-surface/38",
  "group-data-[selected]/checkbox:group-data-[disabled]/checkbox:border-transparent",
  // ── Disabled + indeterminate — doubly chained ─────────────────────────────
  "group-data-[indeterminate]/checkbox:group-data-[disabled]/checkbox:bg-on-surface/38",
  "group-data-[indeterminate]/checkbox:group-data-[disabled]/checkbox:border-transparent",
]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Icon (check / dash) — SVG element inside the box.
 *
 * Color:
 *   base (selected):              on-primary
 *   invalid + selected:           on-error (doubly-chained)
 *   disabled + selected:          surface (doubly-chained)
 *
 * The icon is only rendered when selected or indeterminate so "unselected"
 * color cases are not needed.
 */
export const checkboxIconVariants = cva([
  "absolute inset-0 flex items-center justify-center",
  // Spatial transition for icon appearing (scale)
  "transition-transform duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
  // Base icon color
  "text-on-primary",
  // Invalid → on-error (doubly-chained for both selected and indeterminate)
  "group-data-[invalid]/checkbox:group-data-[selected]/checkbox:text-on-error",
  "group-data-[invalid]/checkbox:group-data-[indeterminate]/checkbox:text-on-error",
  // Disabled → surface (doubly-chained)
  "group-data-[selected]/checkbox:group-data-[disabled]/checkbox:text-surface",
  "group-data-[indeterminate]/checkbox:group-data-[disabled]/checkbox:text-surface",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Text label next to the control.
 * Disabled opacity is inherited from the root's data-[disabled]:opacity-38.
 */
export const checkboxLabelVariants = cva(["text-body-large text-on-surface select-none"]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type CheckboxRootVariants = VariantProps<typeof checkboxRootVariants>;
export type CheckboxControlVariants = VariantProps<typeof checkboxControlVariants>;
export type CheckboxStateLayerVariants = VariantProps<typeof checkboxStateLayerVariants>;
export type CheckboxFocusRingVariants = VariantProps<typeof checkboxFocusRingVariants>;
export type CheckboxBoxVariants = VariantProps<typeof checkboxBoxVariants>;
export type CheckboxIconVariants = VariantProps<typeof checkboxIconVariants>;
export type CheckboxLabelVariants = VariantProps<typeof checkboxLabelVariants>;
