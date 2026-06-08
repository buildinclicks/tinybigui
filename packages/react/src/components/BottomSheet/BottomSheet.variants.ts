import { cva, type VariantProps } from "class-variance-authority";

// ─── Animation variants ───────────────────────────────────────────────────────

/**
 * CVA animation state variants for the Bottom Sheet panel.
 *
 * Motion decision rationale:
 * - Bottom sheet is a standard-size component → `default` speed tier
 * - Slides in/out of screen → composite `animate-md-*` utilities (not manual spring tokens)
 * - Scrim opacity is an effects property → `duration-short4 ease-standard` (legacy screen-level token)
 * - Snap spring is a spatial on-screen transition → `ease-spring-standard-default-spatial` +
 *   `duration-spring-standard-default-spatial` (applied in bottomSheetVariants base)
 * - Standard personality (not expressive) — sheets are utility UI, not moments of delight
 */
export const bottomSheetAnimationVariants = cva("", {
  variants: {
    animationState: {
      // entering: initial mount frame — sheet starts below viewport (translateY(100%))
      // The CSS is handled inside animate-md-slide-in-bottom keyframes
      entering: ["opacity-0"],
      // visible: entry animation active — animate-md-slide-in-bottom runs once
      visible: ["animate-md-slide-in-bottom"],
      // exiting: exit animation active — animate-md-slide-out-bottom runs once
      exiting: ["animate-md-slide-out-bottom"],
      // exited: portal gate removes element — no classes needed
      exited: ["opacity-0", "pointer-events-none"],
    },
  },
  defaultVariants: {
    animationState: "entering",
  },
});

export type BottomSheetAnimationVariants = VariantProps<typeof bottomSheetAnimationVariants>;

// ─── Sheet container ──────────────────────────────────────────────────────────

/**
 * CVA variants for the Bottom Sheet container panel.
 *
 * MD3 tokens applied:
 * - Surface: bg-surface-container-low
 * - Elevation: shadow-elevation-1
 * - Shape: rounded-t-xl (top-left + top-right 28dp, bottom 0)
 * - Width: full width up to 640dp; centered at max-width 640dp on wider viewports
 *   (`mx-auto + max-w-[640px]` — at 752dp viewport this naturally produces the MD3-spec 56dp side margins)
 * - Height: constrained by max-height (72dp top margin by default, 56dp on > 640dp viewport)
 *   The sheet is always anchored to `bottom-0`; "top margin" is expressed as max-height so
 *   the sheet cannot overlap the top portion of the screen.
 * - Drag resize: height animates via `transition-[height]`; the sheet grows/shrinks from the
 *   bottom edge, always staying anchored — matching the MD3 spec "resize to another height" behaviour.
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
    "w-[640px] max-w-full",

    // Clip content during height transitions (sheet shrinks/grows from bottom edge)
    "overflow-hidden",

    // Transition: height for snap spring (MD3 spec — sheet "resizes" between heights)
    // Standard personality, default speed tier, spatial: no overshoot.
    // During drag, data-[dragging=true]:transition-none suppresses this so the
    // sheet height follows the pointer 1:1 without transition lag.
    // After drag release, the spring transition animates height to the new snap position.
    "transition-[height]",
    "duration-spring-standard-default-spatial",
    "ease-spring-standard-default-spatial",
    "data-[dragging=true]:transition-none",
    "will-change-[height]",

    // Responsive layout: when viewport > 640dp, apply wider top margin per MD3 spec.
    // The sheet remains bottom-anchored at all sizes. Side centering is handled by
    // mx-auto + max-w-[640px] — at 752dp viewport this naturally produces 56dp side
    // margins on each side (exactly matching MD3 measurements).
    // Top margin is expressed as max-height so the sheet cannot overlap the top edge:
    // - Default: 72dp top margin (max-h-[calc(100vh-72px)])
    // - Wide viewport (> 640dp): 56dp top margin (sm:max-h-[calc(100vh-56px)])
    // NOTE: measurement-derived values from MD3 spec; permitted exception
    "max-h-[calc(100vh-72px)]",
    "sm:max-h-[calc(100vh-56px)]",
    // Top corners rounded at wide layout (sheet floats away from screen edge)
    "rounded-t-xl",
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
