import { cva, type VariantProps } from "class-variance-authority";

// ─── Sheet container ──────────────────────────────────────────────────────────

/**
 * CVA variants for the Bottom Sheet container panel.
 *
 * MD3 tokens applied:
 * - Surface: bg-surface-container-low
 * - Elevation: shadow-elevation-1
 * - Shape: rounded-t-xl (top-left + top-right 28dp, bottom 0)
 * - Width: full width up to 640dp; side margins at wider viewports
 */
export const bottomSheetVariants = cva(
  [
    // Position: fixed to bottom edge, full width
    "fixed",
    "bottom-0",
    "left-0",
    "right-0",

    // Surface token
    "bg-surface-container-low",

    // Elevation level 1 per MD3 spec
    "shadow-elevation-1",

    // Shape: extra-large top corners (28dp), bottom corners are 0 (attached to screen edge)
    "rounded-t-xl",

    // Layout
    "flex",
    "flex-col",

    // Max width constraint (full width up to 640dp)
    "mx-auto",
    // NOTE: measurement-derived value from MD3 spec; permitted exception
    "max-w-[640px]",

    // Transition: transform for snap spring (applied in M06)
    "will-change-transform",

    // Responsive layout: when viewport > 640dp, apply side margins and top margin per MD3 spec
    // NOTE: measurement-derived value from MD3 spec; permitted exception (56dp = 3.5rem = 14 in Tailwind scale)
    "sm:mx-14",
    "sm:top-14",
    "sm:bottom-auto",
    // All corners rounded at wide layout (sheet floats away from screen edge)
    "sm:rounded-xl",
  ],
  {
    variants: {
      variant: {
        // Modal: above scrim (z-50)
        modal: "z-50",
        // Standard: sits above normal content but below overlays
        standard: "z-10",
      },
    },
    defaultVariants: {
      variant: "modal",
    },
  }
);

export type BottomSheetVariants = VariantProps<typeof bottomSheetVariants>;

// ─── Scrim overlay ────────────────────────────────────────────────────────────

/**
 * CVA for the scrim overlay (modal variant only).
 *
 * MD3 tokens applied:
 * - bg-scrim: scrim surface role
 * - opacity-32: 32% opacity per MD3 spec
 * - Transition: opacity fade (scrim is an effects property — legacy screen-level tokens)
 */
export const bottomSheetScrimVariants = cva([
  "fixed",
  "inset-0",
  "z-40",
  "bg-scrim",
  "opacity-32",
  "transition-opacity",
  "duration-short4",
  "ease-standard",
]);

export type BottomSheetScrimVariants = VariantProps<typeof bottomSheetScrimVariants>;

// ─── Drag handle ──────────────────────────────────────────────────────────────

/**
 * CVA for the drag handle wrapper (touch/click target area).
 *
 * MD3 spec: the top 48dp of the sheet is the interactive touch target area
 * when the drag handle is present. The wrapper provides this touch target.
 */
export const bottomSheetHandleWrapperVariants = cva([
  // Center the handle pill horizontally
  "flex",
  "items-center",
  "justify-center",

  // Top/bottom padding creates the 48dp touch target area
  // 22dp top + 4dp handle + 22dp bottom ≈ 48dp interaction zone (per MD3 measurements)
  // NOTE: measurement-derived value from MD3 spec; permitted exception
  "py-[22px]",

  // Full width so the touch target spans the sheet
  "w-full",

  // Focus ring styling for keyboard/switch navigation
  // MD3 spec: focus indicator color = secondary, thickness = 3dp, offset = 2dp
  "focus-visible:outline-none",
  "focus-visible:ring-3",
  "focus-visible:ring-secondary",
  "focus-visible:ring-offset-2",
  "focus-visible:rounded-sm",

  // Cursor affordance
  "cursor-ns-resize",
]);

/**
 * CVA for the drag handle pill visual element.
 *
 * MD3 tokens applied:
 * - bg-on-surface-variant: handle color
 * - w-8: 32dp width per MD3 spec
 * - h-1: 4dp height per MD3 spec
 * - rounded-full: fully rounded pill shape
 * - opacity-40: per MD3 spec (token deprecated but value still in spec)
 */
export const bottomSheetHandlePillVariants = cva([
  "bg-on-surface-variant",
  "opacity-40",
  "rounded-full",

  // Dimensions: 32dp × 4dp per MD3 spec (measurement-derived; permitted exception)
  "w-8", // 32dp = 2rem = w-8
  "h-1", // 4dp = 0.25rem = h-1

  // Pill itself is decorative; the wrapper handles interaction
  "pointer-events-none",
]);

export type BottomSheetHandleVariants = VariantProps<typeof bottomSheetHandleWrapperVariants>;
