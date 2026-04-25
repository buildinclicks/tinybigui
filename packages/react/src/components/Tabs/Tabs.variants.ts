import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 TabList Variants (CVA)
 *
 * MD3 Specifications:
 * - Container background: bg-surface
 * - Container height: 48dp (fixed height tabs)
 * - Bottom border: outline-variant color, 1dp
 * - Fixed layout: tabs fill width equally
 * - Scrollable layout: tabs overflow horizontally, no wrapping
 */
export const tabListVariants = cva(
  [
    // Base classes
    "relative flex",
    "bg-surface",
    // Bottom divider line (MD3 spec)
    "border-b border-outline-variant",
  ],
  {
    variants: {
      layout: {
        fixed: "w-full",
        scrollable: "overflow-x-auto scrollbar-none",
      },
    },
    defaultVariants: {
      layout: "fixed",
    },
  }
);

/**
 * Material Design 3 Tab Item Variants (CVA)
 *
 * MD3 Specifications:
 * - Minimum height: 48dp
 * - Minimum width: 90dp (fixed), flexible (scrollable)
 * - Typography: Title Small (14px, weight 500, tracking 0.1px)
 * - State layers: 8% hover, 12% pressed/focus
 * - Disabled: 38% opacity
 * - Touch target: full tab area
 */
export const tabVariants = cva(
  [
    // Base layout
    "relative flex flex-col items-center justify-center",
    "min-h-12 px-4",
    "cursor-pointer select-none",
    "overflow-hidden",
    // Typography: MD3 Title Small
    "text-sm font-medium tracking-[0.1px]",
    // Transition
    "transition-colors duration-200",
    // Focus visible
    "focus-visible:outline-none",
    // State layer via before pseudo-element
    "before:absolute before:inset-0 before:transition-opacity before:duration-200",
    "before:bg-current before:opacity-0",
    "hover:before:opacity-8",
    "active:before:opacity-12",
    "focus-visible:before:opacity-12",
  ],
  {
    variants: {
      /**
       * Tab variant (Primary or Secondary)
       */
      variant: {
        primary: "",
        secondary: "",
      },

      /**
       * Selected state
       */
      selected: {
        true: "",
        false: "",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "opacity-38 cursor-not-allowed pointer-events-none",
        false: "",
      },

      /**
       * Layout determines min-width behavior
       */
      layout: {
        fixed: "flex-1",
        scrollable: "min-w-[90px] shrink-0",
      },
    },

    compoundVariants: [
      // Primary + selected
      {
        variant: "primary",
        selected: true,
        disabled: false,
        className: "text-primary",
      },
      // Primary + unselected
      {
        variant: "primary",
        selected: false,
        disabled: false,
        className: "text-on-surface-variant",
      },
      // Secondary + selected
      {
        variant: "secondary",
        selected: true,
        disabled: false,
        className: "text-on-surface",
      },
      // Secondary + unselected
      {
        variant: "secondary",
        selected: false,
        disabled: false,
        className: "text-on-surface-variant",
      },
    ],

    defaultVariants: {
      variant: "primary",
      selected: false,
      disabled: false,
      layout: "fixed",
    },
  }
);

/**
 * Active indicator variants (the sliding underline)
 *
 * MD3 Specifications:
 * - Primary: 3dp height, bg-primary, rounded-full corners
 * - Secondary: 2dp height, bg-on-surface-variant, no rounding
 * - Absolutely positioned at bottom of tab list
 * - Slides to selected tab using CSS transform
 */
export const tabIndicatorVariants = cva(
  [
    // Base: absolutely positioned at bottom
    "absolute bottom-0 left-0",
    "pointer-events-none",
    // Transition using MD3 motion tokens (medium2 duration, emphasized easing)
    "transition-[left,width]",
    "duration-medium2",
    "ease-emphasized",
  ],
  {
    variants: {
      variant: {
        primary: ["h-[3px]", "bg-primary", "rounded-t-sm"],
        secondary: ["h-[2px]", "bg-on-surface-variant"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

/**
 * Tab panel variants
 *
 * MD3 Specifications:
 * - No specific container styling mandated
 * - Focus management: panel receives focus if no focusable children
 */
export const tabPanelVariants = cva(
  [
    // Base panel styles
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

/**
 * Tab badge variants
 *
 * Inline badge displayed in the upper-right area of the tab icon/label.
 * MD3 badge spec: small indicator for notification count or status.
 */
export const tabBadgeVariants = cva(
  [
    // Base badge
    "absolute",
    "inline-flex items-center justify-center",
    "bg-error text-on-error",
    "font-medium leading-none",
    "pointer-events-none",
  ],
  {
    variants: {
      type: {
        dot: ["top-1 right-1", "w-1.5 h-1.5", "rounded-full"],
        count: ["-top-1 -right-1", "min-w-[16px] h-4", "px-1", "rounded-full", "text-[11px]"],
      },
    },
    defaultVariants: {
      type: "count",
    },
  }
);

/**
 * Tab icon wrapper variants
 * Positions icon relative to the badge
 */
export const tabIconVariants = cva(
  ["relative", "inline-flex items-center justify-center", "w-6 h-6"],
  {
    variants: {
      hasLabel: {
        true: "mb-1",
        false: "",
      },
    },
    defaultVariants: {
      hasLabel: false,
    },
  }
);

// Export variant prop types
export type TabListVariants = VariantProps<typeof tabListVariants>;
export type TabVariants = VariantProps<typeof tabVariants>;
export type TabIndicatorVariants = VariantProps<typeof tabIndicatorVariants>;
export type TabPanelVariants = VariantProps<typeof tabPanelVariants>;
export type TabBadgeVariants = VariantProps<typeof tabBadgeVariants>;
export type TabIconVariants = VariantProps<typeof tabIconVariants>;
