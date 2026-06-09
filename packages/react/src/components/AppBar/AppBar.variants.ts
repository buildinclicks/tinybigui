import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Top App Bar — Slot CVA Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (variant = size/layout choice).
 * - Scroll elevation state is driven by data-scrolled on the root via
 *   group-data-[scrolled]/appbar selectors — NOT a CVA variant.
 * - With-subtitle growth (136/152dp) is driven by data-with-subtitle via
 *   group-data-[with-subtitle]/appbar selectors.
 *
 * Slot responsibilities:
 *   appBarVariants          — root <header>; container color, elevation, motion, scroll state
 *   appBarTopRowVariants    — leading nav + collapsed title + trailing actions row
 *   appBarLeadingVariants   — nav icon slot wrapper (leading)
 *   appBarHeadlineBlockVariants — collapsed title+subtitle block (small / center-aligned only)
 *   appBarTitleVariants     — title text; per-variant type scale
 *   appBarSubtitleVariants  — subtitle text; per-variant type scale (M3 Expressive flexible)
 *   appBarTrailingVariants  — action icon slot wrapper (trailing)
 *   appBarExpandedTitleVariants — expanded title+subtitle block (medium / large only)
 *
 * M3 Expressive Flexible type scales:
 *   Title:
 *     small / center-aligned (collapsed): title-large
 *     medium (expanded):                  headline-medium
 *     large (expanded):                   display-small
 *
 *   Subtitle (M3 Expressive Flexible — corrected from prior implementation):
 *     small / center-aligned (collapsed): label-medium
 *     medium (expanded):                  label-large
 *     large (expanded):                   title-medium
 *
 *   Subtitle color: always on-surface-variant (corrected for medium/large)
 *
 * Heights (M3 Expressive flexible):
 *   small / center-aligned: 64dp (fixed)
 *   medium: 112dp no subtitle / 136dp with subtitle
 *   large:  120dp no subtitle / 152dp with subtitle
 *
 * Scroll state (MD3):
 *   At rest:   bg-surface + shadow-elevation-0
 *   On scroll: bg-surface-container + shadow-elevation-2
 *
 * Motion:
 *   background-color + box-shadow are effects properties → standard effects spring pair
 *   (duration-spring-standard-default-effects + ease-spring-standard-default-effects)
 *
 * @see https://m3.material.io/components/app-bars/specs
 */

// ─── ROOT / CONTAINER ─────────────────────────────────────────────────────────

/**
 * Root <header> element.
 *
 * - Scroll elevation state is driven by group-data-[scrolled]/appbar selectors.
 * - With-subtitle height growth uses group-data-[with-subtitle]/appbar selectors.
 * - Motion: background-color and box-shadow are effects properties — use the
 *   standard effects spring pair (no overshoot on color/opacity).
 */
export const appBarVariants = cva(
  [
    // Layout
    "w-full flex flex-col",
    // Color (base — at rest)
    "bg-surface text-on-surface",
    // Elevation base
    "shadow-elevation-0",
    // Scroll state — effects properties animated with standard spring (no overshoot)
    "transition-[background-color,box-shadow]",
    "duration-spring-standard-default-effects",
    "ease-spring-standard-default-effects",
    // On scroll: surface-container background + elevation-2
    "group-data-[scrolled]/appbar:bg-surface-container",
    "group-data-[scrolled]/appbar:shadow-elevation-2",
  ],
  {
    variants: {
      /**
       * Size variant — controls bar height and which title row is shown.
       * With-subtitle height growth is handled via group-data-[with-subtitle]/appbar below.
       */
      variant: {
        /** 64dp fixed — title left-aligned in top row */
        small: "h-appbar-small",
        /** 64dp fixed — title centered in top row */
        "center-aligned": "h-appbar-small",
        /**
         * 112dp no-subtitle / 136dp with-subtitle — title in expanded bottom row.
         * group-data-[with-subtitle]/appbar switches to the taller token.
         */
        medium: [
          "min-h-appbar-medium",
          "group-data-[with-subtitle]/appbar:min-h-appbar-medium-subtitle",
        ],
        /**
         * 120dp no-subtitle / 152dp with-subtitle — title in expanded bottom row.
         * group-data-[with-subtitle]/appbar switches to the taller token.
         */
        large: [
          "min-h-appbar-large",
          "group-data-[with-subtitle]/appbar:min-h-appbar-large-subtitle",
        ],
      },
    },
    defaultVariants: {
      variant: "small",
    },
  }
);

// ─── TOP ROW ──────────────────────────────────────────────────────────────────

/**
 * The top row containing the leading nav slot, optional collapsed title block,
 * and trailing actions slot.
 *
 * - small / center-aligned: flex-1 to fill the full fixed bar height.
 * - medium / large: fixed 64dp (h-16) so title block can be positioned below.
 */
export const appBarTopRowVariants = cva(["flex items-center justify-between", "px-1"], {
  variants: {
    variant: {
      small: "flex-1",
      "center-aligned": "flex-1",
      medium: "h-16 shrink-0",
      large: "h-16 shrink-0",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

// ─── LEADING SLOT (nav icon) ───────────────────────────────────────────────────

/**
 * Wrapper for the navigation icon in the leading position.
 * Provides correct color context for icon buttons that inherit currentColor.
 */
export const appBarLeadingVariants = cva(["flex shrink-0 items-center", "text-on-surface"]);

// ─── HEADLINE BLOCK (collapsed title + subtitle — small / center-aligned) ────

/**
 * The title + subtitle block rendered in the top row.
 * Only shown for small and center-aligned variants.
 *
 * center-aligned: title and subtitle are horizontally centered.
 */
export const appBarHeadlineBlockVariants = cva(
  ["flex min-w-0 flex-1 flex-col justify-center", "px-1"],
  {
    variants: {
      variant: {
        small: "",
        "center-aligned": "items-center text-center",
        medium: "",
        large: "",
      },
    },
    defaultVariants: {
      variant: "small",
    },
  }
);

// ─── TITLE ────────────────────────────────────────────────────────────────────

/**
 * Title text element.
 *
 * Type scales per M3 Expressive flexible spec:
 *   small / center-aligned: title-large (22px / 28px), truncated
 *   medium expanded:        headline-medium (28px / 36px)
 *   large expanded:         display-small (36px / 44px)
 */
export const appBarTitleVariants = cva("text-on-surface font-normal", {
  variants: {
    variant: {
      small: "text-title-large truncate",
      "center-aligned": "text-title-large truncate",
      medium: "text-headline-medium",
      large: "text-display-small",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

// ─── SUBTITLE ─────────────────────────────────────────────────────────────────

/**
 * Subtitle text element (M3 Expressive flexible — corrected type scales).
 *
 * Type scales per M3 Expressive Flexible AppBar spec:
 *   small / center-aligned: label-medium (11px / 16px), on-surface-variant, truncated
 *   medium expanded:        label-large (14px / 20px), on-surface-variant
 *   large expanded:         title-medium (16px / 24px), on-surface-variant
 *
 * Note: subtitle is always on-surface-variant across all variants
 * (corrected from prior implementation which used on-surface for medium/large).
 */
export const appBarSubtitleVariants = cva("text-on-surface-variant font-normal", {
  variants: {
    variant: {
      small: "text-label-medium truncate",
      "center-aligned": "text-label-medium truncate",
      medium: "text-label-large",
      large: "text-title-medium",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

// ─── TRAILING SLOT (action icons) ─────────────────────────────────────────────

/**
 * Wrapper for trailing action icon buttons.
 * Provides secondary icon color context per MD3 spec.
 */
export const appBarTrailingVariants = cva([
  "flex shrink-0 items-center gap-0.5",
  "text-on-surface-variant",
]);

// ─── EXPANDED TITLE BLOCK (medium / large only) ────────────────────────────────

/**
 * The expanded title + subtitle block rendered below the top row.
 * Only shown for medium and large variants.
 *
 * Grows to fill remaining space, positioning title at the bottom of the bar.
 */
export const appBarExpandedTitleVariants = cva([
  "flex flex-1 flex-col justify-end",
  "gap-0.5 px-4 pb-4",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type AppBarVariants = VariantProps<typeof appBarVariants>;
export type AppBarTopRowVariants = VariantProps<typeof appBarTopRowVariants>;
export type AppBarHeadlineBlockVariants = VariantProps<typeof appBarHeadlineBlockVariants>;
export type AppBarTitleVariants = VariantProps<typeof appBarTitleVariants>;
export type AppBarSubtitleVariants = VariantProps<typeof appBarSubtitleVariants>;
