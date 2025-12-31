import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Button Variants (CVA)
 *
 * Type-safe variant management for Button component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 */
export const buttonVariants = cva(
  [
    // Base classes (always applied)
    "relative inline-flex items-center justify-center",
    "overflow-hidden rounded-full font-medium",
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
        filled: "shadow-none",
        outlined: "bg-transparent border border-outline",
        tonal: "",
        elevated: "shadow-elevation-1",
        text: "bg-transparent",
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
       * Button size
       */
      size: {
        small: "h-8 px-4 text-sm gap-2",
        medium: "h-10 px-6 text-sm gap-2",
        large: "h-12 px-8 text-base gap-3",
      },

      /**
       * Full width variant
       */
      fullWidth: {
        true: "w-full",
        false: "",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "pointer-events-none opacity-38",
        false: "",
      },

      /**
       * Loading state
       */
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },

    /**
     * Compound variants - combinations of variant + color
     */
    compoundVariants: [
      // ====================
      // FILLED VARIANTS
      // ====================
      {
        variant: "filled",
        color: "primary",
        className: "bg-primary text-on-primary",
      },
      {
        variant: "filled",
        color: "secondary",
        className: "bg-secondary text-on-secondary",
      },
      {
        variant: "filled",
        color: "tertiary",
        className: "bg-tertiary text-on-tertiary",
      },
      {
        variant: "filled",
        color: "error",
        className: "bg-error text-on-error",
      },

      // ====================
      // OUTLINED VARIANTS
      // ====================
      {
        variant: "outlined",
        color: "primary",
        className: "text-primary",
      },
      {
        variant: "outlined",
        color: "secondary",
        className: "text-secondary",
      },
      {
        variant: "outlined",
        color: "tertiary",
        className: "text-tertiary",
      },
      {
        variant: "outlined",
        color: "error",
        className: "text-error",
      },

      // ====================
      // TONAL VARIANTS
      // ====================
      {
        variant: "tonal",
        color: "primary",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        variant: "tonal",
        color: "secondary",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        variant: "tonal",
        color: "tertiary",
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        variant: "tonal",
        color: "error",
        className: "bg-error-container text-on-error-container",
      },

      // ====================
      // ELEVATED VARIANTS
      // ====================
      {
        variant: "elevated",
        color: "primary",
        className: "bg-surface-container-low text-primary",
      },
      {
        variant: "elevated",
        color: "secondary",
        className: "bg-surface-container-low text-secondary",
      },
      {
        variant: "elevated",
        color: "tertiary",
        className: "bg-surface-container-low text-tertiary",
      },
      {
        variant: "elevated",
        color: "error",
        className: "bg-surface-container-low text-error",
      },

      // ====================
      // TEXT VARIANTS
      // ====================
      {
        variant: "text",
        color: "primary",
        className: "text-primary",
      },
      {
        variant: "text",
        color: "secondary",
        className: "text-secondary",
      },
      {
        variant: "text",
        color: "tertiary",
        className: "text-tertiary",
      },
      {
        variant: "text",
        color: "error",
        className: "text-error",
      },
    ],

    /**
     * Default variants
     */
    defaultVariants: {
      variant: "filled",
      color: "primary",
      size: "medium",
      fullWidth: false,
      disabled: false,
      loading: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type ButtonVariants = VariantProps<typeof buttonVariants>;
