/**
 * TextField Variants
 *
 * CVA (class-variance-authority) variant definitions for Material Design 3 TextField.
 * Supports filled and outlined variants with comprehensive state management.
 */

import { cva, type VariantProps } from "class-variance-authority";

/**
 * Container variants for the TextField wrapper
 *
 * Handles layout, width, and positioning
 */
export const textFieldContainerVariants = cva(
  [
    // Base container styles
    "relative inline-flex flex-col",
  ],
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

/**
 * Input wrapper variants (the visual container around the input)
 *
 * Handles MD3 filled and outlined variants with all states
 */
export const textFieldWrapperVariants = cva(
  [
    // Base wrapper styles
    "relative inline-flex items-center w-full",
    "transition-all duration-200",
    "rounded-t",
  ],
  {
    variants: {
      variant: {
        filled: ["bg-surface-container-highest", "border-b-2 border-on-surface-variant"],
        outlined: ["bg-transparent", "border border-outline", "rounded-b"],
      },
      size: {
        small: "min-h-10",
        medium: "min-h-12",
        large: "min-h-14",
      },
      disabled: {
        true: ["cursor-not-allowed", "opacity-38"],
        false: "",
      },
      error: {
        true: "",
        false: "",
      },
      focused: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // FILLED VARIANT - Focused state
      {
        variant: "filled",
        focused: true,
        error: false,
        className: "border-primary",
      },
      // FILLED VARIANT - Error state
      {
        variant: "filled",
        error: true,
        className: "border-error",
      },
      // FILLED VARIANT - Hover state (handled via group-hover in parent)
      {
        variant: "filled",
        disabled: false,
        className: "hover:bg-on-surface/[0.08]",
      },

      // OUTLINED VARIANT - Focused state
      {
        variant: "outlined",
        focused: true,
        error: false,
        className: "border-2 border-primary",
      },
      // OUTLINED VARIANT - Error state
      {
        variant: "outlined",
        error: true,
        className: "border-2 border-error",
      },
      // OUTLINED VARIANT - Hover state
      {
        variant: "outlined",
        disabled: false,
        className: "hover:border-on-surface",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "medium",
      disabled: false,
      error: false,
      focused: false,
    },
  }
);

/**
 * Input element variants
 *
 * Styles for the actual input/textarea element
 */
export const textFieldInputVariants = cva(
  [
    // Base input styles
    "w-full bg-transparent outline-none",
    "text-on-surface text-base",
    "placeholder:text-on-surface-variant placeholder:opacity-60",
    "transition-colors duration-200",
  ],
  {
    variants: {
      variant: {
        filled: "px-4",
        outlined: "px-4",
      },
      size: {
        small: "h-10 py-2 text-sm",
        medium: "h-12 py-3 text-base",
        large: "h-14 py-4 text-lg",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "",
      },
      hasLeadingIcon: {
        true: "pl-12",
        false: "",
      },
      hasTrailingIcon: {
        true: "pr-12",
        false: "",
      },
      multiline: {
        true: "resize-y",
        false: "",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "medium",
      disabled: false,
      hasLeadingIcon: false,
      hasTrailingIcon: false,
      multiline: false,
    },
  }
);

/**
 * Label variants
 *
 * Handles floating label behavior for MD3 text fields
 */
export const textFieldLabelVariants = cva(
  [
    // Base label styles
    "absolute left-4 transition-all duration-200 pointer-events-none",
    "text-on-surface-variant origin-top-left",
  ],
  {
    variants: {
      variant: {
        filled: "top-4",
        outlined: "top-3 bg-surface px-1",
      },
      size: {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
      },
      floating: {
        true: "-translate-y-6 scale-75",
        false: "scale-100",
      },
      focused: {
        true: "text-primary",
        false: "",
      },
      error: {
        true: "text-error",
        false: "",
      },
      disabled: {
        true: "text-on-surface/38",
        false: "",
      },
      hasLeadingIcon: {
        true: "left-12",
        false: "",
      },
    },
    compoundVariants: [
      // Outlined variant floating label positioning
      {
        variant: "outlined",
        floating: true,
        className: "-top-2",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "medium",
      floating: false,
      focused: false,
      error: false,
      disabled: false,
      hasLeadingIcon: false,
    },
  }
);

/**
 * Icon container variants
 *
 * Styles for leading and trailing icon containers
 */
export const textFieldIconVariants = cva(
  [
    // Base icon styles
    "absolute flex items-center justify-center",
    "text-on-surface-variant transition-colors duration-200",
    "pointer-events-none",
  ],
  {
    variants: {
      position: {
        leading: "left-3",
        trailing: "right-3",
      },
      size: {
        small: "w-5 h-5",
        medium: "w-6 h-6",
        large: "w-7 h-7",
      },
      disabled: {
        true: "opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      position: "leading",
      size: "medium",
      disabled: false,
    },
  }
);

/**
 * Helper text variants (description and error messages)
 *
 * Styles for text below the input field
 */
export const textFieldHelperTextVariants = cva(
  [
    // Base helper text styles
    "text-xs mt-1 px-4 transition-colors duration-200",
  ],
  {
    variants: {
      type: {
        description: "text-on-surface-variant",
        error: "text-error",
      },
      disabled: {
        true: "opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      type: "description",
      disabled: false,
    },
  }
);

/**
 * Character counter variants
 *
 * Styles for the character count display
 */
export const textFieldCharacterCountVariants = cva(
  [
    // Base character counter styles
    "text-xs mt-1 px-4 text-right text-on-surface-variant transition-colors duration-200",
  ],
  {
    variants: {
      exceeded: {
        true: "text-error",
        false: "",
      },
      disabled: {
        true: "opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      exceeded: false,
      disabled: false,
    },
  }
);

// Export variant types
export type TextFieldContainerVariants = VariantProps<typeof textFieldContainerVariants>;
export type TextFieldWrapperVariants = VariantProps<typeof textFieldWrapperVariants>;
export type TextFieldInputVariants = VariantProps<typeof textFieldInputVariants>;
export type TextFieldLabelVariants = VariantProps<typeof textFieldLabelVariants>;
export type TextFieldIconVariants = VariantProps<typeof textFieldIconVariants>;
export type TextFieldHelperTextVariants = VariantProps<typeof textFieldHelperTextVariants>;
export type TextFieldCharacterCountVariants = VariantProps<typeof textFieldCharacterCountVariants>;
