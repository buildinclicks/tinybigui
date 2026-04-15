import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Top App Bar Variants (CVA)
 *
 * Type-safe variant management for AppBar component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * Variants:
 * - `small`: 64dp height (h-appbar-small), title left-aligned
 * - `center-aligned`: 64dp height (h-appbar-small), title centered
 * - `medium`: 112dp height (h-appbar-medium), title bottom-left
 * - `large`: 152dp height (h-appbar-large), title bottom-left
 *
 * Scroll state:
 * - `false`: flat surface, shadow-elevation-0
 * - `true`: elevated surface, shadow-elevation-2
 *
 * @see https://m3.material.io/components/top-app-bar/specs
 */
export const appBarVariants = cva(
  [
    // Base classes (always applied)
    "w-full",
    "bg-surface text-on-surface",
    "flex flex-col",
    // Elevation transition using MD3 motion tokens
    "transition-shadow duration-medium2 ease-standard",
  ],
  {
    variants: {
      /**
       * Size variant (MD3 specification)
       * Controls bar height, title placement, and type scale
       */
      variant: {
        /** 64dp, title left-aligned, title-large */
        small: "h-appbar-small",
        /** 64dp, title centered, title-large */
        "center-aligned": "h-appbar-small variant-center-aligned",
        /** 112dp, title bottom-left, headline-small */
        medium: "h-appbar-medium",
        /** 152dp, title bottom-left, display-small */
        large: "h-appbar-large",
      },

      /**
       * Scroll state — controls surface elevation
       * MD3: flat at rest, elevated on scroll
       */
      scrolled: {
        false: "shadow-elevation-0",
        true: "shadow-elevation-2",
      },
    },

    defaultVariants: {
      variant: "small",
      scrolled: false,
    },
  }
);

/**
 * Title typography classes per variant
 * Used to apply the correct MD3 type scale to the title element
 */
export const appBarTitleVariants = cva("text-on-surface font-normal truncate", {
  variants: {
    variant: {
      small: "text-title-large",
      "center-aligned": "text-title-large",
      medium: "text-headline-small",
      large: "text-display-small",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

/**
 * Extract variant prop types from CVA
 */
export type AppBarVariants = VariantProps<typeof appBarVariants>;
