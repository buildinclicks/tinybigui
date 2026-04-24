import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 RadioGroup Variants (CVA)
 *
 * Type-safe variant management for RadioGroup component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * MD3 Specifications:
 * - Radio icon: 20x20dp (within 40x40dp touch target)
 * - Outline width: 2dp
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 38% opacity
 * - Radio spacing: 16px gap between radios
 */
export const radioGroupVariants = cva(
  [
    // Base classes (always applied to group wrapper)
    "flex",
    "gap-4", // 16px spacing between radios (MD3 standard)
  ],
  {
    variants: {
      /**
       * Layout orientation
       */
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row flex-wrap",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      disabled: false,
    },
  }
);

/**
 * RadioGroup label variants
 */
export const radioGroupLabelVariants = cva(
  [
    "text-sm font-medium", // MD3: Body Medium
    "text-on-surface",
    "mb-3", // Spacing below label (12px)
  ],
  {
    variants: {
      disabled: {
        true: "opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

/**
 * Material Design 3 Radio Variants (CVA)
 *
 * Type-safe variant management for Radio component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * MD3 Specifications:
 * - Radio icon: 20x20dp (within 40x40dp touch target)
 * - Outline width: 2dp
 * - Inner dot: 10px (selected state)
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 38% opacity
 * - Label spacing: 16px (ml-4)
 */
export const radioVariants = cva(
  [
    // Base classes (always applied to label wrapper)
    "relative inline-flex items-center cursor-pointer select-none",
    "transition-opacity duration-200",
  ],
  {
    variants: {
      /**
       * Disabled state
       */
      disabled: {
        true: "opacity-38 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

/**
 * Radio container variants (for the visual radio circle)
 */
export const radioContainerVariants = cva(
  [
    // Base classes for radio visual container
    "relative inline-flex items-center justify-center",
    "w-10 h-10", // 40x40dp touch target (MD3 spec)
    "flex-shrink-0",
    "transition-all duration-200",

    // State layer (hover, focus, active) - MD3 spec: 8%/12%/12% opacity
    "before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-200",
    "before:bg-current before:opacity-0",
    "hover:before:opacity-8",
    "active:before:opacity-12",
  ],
  {
    variants: {
      /**
       * Radio state (determines visual appearance)
       */
      state: {
        unselected: "text-on-surface-variant",
        selected: "text-primary",
      },

      /**
       * Error/invalid state
       */
      isInvalid: {
        true: "text-error",
        false: "",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "text-on-surface pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      // Error state overrides normal colors for all states
      {
        state: "unselected",
        isInvalid: true,
        disabled: false,
        className: "text-error",
      },
      {
        state: "selected",
        isInvalid: true,
        disabled: false,
        className: "text-error",
      },
    ],
    defaultVariants: {
      state: "unselected",
      isInvalid: false,
      disabled: false,
    },
  }
);

/**
 * Radio icon outer circle variants (the 20x20dp circle)
 */
export const radioIconOuterVariants = cva(
  [
    // Base classes for the radio outer circle
    "transition-all duration-200",
  ],
  {
    variants: {
      /**
       * Radio state
       */
      state: {
        unselected: [
          "fill-transparent",
          "stroke-current", // Uses parent text color (on-surface-variant or error)
          "stroke-2", // MD3: 2dp outline width
        ],
        selected: [
          "fill-current", // Uses parent text color (primary or error)
          "stroke-none",
        ],
      },

      /**
       * Disabled state
       */
      disabled: {
        true: ["fill-transparent", "stroke-current", "stroke-2"],
        false: "",
      },
    },
    compoundVariants: [
      // Disabled + selected state overrides fill
      {
        state: "selected",
        disabled: true,
        className: "fill-current stroke-none",
      },
    ],
    defaultVariants: {
      state: "unselected",
      disabled: false,
    },
  }
);

/**
 * Radio icon inner dot variants (the 10px center dot when selected)
 */
export const radioIconInnerVariants = cva(
  [
    "fill-current", // Inherits color from parent (on-primary)
    "transition-all duration-200",
  ],
  {
    variants: {
      /**
       * Visibility based on state
       */
      visible: {
        true: "opacity-100 scale-100",
        false: "opacity-0 scale-0",
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
);

/**
 * Radio label text variants
 */
export const radioLabelVariants = cva(
  [
    "text-sm", // MD3: Body Medium (14px)
    "text-on-surface",
    "select-none",
    "ml-1.5",
  ],
  {
    variants: {
      disabled: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
export type RadioGroupLabelVariants = VariantProps<typeof radioGroupLabelVariants>;
export type RadioVariants = VariantProps<typeof radioVariants>;
export type RadioContainerVariants = VariantProps<typeof radioContainerVariants>;
export type RadioIconOuterVariants = VariantProps<typeof radioIconOuterVariants>;
export type RadioIconInnerVariants = VariantProps<typeof radioIconInnerVariants>;
export type RadioLabelVariants = VariantProps<typeof radioLabelVariants>;
