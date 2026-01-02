import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 IconButton Variants (CVA)
 *
 * Type-safe variant management for IconButton component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * Key differences from Button:
 * - Circular shape (not pill-shaped)
 * - Fixed square dimensions
 * - No text content support
 * - 'standard' variant instead of 'elevated'
 */
export const iconButtonVariants = cva(
  [
    // Base classes (always applied)
    "relative inline-flex items-center justify-center",
    "overflow-hidden rounded-full", // Circular shape
    "transition-all duration-200",
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",

    // State layers (hover, focus, active)
    "before:absolute before:inset-0 before:rounded-[inherit] before:transition-opacity before:duration-200",
    "before:bg-current before:opacity-0",
    "hover:before:opacity-8",
    "focus-visible:before:opacity-12",
    "active:before:opacity-12",
  ],
  {
    variants: {
      /**
       * Button variant (MD3 specification)
       */
      variant: {
        standard: "bg-transparent", // No background
        filled: "shadow-none", // Solid background
        tonal: "", // Container background
        outlined: "bg-transparent border border-outline",
      },

      /**
       * Color scheme (MD3 color roles)
       */
      color: {
        primary: "",
        secondary: "",
        tertiary: "",
        error: "",
      },

      /**
       * Button size (square dimensions)
       */
      size: {
        small: "h-8 w-8", // 32×32px
        medium: "h-10 w-10", // 40×40px (default)
        large: "h-12 w-12", // 48×48px
      },

      /**
       * Selected state (for toggle buttons)
       */
      selected: {
        true: "",
        false: "",
      },

      /**
       * Disabled state
       */
      isDisabled: {
        true: "pointer-events-none cursor-not-allowed opacity-38",
        false: "",
      },
    },

    /**
     * Compound variants - combinations of variant + color + selected
     */
    compoundVariants: [
      // ====================
      // STANDARD VARIANTS
      // ====================
      {
        variant: "standard",
        selected: false,
        className: "text-on-surface-variant",
      },
      {
        variant: "standard",
        selected: true,
        className: "text-primary",
      },

      // ====================
      // FILLED VARIANTS (UNSELECTED)
      // ====================
      {
        variant: "filled",
        color: "primary",
        selected: false,
        className: "bg-primary text-on-primary",
      },
      {
        variant: "filled",
        color: "secondary",
        selected: false,
        className: "bg-secondary text-on-secondary",
      },
      {
        variant: "filled",
        color: "tertiary",
        selected: false,
        className: "bg-tertiary text-on-tertiary",
      },
      {
        variant: "filled",
        color: "error",
        selected: false,
        className: "bg-error text-on-error",
      },

      // ====================
      // FILLED VARIANTS (SELECTED - uses container colors)
      // ====================
      {
        variant: "filled",
        color: "primary",
        selected: true,
        className: "bg-primary-container text-on-primary-container",
      },
      {
        variant: "filled",
        color: "secondary",
        selected: true,
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        variant: "filled",
        color: "tertiary",
        selected: true,
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        variant: "filled",
        color: "error",
        selected: true,
        className: "bg-error-container text-on-error-container",
      },

      // ====================
      // TONAL VARIANTS (UNSELECTED)
      // ====================
      {
        variant: "tonal",
        color: "primary",
        selected: false,
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        variant: "tonal",
        color: "secondary",
        selected: false,
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        variant: "tonal",
        color: "tertiary",
        selected: false,
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        variant: "tonal",
        color: "error",
        selected: false,
        className: "bg-error-container text-on-error-container",
      },

      // ====================
      // TONAL VARIANTS (SELECTED - uses tertiary container)
      // ====================
      {
        variant: "tonal",
        selected: true,
        className: "bg-tertiary-container text-on-tertiary-container",
      },

      // ====================
      // OUTLINED VARIANTS (UNSELECTED)
      // ====================
      {
        variant: "outlined",
        selected: false,
        className: "text-on-surface-variant",
      },

      // ====================
      // OUTLINED VARIANTS (SELECTED - uses inverse colors)
      // ====================
      {
        variant: "outlined",
        selected: true,
        className: "bg-inverse-surface text-inverse-on-surface border-transparent",
      },
    ],

    /**
     * Default variants
     */
    defaultVariants: {
      variant: "standard",
      color: "primary",
      size: "medium",
      selected: false,
      isDisabled: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type IconButtonVariants = VariantProps<typeof iconButtonVariants>;
