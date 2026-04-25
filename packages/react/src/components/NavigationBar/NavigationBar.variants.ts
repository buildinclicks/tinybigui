import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Navigation Bar container variants (CVA).
 *
 * Bar surface: `bg-surface-container`
 * Height: 80dp (`h-20`)
 * Position: `fixed bottom-0` — full-width bottom bar
 *
 * @see https://m3.material.io/components/navigation-bar/specs
 */
export const navigationBarVariants = cva([
  // Layout
  "fixed bottom-0 left-0 right-0 z-10",
  "w-full",
  "flex flex-row items-stretch",
  // MD3 surface
  "bg-surface-container",
  // MD3 height: 80dp
  "h-20",
  // Safe-area bottom (for mobile devices)
  "pb-safe",
]);

/**
 * Material Design 3 Navigation Bar item variants (CVA).
 *
 * Each item is a flex column that fills available horizontal space.
 * Active/inactive colors follow MD3 color roles:
 * - Active icon:   `text-on-secondary-container`
 * - Inactive icon: `text-on-surface-variant`
 * - Active label:  `text-on-surface`
 * - Inactive label:`text-on-surface-variant`
 *
 * State layers use MD3 opacity values via `::before` pseudo-element.
 *
 * @see https://m3.material.io/components/navigation-bar/specs
 */
export const navigationBarItemVariants = cva(
  [
    // Layout
    "relative flex flex-1 flex-col items-center justify-center",
    "cursor-pointer select-none outline-none",
    // State layer pseudo-element (covers the full item area)
    "before:absolute before:inset-0 before:rounded-none before:transition-opacity before:duration-short2 before:ease-standard",
    // Focus-visible ring
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    // Transition for color changes
    "transition-colors duration-short2 ease-standard",
  ],
  {
    variants: {
      /**
       * Whether this item is the currently selected destination.
       * Controls icon and label colors per MD3 spec.
       */
      isActive: {
        true: [
          // Active icon color applied via text-color on the icon wrapper
          "[&>[data-icon]]:text-on-secondary-container",
          // Active label color
          "[&>[data-label]]:text-on-surface",
          // State layer color for active item
          "before:bg-on-surface-variant",
        ],
        false: [
          // Inactive icon color
          "[&>[data-icon]]:text-on-surface-variant",
          // Inactive label color
          "[&>[data-label]]:text-on-surface-variant",
          // State layer color for inactive item
          "before:bg-on-surface-variant",
        ],
      },

      /**
       * Whether the item is disabled.
       * Applies `opacity-38` per MD3 disabled state.
       */
      isDisabled: {
        true: ["cursor-not-allowed opacity-38 pointer-events-none"],
        false: [],
      },

      /**
       * Hover and press state layer opacities.
       * Applied via compound variants on hover/active pseudo-classes.
       */
      isHovered: {
        true: ["before:opacity-8"],
        false: ["before:opacity-0"],
      },

      isPressed: {
        true: ["before:opacity-12"],
        false: [],
      },
    },

    compoundVariants: [
      // When not hovered or pressed, state layer is invisible
      {
        isHovered: false,
        isPressed: false,
        className: "before:opacity-0",
      },
    ],

    defaultVariants: {
      isActive: false,
      isDisabled: false,
      isHovered: false,
      isPressed: false,
    },
  }
);

/**
 * Active indicator pill variants (CVA).
 *
 * The pill sits behind the icon, centered horizontally.
 * MD3 spec: 64dp wide × 32dp tall, `rounded-full`, `bg-secondary-container`.
 *
 * Animation uses MD3 motion tokens:
 * - Active:   `scale-x-100 opacity-100`
 * - Inactive: `scale-x-0   opacity-0`
 * - Duration: `duration-medium2` (300ms)
 * - Easing:   `ease-emphasized`
 */
export const indicatorPillVariants = cva(
  [
    "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
    "w-16 h-8",
    "rounded-full bg-secondary-container",
    "transition-[transform,opacity] duration-medium2 ease-emphasized",
    "origin-center",
  ],
  {
    variants: {
      isActive: {
        true: ["scale-x-100 opacity-100"],
        false: ["scale-x-0 opacity-0"],
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

/**
 * Badge variants (CVA).
 *
 * Positioned at the top-right of the icon area.
 * MD3 uses `error` color role for badges.
 *
 * - Dot:     small circle, no text
 * - Numeric: rounded pill with count
 */
export const badgeVariants = cva(
  [
    "absolute",
    "flex items-center justify-center",
    "bg-error text-on-error",
    "font-medium leading-none",
    // MD3 label-small
    "text-[0.6875rem]",
  ],
  {
    variants: {
      isDot: {
        true: [
          // Dot: 6dp diameter, top-right of icon
          "top-0 right-0.5 z-10",
          "w-1.5 h-1.5 min-w-0 rounded-full",
        ],
        false: [
          // Numeric: pill shape, top-right of icon
          "-top-1 left-3 z-10",
          "min-w-[1rem] h-4 px-1 rounded-full",
        ],
      },
    },
    defaultVariants: {
      isDot: false,
    },
  }
);

/**
 * Icon wrapper variants — controls size and positioning.
 * The icon wrapper is `relative` to position the badge and indicator.
 */
export const iconWrapperVariants = cva([
  "relative z-10 flex items-center justify-center",
  "w-6 h-6",
]);

/**
 * Label variants — `text-label-medium` per MD3 Navigation Bar spec.
 * Transition mirrors the icon color transition.
 */
export const labelVariants = cva([
  "mt-1 select-none",
  "text-label-medium",
  "transition-colors duration-short2 ease-standard",
  "truncate max-w-full",
]);

// ─── Type exports ─────────────────────────────────────────────────────────────

export type NavigationBarVariants = VariantProps<typeof navigationBarVariants>;
export type NavigationBarItemVariants = VariantProps<typeof navigationBarItemVariants>;
export type IndicatorPillVariants = VariantProps<typeof indicatorPillVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
