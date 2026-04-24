import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Checkbox Variants (CVA)
 *
 * Type-safe variant management for Checkbox component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * MD3 Specifications:
 * - Container: 18x18dp (within 40x40dp touch target)
 * - Corner radius: 2dp (applied via SVG rx/ry attributes, not CSS)
 * - Outline width: 2dp
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 38% opacity
 */
export const checkboxVariants = cva(
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
 * Checkbox container variants (for the visual checkbox box)
 */
export const checkboxContainerVariants = cva(
  [
    // Base classes for checkbox visual container
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
       * Checkbox state (determines visual appearance)
       */
      state: {
        unchecked: "text-on-surface-variant",
        checked: "text-primary",
        indeterminate: "text-primary",
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
        state: "unchecked",
        isInvalid: true,
        disabled: false,
        className: "text-error",
      },
      {
        state: "checked",
        isInvalid: true,
        disabled: false,
        className: "text-error",
      },
      {
        state: "indeterminate",
        isInvalid: true,
        disabled: false,
        className: "text-error",
      },
    ],
    defaultVariants: {
      state: "unchecked",
      isInvalid: false,
      disabled: false,
    },
  }
);

/**
 * Checkbox icon SVG box variants (the 18x18dp square container)
 */
export const checkboxIconBoxVariants = cva(
  [
    // Base classes for the checkbox box
    // Note: Border radius is applied via SVG rx/ry attributes (2dp) in the component
    "transition-all duration-200",
  ],
  {
    variants: {
      /**
       * Checkbox state
       */
      state: {
        unchecked: [
          "fill-transparent",
          "stroke-outline", // MD3: outline color for unchecked
          "stroke-2", // MD3: 2dp outline width
        ],
        checked: [
          "fill-current", // Uses parent text color (primary or error)
          "stroke-none",
        ],
        indeterminate: [
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
      // Disabled state overrides fill for checked/indeterminate
      {
        state: "checked",
        disabled: true,
        className: "fill-current stroke-none",
      },
      {
        state: "indeterminate",
        disabled: true,
        className: "fill-current stroke-none",
      },
    ],
    defaultVariants: {
      state: "unchecked",
      disabled: false,
    },
  }
);

/**
 * Checkbox checkmark/dash icon variants
 */
export const checkboxIconVariants = cva(
  [
    "fill-current", // Inherits color from parent
    "transition-all duration-200",
  ],
  {
    variants: {
      /**
       * Icon type
       */
      type: {
        check: "", // Checkmark icon
        dash: "", // Dash/minus icon
      },
    },
    defaultVariants: {
      type: "check",
    },
  }
);

/**
 * Checkbox label text variants
 */
export const checkboxLabelVariants = cva(
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
export type CheckboxVariants = VariantProps<typeof checkboxVariants>;
export type CheckboxContainerVariants = VariantProps<typeof checkboxContainerVariants>;
export type CheckboxIconBoxVariants = VariantProps<typeof checkboxIconBoxVariants>;
export type CheckboxIconVariants = VariantProps<typeof checkboxIconVariants>;
export type CheckboxLabelVariants = VariantProps<typeof checkboxLabelVariants>;
