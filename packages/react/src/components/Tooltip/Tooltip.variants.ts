import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Tooltip Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no hover/focus state variants).
 * - The `animation` variant is the only runtime switch — driven by the
 *   `TooltipAnimationContext` in `TooltipTrigger`.
 * - Rich tooltip sub-elements are each their own slot CVA so inline class
 *   strings are never hardcoded in JSX.
 *
 * Slot responsibilities:
 *   tooltipVariants               — plain tooltip container
 *   richTooltipVariants           — rich tooltip container
 *   richTooltipTitleVariants      — optional subhead / title row
 *   richTooltipSupportingTextVariants — multi-line body text
 *   richTooltipActionsVariants    — action button row (optional)
 *
 * MD3 Plain Tooltip spec:
 *   Background:  inverse-surface
 *   Text:        inverse-on-surface, body-small (12sp)
 *   Shape:       corner-extra-small (4dp, rounded-xs)
 *   Min height:  24dp
 *   Max width:   200dp
 *   Padding:     8dp horizontal × 4dp vertical
 *   Elevation:   none (tonal surface provides contrast)
 *
 * MD3 Rich Tooltip spec:
 *   Background:  surface-container
 *   Text:        on-surface
 *   Subhead:     on-surface-variant, title-small
 *   Supporting:  on-surface-variant, body-medium
 *   Shape:       corner-medium (12dp, rounded-md)
 *   Min height:  24dp
 *   Max width:   320dp
 *   Padding:     16dp horizontal × 12dp vertical
 *   Elevation:   level-2 (shadow-elevation-2)
 *   Actions:     text button, 12dp top gap, flush-left inset to content edge
 */

// ─── ANIMATION VARIANT ───────────────────────────────────────────────────────

/**
 * Three-state animation discriminant.
 *
 * `enter` — component mounting, play scale-in animation
 * `exit`  — component unmounting, play scale-out animation
 * `none`  — `prefers-reduced-motion: reduce` is active; skip all transforms
 */
type TooltipAnimationState = "enter" | "exit" | "none";

// ─── PLAIN TOOLTIP ────────────────────────────────────────────────────────────

/**
 * Plain tooltip container.
 *
 * Renders an inline-flex pill that vertically centres a single-line text label
 * against the 24dp minimum height.
 *
 * MD3 Tokens:
 * - `bg-inverse-surface`       — inverted surface for maximum contrast
 * - `text-inverse-on-surface`  — content colour on inverted surface
 * - `rounded-xs`               — 4dp corner radius (CornerExtraSmall)
 * - `text-body-small`          — BodySmall typescale (12sp)
 * - `min-h-6`                  — 24dp minimum height
 * - `max-w-50`                 — 200dp maximum width
 * - `px-2 py-1`                — 8dp × 4dp padding
 * - `z-50`                     — above all page content
 *
 * Motion:
 * - `enter` → `animate-md-scale-in`  (expressive-fast-spatial: 350ms, scale 0.85 → 1 + fade)
 * - `exit`  → `animate-md-scale-out` (emphasized-accelerate: 200ms, scale 1 → 0.85 + fade)
 * - `none`  → no animation class     (prefers-reduced-motion guard)
 */
export const tooltipVariants = cva(
  [
    "z-50 inline-flex items-center w-fit",
    "min-h-6 rounded-xs px-2 py-1",
    "text-body-small tracking-[0.4px] bg-inverse-surface text-inverse-on-surface",
    "max-w-50",
  ],
  {
    variants: {
      /**
       * Controls the enter/exit animation class.
       * Managed by `TooltipTrigger`'s animation state machine.
       * Set to `"none"` when `prefers-reduced-motion: reduce` is active.
       * @default "enter"
       */
      animation: {
        enter: "animate-md-scale-in",
        exit: "animate-md-scale-out",
        none: "",
      },
    },
    defaultVariants: {
      animation: "enter",
    },
  }
);

// ─── RICH TOOLTIP CONTAINER ───────────────────────────────────────────────────

/**
 * Rich tooltip container.
 *
 * Wraps the title, supporting text, and optional action row in a flex column.
 *
 * MD3 Tokens:
 * - `bg-surface-container`   — surface container background
 * - `text-on-surface`        — content colour on surface
 * - `shadow-elevation-2`     — MD3 elevation level 2
 * - `rounded-md`             — 12dp corner radius (CornerMedium)
 * - `min-h-6`                — 24dp minimum height
 * - `max-w-80`               — 320dp maximum width
 * - `px-4 py-3`              — 16dp × 12dp padding
 * - `z-50`                   — above all page content
 *
 * Motion: same `animation` variant as plain tooltip.
 */
export const richTooltipVariants = cva(
  [
    "z-50 flex flex-col w-fit",
    "min-h-6 rounded-md px-4 py-3",
    "bg-surface-container text-on-surface shadow-elevation-2",
    "max-w-80",
  ],
  {
    variants: {
      /**
       * Controls the enter/exit animation class.
       * Managed by `TooltipTrigger`'s animation state machine.
       * Set to `"none"` when `prefers-reduced-motion: reduce` is active.
       * @default "enter"
       */
      animation: {
        enter: "animate-md-scale-in",
        exit: "animate-md-scale-out",
        none: "",
      },
    },
    defaultVariants: {
      animation: "enter",
    },
  }
);

// ─── RICH TOOLTIP SLOTS ───────────────────────────────────────────────────────

/**
 * Rich tooltip subhead / title row.
 *
 * MD3 Tokens:
 * - `text-title-small`       — TitleSmall typescale
 * - `text-on-surface-variant`— MD3 rich-tooltip subhead colour role
 * - `mb-1`                   — 4dp gap below title (before supporting text)
 */
export const richTooltipTitleVariants = cva([
  "text-title-small font-medium text-on-surface-variant mb-1",
]);

/**
 * Rich tooltip supporting text body.
 *
 * MD3 Tokens:
 * - `text-body-medium`        — BodyMedium typescale
 * - `text-on-surface-variant` — same colour role as subhead per spec
 */
export const richTooltipSupportingTextVariants = cva(["text-body-medium text-on-surface-variant"]);

/**
 * Rich tooltip action row.
 *
 * Renders the optional text Button flush to the content left edge.
 * The `-ml-2` inset compensates for the text Button's own 12dp px-3 padding
 * so the label aligns visually with the supporting text above it.
 *
 * MD3 spec: action sits 12dp below the supporting text body (`mt-3`).
 */
export const richTooltipActionsVariants = cva(["flex items-center justify-start mt-3 -ml-2"]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type { TooltipAnimationState };
export type TooltipVariants = VariantProps<typeof tooltipVariants>;
export type RichTooltipVariants = VariantProps<typeof richTooltipVariants>;
export type RichTooltipTitleVariants = VariantProps<typeof richTooltipTitleVariants>;
export type RichTooltipSupportingTextVariants = VariantProps<
  typeof richTooltipSupportingTextVariants
>;
export type RichTooltipActionsVariants = VariantProps<typeof richTooltipActionsVariants>;
