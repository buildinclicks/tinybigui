import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 FAB Variants (CVA)
 *
 * Type-safe variant management for FAB component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * Key differences from Button/IconButton:
 * - NOT fully rounded (uses specific corner radius: 12px/16px/28px)
 * - Always has elevation (shadow-elevation-3)
 * - Larger sizes (40px/56px/96px)
 * - Extended variant with variable width
 */
export const fabVariants = cva(
  [
    // Base classes (always applied)
    "relative inline-flex items-center justify-center",
    "overflow-hidden",
    "transition-all duration-200",
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
    "shrink-0", // Prevent shrinking in flex containers

    // State layers (hover, focus, active)
    "before:absolute before:inset-0 before:rounded-[inherit] before:transition-opacity before:duration-200",
    "before:bg-current before:opacity-0",
    "hover:before:opacity-8",
    "focus-visible:before:opacity-12",
    "active:before:opacity-12",

    // Elevation (floating appearance)
    "shadow-elevation-3", // Default elevation
    "hover:shadow-elevation-4", // Hover elevation
  ],
  {
    variants: {
      /**
       * FAB size (controls dimensions and icon size)
       */
      size: {
        small: [
          "h-10 w-10", // 40×40px
          "p-2", // 8px padding for 24px icon
          "rounded-xl", // 12px corner radius (not fully rounded!)
          "m-1", // 4px margin for 48×48px touch target
        ],
        medium: [
          "h-14 w-14", // 56×56px
          "p-4", // 16px padding for 24px icon
          "rounded-2xl", // 16px corner radius
        ],
        large: [
          "h-24 w-24", // 96×96px
          "p-[30px]", // 30px padding for 36px icon
          "rounded-[28px]", // 28px corner radius (custom value)
        ],
        extended: [
          "h-14", // 56px height (same as medium)
          "rounded-2xl", // 16px corner radius
          "pl-4 pr-5", // Asymmetric padding: 16px leading, 20px trailing
          "gap-2", // 8px gap between icon and text
        ],
      },

      /**
       * Color scheme (MD3 color roles)
       */
      color: {
        primary: "",
        secondary: "",
        tertiary: "",
        surface: "",
      },

      /**
       * Disabled state
       */
      isDisabled: {
        true: "pointer-events-none cursor-not-allowed !bg-on-surface/12 !text-on-surface/38 !shadow-none",
        false: "",
      },
    },

    /**
     * Compound variants - combinations of size + color
     */
    compoundVariants: [
      // ====================
      // PRIMARY COLOR
      // ====================
      {
        color: "primary",
        size: "small",
        className: "bg-primary-container text-on-primary-container",
      },
      {
        color: "primary",
        size: "medium",
        className: "bg-primary-container text-on-primary-container",
      },
      {
        color: "primary",
        size: "large",
        className: "bg-primary-container text-on-primary-container",
      },
      {
        color: "primary",
        size: "extended",
        className: "bg-primary-container text-on-primary-container",
      },

      // ====================
      // SECONDARY COLOR
      // ====================
      {
        color: "secondary",
        size: "small",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        color: "secondary",
        size: "medium",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        color: "secondary",
        size: "large",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        color: "secondary",
        size: "extended",
        className: "bg-secondary-container text-on-secondary-container",
      },

      // ====================
      // TERTIARY COLOR
      // ====================
      {
        color: "tertiary",
        size: "small",
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        color: "tertiary",
        size: "medium",
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        color: "tertiary",
        size: "large",
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        color: "tertiary",
        size: "extended",
        className: "bg-tertiary-container text-on-tertiary-container",
      },

      // ====================
      // SURFACE COLOR
      // ====================
      {
        color: "surface",
        size: "small",
        className: "bg-surface text-primary",
      },
      {
        color: "surface",
        size: "medium",
        className: "bg-surface text-primary",
      },
      {
        color: "surface",
        size: "large",
        className: "bg-surface text-primary",
      },
      {
        color: "surface",
        size: "extended",
        className: "bg-surface text-primary",
      },
    ],

    /**
     * Default variants
     */
    defaultVariants: {
      size: "medium",
      color: "primary",
      isDisabled: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type FABVariants = VariantProps<typeof fabVariants>;
