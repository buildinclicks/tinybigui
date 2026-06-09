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
 *   badgeVariants       — anchored indicator (<span> over a wrapped icon); owns placement + appearance
 *   badgeStaticVariants — trailing pill (inline, no absolute placement); shares appearance only
 *
 * MD3 Spec (m3.material.io/components/badges/specs):
 *   Small (dot): 6dp circle — no text, no padding. `data-[dot]` overrides to size-1.5
 *   Large (number): height 16dp, min-width 16dp, padding 4dp horizontal, shape corner-full
 *   Container: error (bg-error / text-on-error) — only role defined in spec
 *   Typography: label-small (11sp / 1.6 line-height) — applied as base; overridden to zero for dot
 *   Position: badge center sits on the host element's top-right corner (straddling).
 *             Achieved via `top-0 right-0 -translate-y-1/2 translate-x-1/2` — host-size-agnostic.
 *             Mirrors the NavigationBar icon-wrapper badge approach.
 *             In Tailwind v4, `translate-*` and `scale-*` map to the independent native CSS
 *             `translate:` / `scale:` properties, so the static corner translate does NOT
 *             interfere with the scale-0/scale-100 show/hide animation.
 *
 * State-layer opacities: badge is non-interactive — no hover/focus/pressed layers
 * Disabled: badge is hidden via invisible prop (host element owns disabled state)
 */

// ─── SHARED APPEARANCE ────────────────────────────────────────────────────────
//
// Common classes between the anchored (badgeVariants) and the static trailing
// (badgeStaticVariants) forms. Separated so both stay DRY without creating a
// third CVA that callers would have to compose manually.

const badgeAppearance = [
  // ── Shape ─────────────────────────────────────────────────────────────────────
  "flex items-center justify-center",
  "rounded-full",
  // ── Large (count) sizing — base defaults ──────────────────────────────────────
  // Height 16dp, min-width 16dp, horizontal padding 4dp
  "h-4 min-w-4 px-1",
  // ── Color — error role (only MD3-spec role for badges) ────────────────────────
  "bg-error text-on-error",
  // ── Typography — label-small, tight leading, tabular numbers ──────────────────
  "text-label-small leading-none tabular-nums",
  // ── Visibility (runtime flag) ──────────────────────────────────────────────────
  // Base: fully visible
  "scale-100",
  // data-invisible: scale to zero (visually hidden; aria-label still readable by SR)
  "data-[invisible]:scale-0",
  // ── Dot content flag overrides (placed last — cascade wins over base sizing) ───
  // Clear out the count-pill sizing, set 6dp circle
  "data-[dot]:size-1.5",
  "data-[dot]:min-w-0",
  "data-[dot]:p-0",
  "data-[dot]:text-[0]", // suppress any stray text rendering on dot
] as const;

// ─── BADGE INDICATOR (ANCHORED) ───────────────────────────────────────────────

/**
 * Anchored indicator element — badge center straddles the wrapped host's
 * top-right corner via `top-0 right-0 -translate-y-1/2 translate-x-1/2`.
 *
 * Use this variant (via `BadgeContent`) when the badge wraps an icon element
 * (e.g. a 24dp icon span, an IconButton) and needs to overlay its corner.
 *
 * Content flags (set explicitly by BadgeContent, never by this CVA):
 *   `data-dot`       → element has no count; renders as 6dp dot
 *   `data-invisible` → element is hidden (scale-0); runtime show/hide control
 *
 * Visibility uses scale only (not scale + opacity) per the MD3 Expressive
 * scale-in/out pattern for small components. The transition-transform class
 * is applied conditionally by the component (outside CVA) to allow a
 * component-level reduced-motion guard.
 */
export const badgeVariants = cva([
  // ── Anchored placement — badge center on host's top-right corner ──────────────
  // top-0 right-0 places the badge's own top-right at the host's top-right,
  // then the 1/2-element translate moves the badge center onto that corner.
  // Host-size-agnostic: works for any wrapped element (icon, avatar, nav chip).
  "absolute top-0 right-0 -translate-y-1/2 translate-x-1/2",
  ...badgeAppearance,
]);

// ─── BADGE INDICATOR (STATIC / TRAILING) ─────────────────────────────────────

/**
 * Inline (non-anchored) indicator for trailing slots such as the Drawer item.
 *
 * No absolute positioning or translate — the pill sits inline in a flex row.
 * Shares all appearance classes with `badgeVariants` so the visual output
 * (colors, sizing, dot/invisible flags) remains identical.
 *
 * Use in `DrawerItem`'s trailing badge slot where the badge is not overlaid
 * on an icon but rendered as a count chip at the trailing edge of the row.
 */
export const badgeStaticVariants = cva(["inline-flex", ...badgeAppearance]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type BadgeStaticVariants = VariantProps<typeof badgeStaticVariants>;
