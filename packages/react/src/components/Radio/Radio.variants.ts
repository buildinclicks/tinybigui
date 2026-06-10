import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Radio Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no state variants, no state compoundVariants).
 * - All interaction/selection/error states are driven by data-* attributes on the root via
 *   group-data-[x]/radio Tailwind selectors in each slot's base classes.
 * - Content flags are set explicitly by the component.
 *
 * Slot responsibilities:
 *   radioRootVariants        — label wrapper; carries `group/radio`; disabled cursor/opacity
 *   radioControlVariants     — relative 40dp touch-target + state-layer host
 *   radioFocusRingVariants   — keyboard focus ring (sibling of radioTarget, not clipped)
 *   radioTargetVariants      — overflow-hidden rounded-full; clips state layer to circle shape
 *   radioStateLayerVariants  — hover/focus/pressed opacity ring (color + opacity transitions)
 *   radioRingVariants        — 20dp outer ring; owns border color (unselected/selected/error/disabled)
 *   radioDotVariants         — 10dp inner filled dot; scale 0→1 when selected
 *   radioLabelVariants       — text label next to control
 *   radioGroupVariants       — flex container for the group
 *   radioGroupLabelVariants  — group label text
 *
 * MD3 Spec:
 *   Outer ring: 20×20dp, 2dp border
 *   Inner dot: 10dp diameter (when selected)
 *   Touch/state-layer target: 40dp
 *   Colors:
 *     Unselected ring:          on-surface-variant
 *     Selected ring + dot:      primary
 *     Error ring + dot:         error
 *     Disabled ring + dot:      on-surface/38
 *   State-layer:
 *     Unselected color:         on-surface
 *     Selected color:           primary
 *     Error color:              error
 *     Hover opacity:            8%
 *     Focus/pressed opacity:    10%
 *     Disabled:                 hidden
 *   Label: body-medium, on-surface
 */

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Root label wrapper — carries `group/radio`.
 * Disabled state targets itself with data-[disabled]: selectors so children
 * don't need to handle cursor separately.
 */
export const radioRootVariants = cva([
  "relative inline-flex items-center cursor-pointer select-none",
  // Disabled state — self-targeting so children inherit via group
  "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  "data-[disabled]:opacity-38",
]);

// ─── CONTROL ──────────────────────────────────────────────────────────────────

/**
 * Control wrapper — provides the 40dp relative positioning context.
 * Hosts the focus ring (as a sibling) and the overflow-hidden target.
 */
export const radioControlVariants = cva([
  "relative flex items-center justify-center flex-shrink-0",
  "size-10", // 40dp touch target (MD3 spec)
]);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring — absolutely positioned sibling of the target div.
 * Must live outside the overflow-hidden target so it is not clipped.
 * Transitions from opacity-0 to opacity-100 on keyboard focus.
 */
export const radioFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full",
  "outline outline-2 outline-offset-2 outline-secondary",
  // Effects transition for opacity
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/radio:opacity-100",
]);

// ─── TARGET ───────────────────────────────────────────────────────────────────

/**
 * Target — the 40dp overflow-hidden rounded circle that clips the state-layer
 * and hosts the ripple. Not positioned (no translate), just centered in the control.
 */
export const radioTargetVariants = cva([
  "absolute inset-0 rounded-full overflow-hidden",
  "flex items-center justify-center",
]);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — semi-transparent ring for hover/focus/press feedback.
 *
 * Color: on-surface (unselected) → primary (selected) → error (invalid).
 * Opacity: 0 at rest, 8% hover, 10% focus/pressed, hidden when disabled.
 * Uses effects tokens — opacity and background-color must not overshoot.
 */
export const radioStateLayerVariants = cva([
  "absolute inset-0 rounded-full pointer-events-none opacity-0",
  // Base state-layer color (unselected)
  "bg-on-surface",
  // Effects transition for opacity + color
  "transition-[opacity,background-color] duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected state-layer color
  "group-data-[selected]/radio:bg-primary",
  // Error state-layer color (overrides selected via cascade position)
  "group-data-[invalid]/radio:bg-error",
  // Interaction opacities (MD3: hover 8%, focus/pressed 10%)
  "group-data-[hovered]/radio:opacity-8",
  "group-data-[focus-visible]/radio:opacity-10",
  "group-data-[pressed]/radio:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/radio:hidden",
]);

// ─── RING ─────────────────────────────────────────────────────────────────────

/**
 * Outer ring — the 20×20dp visible radio circle (2dp border).
 * Owns border color; no fill.
 * Uses effects tokens because color changes don't have spatial movement.
 */
export const radioRingVariants = cva([
  "relative z-10 size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
  // Base (unselected, enabled)
  "border-on-surface-variant",
  // Effects transition for border-color
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected — border becomes primary
  "group-data-[selected]/radio:border-primary",
  // Error — placed after selected so it overrides by cascade order
  "group-data-[invalid]/radio:border-error",
  // Disabled — on-surface/38 opacity value
  "group-data-[disabled]/radio:border-on-surface/38",
]);

// ─── DOT ─────────────────────────────────────────────────────────────────────

/**
 * Inner dot — 10dp filled circle, centered in the ring.
 * Animates from scale-0 (unselected) to scale-100 (selected).
 * Uses spatial tokens because scale is a transform (can overshoot intentionally).
 */
export const radioDotVariants = cva([
  "size-2.5 rounded-full origin-center",
  // Spatial transition for scale — springs may overshoot (intentional)
  "transition-transform duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
  // Base fill color (shown when selected)
  "bg-primary",
  // Hidden when unselected
  "scale-0",
  // Visible when selected
  "group-data-[selected]/radio:scale-100",
  // Error — error fill color (placed after selected by cascade)
  "group-data-[invalid]/radio:bg-error",
  // Disabled — use on-surface/38 opacity
  "group-data-[disabled]/radio:bg-on-surface/38",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Text label next to the radio control.
 * Disabled opacity is inherited from root's data-[disabled]:opacity-38.
 */
export const radioLabelVariants = cva(["text-body-medium text-on-surface select-none ml-4"]);

// ─── GROUP ────────────────────────────────────────────────────────────────────

/**
 * RadioGroup container — flex layout with orientation support.
 */
export const radioGroupVariants = cva(
  ["flex", "gap-1"], // 4dp gap — padding around each 40dp control handles visual spacing
  {
    variants: {
      /**
       * Layout orientation
       * @default "vertical"
       */
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row flex-wrap",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

/**
 * RadioGroup label text.
 * Disabled opacity is applied via `data-disabled` attribute set directly on
 * the label element by the component (not via group selector).
 */
export const radioGroupLabelVariants = cva([
  "text-body-medium font-medium",
  "text-on-surface",
  "mb-3",
  "data-[disabled]:opacity-38",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type RadioRootVariants = VariantProps<typeof radioRootVariants>;
export type RadioControlVariants = VariantProps<typeof radioControlVariants>;
export type RadioFocusRingVariants = VariantProps<typeof radioFocusRingVariants>;
export type RadioTargetVariants = VariantProps<typeof radioTargetVariants>;
export type RadioStateLayerVariants = VariantProps<typeof radioStateLayerVariants>;
export type RadioRingVariants = VariantProps<typeof radioRingVariants>;
export type RadioDotVariants = VariantProps<typeof radioDotVariants>;
export type RadioLabelVariants = VariantProps<typeof radioLabelVariants>;
export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
export type RadioGroupLabelVariants = VariantProps<typeof radioGroupLabelVariants>;
