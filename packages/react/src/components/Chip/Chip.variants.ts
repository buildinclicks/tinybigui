import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Chip Variants (CVA)
 *
 * Covers all four chip types (assist, filter, input, suggestion) with
 * surface, selection, disabled, and padding variants.
 *
 * Padding resolution (via tailwind-merge in `cn()`):
 *   base `px-4`  →  hasLeadingIcon overrides with `pl-3 pr-4`
 *                →  hasRemoveButton overrides with `pl-3 pr-3`
 * Both can be combined and the last-applied wins through tailwind-merge.
 */
export const chipVariants = cva(
  [
    // Base layout — always applied
    "relative inline-flex items-center overflow-hidden rounded-sm h-8",
    "text-label-large cursor-pointer gap-1 group px-4",
    // Focus ring
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      /**
       * MD3 chip type — determines interaction model and default styling.
       */
      chipType: {
        assist: "",
        // Filter and Input chips have a fixed tonal surface style.
        // The transition is on the base class so deselection also animates
        // (adding it only in the selected compound variant would mean the
        // transition property disappears at the same moment the color reverts,
        // causing an instant jump back to the unselected color).
        filter:
          "bg-surface-container-low text-on-surface border border-outline-variant transition-[background-color,color] duration-short4 ease-standard",
        input: "bg-surface-container-low text-on-surface border border-outline-variant",
        suggestion: "",
      },

      /**
       * Surface style for Assist and Suggestion chips only.
       * Applied via compound variants so it has no effect on Filter/Input.
       */
      surface: {
        tonal: "",
        elevated: "",
      },

      /**
       * Selected state — only meaningful for Filter chips.
       * Applied via compound variant.
       */
      selected: {
        true: "",
        false: "",
      },

      /**
       * MD3 disabled state: content 38% opacity, border 12% opacity, no background.
       * Kept here only for `pointer-events-none`; color/bg overrides live in the
       * disabled compound variants at the bottom so they win over surface compounds.
       */
      isDisabled: {
        true: "pointer-events-none",
        false: "",
      },

      /**
       * Adjusts leading padding when a leading icon is present.
       * Overrides the base `px-4` → `pl-3 pr-4`.
       */
      hasLeadingIcon: {
        true: "pl-3 pr-4",
        false: "",
      },

      /**
       * Adjusts trailing padding for Input chips with a remove button.
       * Takes precedence over hasLeadingIcon via tailwind-merge: `pl-3 pr-3`.
       */
      hasRemoveButton: {
        true: "pl-3 pr-3",
        false: "",
      },
    },

    compoundVariants: [
      // ── Assist chip surfaces ───────────────────────────────────────────────
      {
        chipType: "assist",
        surface: "tonal",
        className: "bg-surface-container-low text-on-surface border border-outline-variant",
      },
      {
        chipType: "assist",
        surface: "elevated",
        className: [
          "bg-surface-container-low text-on-surface shadow-elevation-1",
          "hover:shadow-elevation-2 transition-shadow duration-short2 ease-standard",
        ],
      },

      // ── Suggestion chip surfaces ───────────────────────────────────────────
      {
        chipType: "suggestion",
        surface: "tonal",
        className: "bg-surface-container-low text-on-surface border border-outline-variant",
      },
      {
        chipType: "suggestion",
        surface: "elevated",
        className: [
          "bg-surface-container-low text-on-surface shadow-elevation-1",
          "hover:shadow-elevation-2 transition-shadow duration-short2 ease-standard",
        ],
      },

      // ── Filter chip selected state ─────────────────────────────────────────
      {
        chipType: "filter",
        selected: true,
        className: "bg-secondary-container text-on-secondary-container border-0",
      },

      // ── Disabled overrides — placed last so they always win ────────────────
      // These must follow all surface/selection compound variants to ensure
      // tailwind-merge keeps the disabled classes over any surface classes.
      {
        isDisabled: true,
        className: "text-on-surface/38 border-on-surface/12 bg-transparent",
      },
    ],

    defaultVariants: {
      chipType: "assist",
      surface: "tonal",
      selected: false,
      isDisabled: false,
      hasLeadingIcon: false,
      hasRemoveButton: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type ChipVariants = VariantProps<typeof chipVariants>;
