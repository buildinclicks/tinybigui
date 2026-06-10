/**
 * TextField Variants
 *
 * CVA (class-variance-authority) variant definitions for the MD3 TextField.
 *
 * Architecture: Variants vs States
 * - CVA holds design-time choices only (variant, position, type).
 * - All interaction/selection states are driven by data-* attributes on the
 *   root via group-data-[x]/text-field Tailwind selectors in each slot's
 *   base classes — no state variants or state compoundVariants in CVA.
 *
 * Slot responsibilities:
 *   textFieldRootVariants          — outer wrapper; carries group/text-field; fullWidth
 *   textFieldFieldVariants         — 56dp visual box; variant-specific shape & bg
 *   textFieldStateLayerVariants    — filled-only hover/focus/pressed opacity ring
 *   textFieldActiveIndicatorVariants — filled-only bottom line (height + color)
 *   textFieldOutlineVariants       — outlined-only <fieldset> border
 *   textFieldNotchVariants         — outlined-only <legend> that creates the gap
 *   textFieldLabelVariants         — floating label; position differs per variant
 *   textFieldInputVariants         — <input> / <textarea>; layout adjustments per variant
 *   textFieldIconVariants          — leading / trailing icon wrapper
 *   textFieldAffixVariants         — prefix / suffix text
 *   textFieldSupportingRowVariants — flex row below field (text + counter)
 *   textFieldSupportingTextVariants — supporting / error text (left slot)
 *   textFieldCounterVariants       — character counter (right slot)
 *
 * MD3 Spec:
 *   Field height:   56dp (h-14)
 *   Shape filled:   top corners 4dp (rounded-t-xs), bottom none
 *   Shape outlined: all corners 4dp (rounded-xs)
 *   Typography:     body-large for input/label-resting/prefix/suffix
 *                   body-small for label-floating / supporting text / counter
 *   State layers:   hover 8% | focus 10% | pressed 10%
 *   Disabled:       container bg-on-surface/4, content text-on-surface/38
 *   Motion:         Standard fast (utility UI, no Expressive overshoot)
 */

import { cva, type VariantProps } from "class-variance-authority";

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Outer wrapper div — carries `group/text-field` and `fullWidth`.
 * All data-* attributes are set here so every child slot can read them
 * via `group-data-[x]/text-field:` selectors.
 */
export const textFieldRootVariants = cva(["relative inline-flex flex-col"], {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

// ─── FIELD BOX ────────────────────────────────────────────────────────────────

/**
 * The 56dp visual container that wraps the input and icons.
 * Filled: top-rounded, background from surface-container-highest.
 * Outlined: all-rounded, transparent background, no indicator line.
 *
 * overflow-hidden is deliberately NOT set here — the focus outline on the
 * outlined variant and the state layer on the filled variant need it on their
 * own elements to avoid clipping issues.
 */
export const textFieldFieldVariants = cva(
  [
    "relative flex items-center w-full min-h-14",
    // Cursor — disabled via group-data
    "group-data-[disabled]/text-field:cursor-not-allowed",
    "group-data-[disabled]/text-field:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        filled: [
          "rounded-t-xs bg-surface-container-highest",
          // Disabled: background fades to on-surface/4
          "group-data-[disabled]/text-field:bg-on-surface/4",
        ],
        outlined: ["rounded-xs bg-transparent"],
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  }
);

// ─── STATE LAYER (filled only) ────────────────────────────────────────────────

/**
 * Hover/focus/pressed opacity ring — filled variant only.
 * absolute inset-0 so it covers the entire field box.
 * overflow-hidden + rounded-[inherit] clips to the field shape.
 * Color: on-surface at rest; opacities applied per interaction state.
 */
export const textFieldStateLayerVariants = cva([
  "absolute inset-0 rounded-t-xs pointer-events-none opacity-0",
  "bg-on-surface",
  // Effects transition — no spatial overshoot on opacity
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hover: 8%
  "group-data-[hovered]/text-field:opacity-8",
  // Focus: 10% (focus wins over hover via cascade order — placed after)
  "group-data-[focused]/text-field:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/text-field:hidden",
]);

// ─── ACTIVE INDICATOR (filled only) ──────────────────────────────────────────

/**
 * The bottom border line for the filled variant.
 *
 * Height: 1px at rest → 2px focused/invalid (spatial token — height is spatial).
 * Color transitions use effects token.
 *
 * Uses CSS variables so both height and color can be driven independently.
 */
export const textFieldActiveIndicatorVariants = cva([
  "absolute bottom-0 left-0 right-0 pointer-events-none",
  // Spatial transition: height is a spatial property
  "transition-[height,background-color]",
  "duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
  // Base
  "h-px bg-on-surface-variant",
  // Hover
  "group-data-[hovered]/text-field:bg-on-surface",
  // Focused — 2px + primary color (focused placed after hovered to win cascade)
  "group-data-[focused]/text-field:h-0.5 group-data-[focused]/text-field:bg-primary",
  // Invalid
  "group-data-[invalid]/text-field:bg-error",
  // Invalid + focused
  "group-data-[invalid]/text-field:group-data-[focused]/text-field:bg-error",
  // Disabled: hidden
  "group-data-[disabled]/text-field:hidden",
]);

// ─── OUTLINE (outlined only) ──────────────────────────────────────────────────

/**
 * The <fieldset> border for the outlined variant.
 *
 * Sits absolutely to fill the field box. The legend inside creates the notch.
 * pointer-events-none so clicks fall through to the input.
 *
 * Border width: 1px base → 2px focused/invalid (spatial — border-width is spatial).
 * Color uses effects token.
 */
export const textFieldOutlineVariants = cva([
  "absolute inset-0 rounded-xs m-0 px-2 pointer-events-none",
  "border border-outline",
  // Effects transition for color; spatial for border-width
  "transition-[border-color,border-width]",
  "duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hover
  "group-data-[hovered]/text-field:border-on-surface",
  // Focused — 2px + primary color
  "group-data-[focused]/text-field:border-2 group-data-[focused]/text-field:border-primary",
  // Invalid
  "group-data-[invalid]/text-field:border-error",
  // Invalid + focused
  "group-data-[invalid]/text-field:group-data-[focused]/text-field:border-2",
  "group-data-[invalid]/text-field:group-data-[focused]/text-field:border-error",
  // Disabled
  "group-data-[disabled]/text-field:border-on-surface/12",
]);

// ─── NOTCH (outlined label gap) ───────────────────────────────────────────────

/**
 * The <legend> element inside the outlined fieldset that creates the gap for
 * the floating label. aria-hidden on the fieldset.
 *
 * At rest (label not floating): max-w-0 / opacity-0 so the border is unbroken.
 * When label floats (data-float): max-w grows to the measured label width.
 *
 * Because we cannot measure label width with pure CSS, we use a text-transparent
 * copy of the label inside the legend that takes up space — this is the standard
 * MUI/MD web approach.
 */
export const textFieldNotchVariants = cva([
  "invisible whitespace-nowrap text-body-small px-1",
  // 0 width when not floating (no gap)
  "max-w-0 overflow-hidden",
  // Full width when floating (gap opens)
  "group-data-[float]/text-field:max-w-full",
  // Spatial transition for max-width change
  "transition-[max-width] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Floating label.
 *
 * Resting state:  body-large, centered vertically inside the field (via absolute top-1/2)
 * Floating state: body-small, translated up to sit at the top edge
 *
 * Filled:   floating label rests in top 8dp padding zone
 * Outlined: floating label sits on top of the border (translateY(-50%) from top edge)
 *
 * Color:
 *   rest:     on-surface-variant
 *   focused:  primary
 *   invalid:  error
 *   disabled: on-surface/38
 *
 * The transform (translate) is spatial; color is effects.
 * We use a single transition-all with the spatial token since the spatial
 * token uses a standard (no-overshoot) spring — safe for text.
 */
export const textFieldLabelVariants = cva(
  [
    "absolute pointer-events-none origin-top-left select-none",
    "text-body-large text-on-surface-variant",
    // Spatial + effects both use standard fast — no overshoot on font/color
    "transition-[transform,font-size,color,line-height]",
    "duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
    // Disabled
    "group-data-[disabled]/text-field:text-on-surface/38",
    // Invalid (placed after default, before focused so focused invalid wins)
    "group-data-[invalid]/text-field:text-error",
    // Focused (singly-chained wins by cascade order)
    "group-data-[focused]/text-field:text-primary",
    // Invalid + focused — doubly-chained, wins over single-chained focused
    "group-data-[invalid]/text-field:group-data-[focused]/text-field:text-error",
  ],
  {
    variants: {
      variant: {
        /**
         * Filled: label rests at center (top-1/2 -translate-y-1/2).
         * When floating: moves up to top-2 (8dp) with body-small size.
         */
        filled: [
          "top-1/2 -translate-y-1/2 left-4",
          // Floated position — sits in the top 8dp zone
          "group-data-[float]/text-field:top-2 group-data-[float]/text-field:-translate-y-0",
          "group-data-[float]/text-field:text-body-small",
          // Leading-icon offset
          "group-data-[with-leading-icon]/text-field:left-[52px]",
        ],
        /**
         * Outlined: label rests at center (top-1/2 -translate-y-1/2).
         * When floating: moves up to sit on the top border (-translate-y-1/2 from top-0).
         */
        outlined: [
          "top-1/2 -translate-y-1/2 left-3",
          // bg-surface ensures label text punches through the border
          "bg-surface px-1",
          // Floated: sits on the top border
          "group-data-[float]/text-field:top-0 group-data-[float]/text-field:-translate-y-1/2",
          "group-data-[float]/text-field:text-body-small",
          // Leading-icon offset
          "group-data-[with-leading-icon]/text-field:left-[52px]",
        ],
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  }
);

// ─── INPUT / TEXTAREA ─────────────────────────────────────────────────────────

/**
 * The actual <input> or <textarea> element.
 *
 * body-large, on-surface text, transparent background so the field box shows.
 * padding-top pushes text down to make room for the floating label in the
 * filled variant (when label is present).
 *
 * placeholder is hidden by default (opacity-0) and shown only when label is
 * not present or has floated — so there's no text overlap.
 */
export const textFieldInputVariants = cva(
  [
    "relative z-10 w-full bg-transparent outline-none border-none",
    "text-body-large text-on-surface",
    "placeholder:text-on-surface-variant",
    // Placeholder hidden unless field is floating (avoids overlap with label)
    "placeholder:opacity-0",
    "group-data-[float]/text-field:placeholder:opacity-100",
    // Disabled
    "group-data-[disabled]/text-field:text-on-surface/38",
    "group-data-[disabled]/text-field:cursor-not-allowed",
    // Readonly
    "group-data-[readonly]/text-field:cursor-default",
    // Effects transition for color
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      variant: {
        /**
         * Filled: top padding creates room for floating label (label rests at 8dp).
         * Horizontal padding: 16dp left / 16dp right — but yielded to prefix/suffix
         * when they are present so the affix handles the edge spacing instead.
         */
        filled: [
          "pt-6 pb-2 px-4",
          // No label present: vertically center
          "group-data-[no-label]/text-field:py-4",
          // Leading icon horizontal offset
          "group-data-[with-leading-icon]/text-field:pl-[52px]",
          // Trailing icon horizontal offset
          "group-data-[with-trailing-icon]/text-field:pr-[52px]",
          // Prefix present: prefix handles left edge — remove input's left padding
          "group-data-[with-prefix]/text-field:pl-0",
          // Leading icon + prefix together: compound wins over both singles
          "group-data-[with-leading-icon]/text-field:group-data-[with-prefix]/text-field:pl-0",
          // Suffix present: suffix handles right edge — remove input's right padding
          "group-data-[with-suffix]/text-field:pr-0",
          // Trailing icon + suffix together: compound wins over both singles
          "group-data-[with-trailing-icon]/text-field:group-data-[with-suffix]/text-field:pr-0",
        ],
        /**
         * Outlined: label sits on the border, no extra top padding needed.
         * Horizontal padding: 16dp — yielded to prefix/suffix when present.
         */
        outlined: [
          "py-4 px-4",
          // Leading icon horizontal offset
          "group-data-[with-leading-icon]/text-field:pl-[52px]",
          // Trailing icon horizontal offset
          "group-data-[with-trailing-icon]/text-field:pr-[52px]",
          // Prefix present: prefix handles left edge
          "group-data-[with-prefix]/text-field:pl-0",
          "group-data-[with-leading-icon]/text-field:group-data-[with-prefix]/text-field:pl-0",
          // Suffix present: suffix handles right edge
          "group-data-[with-suffix]/text-field:pr-0",
          "group-data-[with-trailing-icon]/text-field:group-data-[with-suffix]/text-field:pr-0",
        ],
      },
      multiline: {
        true: "resize-y min-h-[1.5rem]",
        false: "h-full",
      },
    },
    defaultVariants: {
      variant: "filled",
      multiline: false,
    },
  }
);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Leading / trailing icon wrapper.
 *
 * MD3 spec: icons are 24×24dp, 12dp from the edge (left-3 / right-3).
 * Color: on-surface-variant; trailing icon → error when invalid.
 */
export const textFieldIconVariants = cva(
  [
    "absolute z-10 flex items-center justify-center size-6 pointer-events-none",
    "text-on-surface-variant",
    // Effects transition
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled
    "group-data-[disabled]/text-field:text-on-surface/38",
  ],
  {
    variants: {
      position: {
        leading: "left-3",
        trailing: [
          "right-3",
          // Trailing → error color when invalid
          "group-data-[invalid]/text-field:text-error",
        ],
      },
    },
    defaultVariants: {
      position: "leading",
    },
  }
);

// ─── AFFIX (prefix / suffix) ──────────────────────────────────────────────────

/**
 * Inline prefix and suffix text — visible only when the field is floated.
 * body-large, on-surface-variant color.
 *
 * Vertical alignment:
 *   Filled  — matches the input's pt-6 pb-2 padding so the text baseline aligns
 *             with the input text in the lower zone of the 56dp container.
 *             When no label is present the input uses py-4, so we mirror that.
 *   Outlined — input uses py-4 which centres text at 28px; naturally-sized affix
 *             is already centred there by items-center on the content column.
 *
 * Horizontal alignment:
 *   Prefix  — pl-4 aligns its left text edge to the field's 16dp start margin
 *             (same as label left-4 and the default input pl-4). With a leading
 *             icon the offset grows to 52dp to clear the icon zone.
 *             pr-0.5 provides a small gap between the prefix text and the cursor.
 *   Suffix  — pl-0.5 provides a small gap between the input text and the suffix.
 *             pr-4 keeps 16dp from the right edge. With a trailing icon the
 *             offset grows to 52dp to avoid overlapping the icon.
 */
export const textFieldAffixVariants = cva(
  [
    "relative z-10 text-body-large text-on-surface-variant select-none shrink-0",
    "opacity-0 pointer-events-none",
    // Visible once label is floated
    "group-data-[float]/text-field:opacity-100 group-data-[float]/text-field:pointer-events-auto",
    // Effects transition
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled
    "group-data-[disabled]/text-field:text-on-surface/38",
  ],
  {
    variants: {
      variant: {
        /**
         * Filled: mirror the input's pt-6 pb-2 so the text sits in the same
         * vertical zone. When no label is present, the input uses py-4 — match
         * that too so the affix stays centred with the input text.
         */
        filled: [
          "pt-6 pb-2",
          "group-data-[no-label]/text-field:pt-4 group-data-[no-label]/text-field:pb-4",
        ],
        /**
         * Outlined: input uses py-4 and h-full; items-center on the content
         * column already centres the naturally-sized affix at the same 28px
         * midpoint as the input text. No extra vertical padding needed.
         */
        outlined: [],
      },
      position: {
        /**
         * Prefix: sits before the input in the flex row.
         * pl-4 aligns the left text edge to the 16dp field margin.
         * With a leading icon that shifts to 52dp to clear the icon.
         * pr-0.5 is a small gap between prefix text and the input cursor.
         */
        prefix: ["pl-4", "group-data-[with-leading-icon]/text-field:pl-[52px]", "pr-0.5"],
        /**
         * Suffix: sits after the input in the flex row.
         * pl-0.5 is a small gap between the input text and the suffix.
         * pr-4 keeps 16dp from the right field edge.
         * With a trailing icon that shifts to 52dp to avoid overlap.
         */
        suffix: ["pl-0.5", "pr-4", "group-data-[with-trailing-icon]/text-field:pr-[52px]"],
      },
    },
    defaultVariants: {
      variant: "filled",
      position: "prefix",
    },
  }
);

// ─── SUPPORTING ROW ───────────────────────────────────────────────────────────

/**
 * The row below the field box containing supporting text (left) and
 * character counter (right) on the same line — matching MD3 spec.
 */
export const textFieldSupportingRowVariants = cva([
  "flex items-start justify-between w-full gap-4 px-4 pt-1",
]);

// ─── SUPPORTING TEXT ──────────────────────────────────────────────────────────

/**
 * Supporting / error text — left slot of the supporting row.
 * body-small per MD3.
 */
export const textFieldSupportingTextVariants = cva(
  [
    "text-body-small",
    // Effects transition for color
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      type: {
        description: "text-on-surface-variant",
        error: "text-error",
      },
    },
    defaultVariants: {
      type: "description",
    },
  }
);

// ─── CHARACTER COUNTER ────────────────────────────────────────────────────────

/**
 * Character counter — right slot of the supporting row.
 * body-small, right-aligned, on-surface-variant; turns error color when exceeded.
 */
export const textFieldCounterVariants = cva(
  [
    "text-body-small shrink-0 text-right",
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      exceeded: {
        true: "text-error",
        false: "text-on-surface-variant",
      },
    },
    defaultVariants: {
      exceeded: false,
    },
  }
);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type TextFieldRootVariants = VariantProps<typeof textFieldRootVariants>;
export type TextFieldFieldVariants = VariantProps<typeof textFieldFieldVariants>;
export type TextFieldLabelVariants = VariantProps<typeof textFieldLabelVariants>;
export type TextFieldInputVariants = VariantProps<typeof textFieldInputVariants>;
export type TextFieldIconVariants = VariantProps<typeof textFieldIconVariants>;
export type TextFieldAffixVariants = VariantProps<typeof textFieldAffixVariants>;
export type TextFieldSupportingTextVariants = VariantProps<typeof textFieldSupportingTextVariants>;
export type TextFieldCounterVariants = VariantProps<typeof textFieldCounterVariants>;
