import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Top App Bar Variants (CVA)
 *
 * Type-safe variant management for AppBar component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * Variants:
 * - `small`: 64dp height (h-appbar-small), title left-aligned, title-large
 * - `center-aligned`: 64dp height (h-appbar-small), title centered, title-large
 * - `medium`: min 112dp height (min-h-appbar-medium), title bottom-left, headline-medium
 * - `large`: min 120dp height (min-h-appbar-large), title bottom-left, display-small
 *
 * Scroll state:
 * - `false`: flat surface, bg-surface, shadow-elevation-0
 * - `true`: bg-surface-container + shadow-elevation-2 (MD3 on-scroll spec)
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
        /** min 112dp, title bottom-left, headline-medium (grows with subtitle) */
        medium: "min-h-appbar-medium",
        /** min 120dp, title bottom-left, display-small (grows with subtitle) */
        large: "min-h-appbar-large",
      },

      /**
       * Scroll state — controls surface elevation and background color
       * MD3: flat surface at rest → surface-container background + elevation-2 on scroll
       */
      scrolled: {
        false: "shadow-elevation-0",
        true: "bg-surface-container shadow-elevation-2",
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
export const appBarTitleVariants = cva("text-on-surface font-normal", {
  variants: {
    variant: {
      /** title-large: 22px / 28px line-height */
      small: "text-title-large truncate",
      /** title-large: 22px / 28px line-height, centered */
      "center-aligned": "text-title-large truncate",
      /** headline-medium: 28px / 36px line-height */
      medium: "text-headline-medium",
      /** display-small: 36px / 44px line-height */
      large: "text-display-small",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

/**
 * Subtitle typography classes per variant
 * Used to apply the correct MD3 type scale and color to the subtitle element.
 * Per MD3 spec (M3 Expressive):
 * - small/center-aligned: title-medium + on-surface-variant (secondary text)
 * - medium/large expanded: title-large/headline-small + on-surface (primary text area)
 */
export const appBarSubtitleVariants = cva("font-normal", {
  variants: {
    variant: {
      /** title-medium: 16px / 24px, on-surface-variant color */
      small: "text-title-medium text-on-surface-variant truncate",
      /** title-medium: 16px / 24px, centered, on-surface-variant color */
      "center-aligned": "text-title-medium text-on-surface-variant truncate",
      /** title-large: 22px / 28px, on-surface color */
      medium: "text-title-large text-on-surface",
      /** headline-small: 24px / 32px, on-surface color */
      large: "text-headline-small text-on-surface",
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
