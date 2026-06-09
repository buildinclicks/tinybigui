import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Badge Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no state/content variants, no compoundVariants).
 * - Dot vs count distinction is a content flag — set as `data-dot` on the element.
 * - Visibility is a runtime flag — set as `data-invisible` on the element.
 * - Motion class is applied conditionally in the component (not in CVA) so reduced-motion
 *   can be guarded at the JS level without a variant key.
 *
 * Slot responsibilities:
 *   badgeVariants — the sole <span> indicator; owns shape, color, size, content/visibility flags
 *
 * MD3 Spec (m3.material.io/components/badges/specs):
 *   Small (dot): 6dp circle — no text, no padding. `data-[dot]` overrides to size-1.5
 *   Large (number): height 16dp, min-width 16dp, padding 4dp horizontal, shape corner-full
 *   Container: error (bg-error / text-on-error) — only role defined in spec
 *   Typography: label-small (11sp / 1.6 line-height) — applied as base; overridden to zero for dot
 *   Position: absolute, top-right corner of host element (-4dp on each axis)
 *
 * State-layer opacities: badge is non-interactive — no hover/focus/pressed layers
 * Disabled: badge is hidden via invisible prop (host element owns disabled state)
 */

// ─── BADGE INDICATOR ─────────────────────────────────────────────────────────

/**
 * Single indicator element — dot or count pill.
 *
 * Content flags (set explicitly by BadgeContent, never by this CVA):
 *   `data-dot`       → element has no count; renders as 6dp dot
 *   `data-invisible` → element is hidden (scale-0); runtime show/hide control
 *
 * The dot overrides clear out the large-badge sizing applied in the base
 * using self-targeting `data-[dot]:` selectors placed after the base classes
 * so they win by cascade order at equal specificity.
 *
 * Visibility uses scale only (not scale + opacity) per the MD3 Expressive
 * scale-in/out pattern for small components. The transition-transform class
 * is applied conditionally by the component (outside CVA) to allow a
 * component-level reduced-motion guard.
 */
export const badgeVariants = cva([
  // ── Layout / shape ──────────────────────────────────────────────────────────
  "absolute -top-1 -right-1",
  "flex items-center justify-center",
  "rounded-full",
  // ── Large (count) sizing — base defaults ────────────────────────────────────
  // Height 16dp, min-width 16dp, horizontal padding 4dp
  "h-4 min-w-4 px-1",
  // ── Color — error role (only MD3-spec role for badges) ──────────────────────
  "bg-error text-on-error",
  // ── Typography — label-small, tight leading, tabular numbers ────────────────
  "text-label-small leading-none tabular-nums",
  // ── Visibility (runtime flag) ────────────────────────────────────────────────
  // Base: fully visible
  "scale-100",
  // data-invisible: scale to zero (visually hidden; aria-label still readable by SR)
  "data-[invisible]:scale-0",
  // ── Dot content flag overrides (placed last — cascade wins over base sizing) ─
  // Clear out the count-pill sizing, set 6dp circle
  "data-[dot]:size-1.5",
  "data-[dot]:min-w-0",
  "data-[dot]:p-0",
  "data-[dot]:text-[0]", // suppress any stray text rendering on dot
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type BadgeVariants = VariantProps<typeof badgeVariants>;
