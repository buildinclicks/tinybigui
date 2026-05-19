import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Search Bar container variants (CVA).
 *
 * Base: 56dp height, full rounded pill, surface-container-high background,
 * level-3 elevation, body-large typography.
 *
 * Spacing follows MD3 Search spec:
 * - Contained (expressive): 4dp leading/trailing with trailing actions
 * - Contained (no actions): 16dp leading/trailing
 * - Divided (baseline): 16dp leading/trailing, 16dp icon-label gap
 *
 * @see docs/md3-components/search/tokens/layout-text.md
 */
export const searchBarVariants = cva(
  [
    "relative flex items-center h-14 rounded-full bg-surface-container-high",
    "shadow-elevation-3 w-full text-body-large cursor-text",
  ],
  {
    variants: {
      style: {
        contained: "",
        divided: "px-4 gap-4",
      },
      noActions: {
        true: "",
        false: "",
      },
      focused: {
        true: "",
        false: "",
      },
      disabled: {
        true: "opacity-38 pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      {
        style: "contained",
        noActions: false,
        class: "px-1 gap-1",
      },
      {
        style: "contained",
        noActions: true,
        class: "px-4",
      },
    ],
    defaultVariants: {
      style: "contained",
      noActions: false,
      focused: false,
      disabled: false,
    },
  }
);

/**
 * Material Design 3 Search View container variants (CVA).
 *
 * Compound variants express all 4 style+layout combinations:
 * - Contained + fullscreen: surface-container-low, no rounding
 * - Contained + docked: surface-container-high, rounded-xl (12dp)
 * - Divided + fullscreen: surface-container-high, no rounding
 * - Divided + docked: surface-container-high, rounded-[28px] (extra-large)
 *
 * @see docs/md3-components/search/tokens/color-tokens-light.md
 */
export const searchViewVariants = cva(["flex flex-col shadow-elevation-3 z-50 overflow-hidden"], {
  variants: {
    style: {
      contained: "",
      divided: "bg-surface-container-high",
    },
    layout: {
      fullscreen: "fixed inset-0",
      docked: "relative min-w-[360px] max-w-[720px] min-h-60 max-h-[66vh] overflow-y-auto",
    },
  },
  compoundVariants: [
    {
      style: "contained",
      layout: "fullscreen",
      class: "bg-surface-container-low rounded-none",
    },
    {
      style: "contained",
      layout: "docked",
      class: "bg-surface-container-high rounded-xl gap-0.5",
    },
    {
      style: "divided",
      layout: "fullscreen",
      class: "bg-surface-container-high rounded-none",
    },
    {
      style: "divided",
      layout: "docked",
      class: "bg-surface-container-high rounded-[28px]",
    },
  ],
  defaultVariants: {
    style: "contained",
    layout: "fullscreen",
  },
});

/**
 * Material Design 3 Search View header variants (CVA).
 *
 * Heights per style + layout:
 * - Contained: 56dp (both layouts)
 * - Divided + fullscreen: 72dp
 * - Divided + docked: 56dp (overridden by docked variant)
 *
 * @see docs/md3-components/search/tokens/layout-text.md
 */
export const searchViewHeaderVariants = cva(
  ["flex items-center w-full bg-surface-container-high gap-1"],
  {
    variants: {
      style: {
        contained: "h-14 px-3",
        divided: "h-[72px] px-4",
      },
      layout: {
        docked: "h-14",
        fullscreen: "",
      },
    },
    defaultVariants: {
      style: "contained",
      layout: "fullscreen",
    },
  }
);

export type SearchBarVariants = VariantProps<typeof searchBarVariants>;
export type SearchViewVariantsType = VariantProps<typeof searchViewVariants>;
export type SearchViewHeaderVariantsType = VariantProps<typeof searchViewHeaderVariants>;
