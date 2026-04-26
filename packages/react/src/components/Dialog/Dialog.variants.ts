import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Dialog Variants (CVA)
 *
 * Type-safe variant management using Tailwind CSS classes mapped to MD3 tokens.
 *
 * MD3 Specifications:
 * - Basic surface: surface-container-high
 * - Elevation: level-3 → shadow-elevation-3
 * - Shape (Basic): extra-large (28dp) → rounded-xl
 * - Min width (Basic): 280dp → min-w-70
 * - Max width (Basic): 560dp → max-w-dialog
 * - Scrim: bg-scrim at opacity-32
 * - Headline: text-headline-small, text-on-surface
 * - Body: text-body-medium, text-on-surface-variant
 * - Action row: right-aligned, gap-2
 * - Entry motion (Basic): scale + fade, medium4 (400ms) + ease-emphasized-decelerate
 * - Exit motion (Basic): fade, short2 (100ms) + ease-emphasized-accelerate
 * - Entry motion (Fullscreen): slide-up, medium4 (400ms) + ease-emphasized-decelerate
 * - Exit motion (Fullscreen): slide-down, short2 (100ms) + ease-emphasized-accelerate
 */

// ─── Scrim overlay ─────────────────────────────────────────────────────────────

/**
 * Scrim overlay variants — matches MD3 spec and Drawer scrim pattern.
 * Full-screen variant uses the same scrim but onClick is a no-op.
 */
export const dialogScrimVariants = cva([
  "fixed",
  "inset-0",
  "z-40",
  "bg-scrim",
  "opacity-32",
  "transition-opacity",
  "duration-medium2",
  "ease-standard",
]);

export type DialogScrimVariants = VariantProps<typeof dialogScrimVariants>;

// ─── Panel container ────────────────────────────────────────────────────────────

/**
 * Dialog panel container variants.
 *
 * - `basic`: floating card with rounded corners, elevation, max-width constraint.
 * - `fullscreen`: full viewport coverage, no corners, no max-width.
 *
 * Positioned and centered by the portal wrapper; `z-50` sits above the scrim.
 */
export const dialogPanelVariants = cva(
  [
    // Stacking above scrim
    "z-50",

    // Surface
    "bg-surface-container-high",

    // Flex column layout for slots
    "flex",
    "flex-col",

    // Transition for animation state changes
    "transition-[opacity,transform]",
    "will-change-[opacity,transform]",
  ],
  {
    variants: {
      variant: {
        basic: [
          // Shape: MD3 extra-large = 28dp
          "rounded-xl",
          // Elevation level 3
          "shadow-elevation-3",
          // Width constraints per MD3 spec (280dp min, 560dp max)
          "min-w-70",
          "max-w-dialog-max",
          "w-full",
          // Internal spacing
          "pt-6",
          "pb-3",
          "px-6",
          // Positioned in viewport center
          "relative",
        ],
        fullscreen: [
          // Full viewport
          "w-full",
          "h-full",
          // No rounded corners on fullscreen
          "rounded-none",
          // No elevation shadow on fullscreen
          "shadow-none",
          // Positioned to fill portal
          "relative",
        ],
      },
    },
    defaultVariants: {
      variant: "basic",
    },
  }
);

export type DialogPanelVariants = VariantProps<typeof dialogPanelVariants>;

// ─── Portal wrapper ─────────────────────────────────────────────────────────────

/**
 * Wrapper that centers the basic dialog in the viewport.
 * Not applied to the fullscreen variant (which fills the viewport directly).
 */
export const dialogWrapperVariants = cva([], {
  variants: {
    variant: {
      basic: ["fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "px-4"],
      fullscreen: ["fixed", "inset-0", "z-50"],
    },
  },
  defaultVariants: {
    variant: "basic",
  },
});

export type DialogWrapperVariants = VariantProps<typeof dialogWrapperVariants>;

// ─── Animation state classes ────────────────────────────────────────────────────

/**
 * Animation state variants — applied by `DialogHeadless` based on its
 * internal animation state machine. Variant-specific to match MD3 motion spec:
 *
 * Basic: scale + fade (entry) / fade (exit)
 * Fullscreen: slide-up (entry) / slide-down (exit)
 */
export const dialogAnimationVariants = cva("", {
  variants: {
    animationState: {
      entering: [],
      visible: [],
      exiting: [],
      exited: [],
    },
    variant: {
      basic: [],
      fullscreen: [],
    },
  },
  compoundVariants: [
    // Basic: entering — start scaled down + transparent
    {
      animationState: "entering",
      variant: "basic",
      className: ["scale-90", "opacity-0"],
    },
    // Basic: visible — scale to full + fade in
    {
      animationState: "visible",
      variant: "basic",
      className: ["scale-100", "opacity-100", "duration-medium4", "ease-emphasized-decelerate"],
    },
    // Basic: exiting — fade out (scale stays at 1)
    {
      animationState: "exiting",
      variant: "basic",
      className: ["scale-100", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
    },
    // Basic: exited — fully transparent
    {
      animationState: "exited",
      variant: "basic",
      className: ["scale-100", "opacity-0"],
    },
    // Fullscreen: entering — start below viewport + transparent
    {
      animationState: "entering",
      variant: "fullscreen",
      className: ["translate-y-full", "opacity-0"],
    },
    // Fullscreen: visible — slide up + fade in
    {
      animationState: "visible",
      variant: "fullscreen",
      className: ["translate-y-0", "opacity-100", "duration-medium4", "ease-emphasized-decelerate"],
    },
    // Fullscreen: exiting — slide down + fade out
    {
      animationState: "exiting",
      variant: "fullscreen",
      className: ["translate-y-full", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
    },
    // Fullscreen: exited — fully off-screen
    {
      animationState: "exited",
      variant: "fullscreen",
      className: ["translate-y-full", "opacity-0"],
    },
  ],
  defaultVariants: {
    animationState: "entering",
    variant: "basic",
  },
});

export type DialogAnimationVariants = VariantProps<typeof dialogAnimationVariants>;

// ─── DialogHeadline ─────────────────────────────────────────────────────────────

/**
 * Headline element variants.
 * MD3: text-headline-small, text-on-surface.
 */
export const dialogHeadlineVariants = cva(["text-headline-small", "text-on-surface"], {
  variants: {
    variant: {
      basic: ["mb-4"],
      fullscreen: [
        // Top app bar row in fullscreen: flex, items-center, gap
        "flex",
        "items-center",
        "gap-4",
        "px-4",
        "h-14",
        "shrink-0",
        "border-b",
        "border-outline-variant",
      ],
    },
  },
  defaultVariants: {
    variant: "basic",
  },
});

export type DialogHeadlineVariants = VariantProps<typeof dialogHeadlineVariants>;

/**
 * Headline text inside the fullscreen top app bar row.
 */
export const dialogHeadlineTitleVariants = cva([
  "flex-1",
  "text-headline-small",
  "text-on-surface",
  "truncate",
]);

// ─── DialogContent ──────────────────────────────────────────────────────────────

/**
 * Scrollable body content variants.
 * MD3: text-body-medium, text-on-surface-variant, scrollable.
 */
export const dialogContentVariants = cva(
  ["text-body-medium", "text-on-surface-variant", "overflow-y-auto", "flex-1"],
  {
    variants: {
      variant: {
        basic: ["mb-6"],
        fullscreen: ["px-6", "py-4"],
      },
    },
    defaultVariants: {
      variant: "basic",
    },
  }
);

export type DialogContentVariants = VariantProps<typeof dialogContentVariants>;

// ─── DialogActions ──────────────────────────────────────────────────────────────

/**
 * Action button row variants.
 * MD3: right-aligned flex row with gap-2, padding-top per spec.
 */
export const dialogActionsVariants = cva([
  "flex",
  "items-center",
  "justify-end",
  "gap-2",
  "pt-3",
  "shrink-0",
]);

export type DialogActionsVariants = VariantProps<typeof dialogActionsVariants>;
