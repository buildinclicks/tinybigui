import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Divider Variants (CVA)
 *
 * Architecture: Variants only — the Divider is a static, non-interactive element
 * (no hover/focus/pressed states) so there is no state-layer machinery.
 *
 * Implementation strategy:
 *   The border-* approach used previously required separate horizontal/vertical
 *   logic and could not share a single thickness control. We now use a background
 *   fill on a zero-border element, driven by a CSS custom property, which is the
 *   same technique used by the official @material/web md-divider implementation.
 *
 * CSS variable:
 *   --md-divider-thickness  (default: 1px, MD3 spec: 1dp)
 *   Override via style or a Tailwind arbitrary property:
 *     <Divider style={{ "--md-divider-thickness": "2px" }} />
 *
 * Orientation:
 *   horizontal — full-width strip, height driven by --md-divider-thickness
 *   vertical   — self-stretches to container height, width driven by var
 *
 * Inset (MD3 spec: 16dp logical offset, RTL-aware):
 *   start — ms-4  (inline-start, adapts to writing direction)
 *   end   — me-4  (inline-end)
 *   both  — ms-4 me-4
 *
 * MD3 Spec references:
 *   Color:     outline-variant  (--md-sys-color-outline-variant)
 *   Thickness: 1dp (no MD3 component token — exposed as a CSS var for parity with md-web)
 *   Inset:     16dp (--md-comp-divider-leading-space / --md-comp-divider-trailing-space)
 */
export const dividerVariants = cva(
  [
    // Zero border — color comes from background fill (matches md-web strategy)
    "shrink-0 border-0",
    // MD3 outline-variant color token
    "bg-outline-variant",
    // Default thickness — consumers override via the CSS custom property
    "[--md-divider-thickness:1px]",
  ],
  {
    variants: {
      /**
       * Controls the axis of the visual rule.
       *
       * horizontal — stretches to full inline width; block size is --md-divider-thickness
       * vertical   — self-stretches to the block axis of the flex/grid parent;
       *              inline size is --md-divider-thickness
       */
      orientation: {
        horizontal: "h-[var(--md-divider-thickness)]",
        vertical: "self-stretch h-auto w-[var(--md-divider-thickness)]",
      },

      /**
       * Inset — logical inline offset per MD3 spec (16dp = 1rem = Tailwind spacing-4).
       *
       * Uses logical properties (ms-N / me-N) for correct behaviour under RTL
       * writing modes (Arabic, Hebrew, etc.).
       */
      inset: {
        none: "",
        start: "ms-4",
        end: "me-4",
        both: "ms-4 me-4",
      },
    },

    defaultVariants: {
      orientation: "horizontal",
      inset: "none",
    },
  }
);

/**
 * Inferred CVA variant prop types for the Divider component.
 */
export type DividerVariants = VariantProps<typeof dividerVariants>;
