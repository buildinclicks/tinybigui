import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Search Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no focused/disabled/noActions state variants).
 * - All interaction states are driven by data-* attributes on the root via
 *   group-data-[x]/search Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-actions) are set explicitly by the component.
 *
 * Search Bar slot responsibilities:
 *   searchBarRootVariants        — container pill; shape, color, elevation, spacing by style
 *   searchBarStateLayerVariants  — hover/pressed opacity overlay (inside overflow-hidden)
 *   searchBarFocusRingVariants   — keyboard focus outline (outside overflow-hidden)
 *   searchBarLeadingIconVariants — 48dp tap target wrapping 24dp icon, on-surface
 *   searchBarTrailingActionVariants  — 48dp tap target for each trailing icon, on-surface-variant
 *   searchBarTrailingActionsVariants — flex row wrapper for all trailing actions
 *   searchBarAvatarVariants          — 48dp tap target wrapping 30dp rounded-full avatar
 *   searchBarInputVariants           — flex-1 text input inside the bar
 *
 * Search View slot responsibilities:
 *   searchViewVariants           — container; style × layout compound variants
 *   searchViewHeaderVariants     — header row; style × layout heights/padding
 *   searchViewBackButtonVariants — 48dp back-arrow tap target, on-surface
 *   searchViewClearButtonVariants — 48dp clear tap target, on-surface-variant
 *   searchViewTrailingActionVariants  — 48dp trailing action in view header
 *   searchViewTrailingActionsVariants — flex row wrapper for all view trailing actions
 *   searchViewInputVariants           — flex-1 text input inside the view header
 *   searchViewDividerVariants    — horizontal rule (divided style only)
 *   searchViewContentVariants    — scrollable results/suggestions area
 *
 * MD3 Token References:
 *   Container color:   SurfaceContainerHigh
 *   Contained bg (fullscreen view): SurfaceContainerLow
 *   Container elevation: Level 3 (6dp)
 *   Leading icon:      OnSurface
 *   Trailing icon:     OnSurfaceVariant
 *   Placeholder:       OnSurfaceVariant
 *   Input text:        OnSurface
 *   Focus indicator:   Secondary, 3dp
 *   Hover opacity:     8%   (MD3 state.hover.state-layer-opacity)
 *   Pressed opacity:   10%  (MD3 state.pressed.state-layer-opacity)
 *   Disabled:          opacity-38 on container
 *
 * @see docs/md3-components/search/tokens/layout-text.md
 * @see docs/md3-components/search/tokens/color-tokens-light.md
 */

// ─── SEARCH BAR ROOT ─────────────────────────────────────────────────────────

/**
 * Search bar container pill.
 *
 * Spacing follows MD3 Search Bar spec:
 *   Contained + with actions:    px-1 gap-1   (4dp leading/trailing per spec)
 *   Contained + no actions:      px-4         (16dp leading/trailing)
 *   Divided:                     px-4 gap-4   (16dp leading/trailing, 16dp icon-label gap)
 *
 * The `contained` variant uses `data-[with-actions]` on the root (a content flag set by the
 * component) to switch from 16dp → 4dp spacing — no CVA variant needed for this.
 *
 * Disabled is self-targeting (data-[disabled]:) because the root carries the data attr.
 * overflow-hidden intentionally NOT here — the focus ring span sits outside via a sibling
 * wrapper, so we preserve full ring visibility (same pattern as Button).
 */
export const searchBarRootVariants = cva(
  [
    "relative flex items-center h-14 rounded-full",
    "bg-surface-container-high shadow-elevation-3",
    "w-full text-body-large cursor-text",
    // Disabled — self-targeting; pointer-events lets ripple/hover stop cleanly
    "data-[disabled]:opacity-38 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      /**
       * Visual style of the search bar.
       * - contained: M3 Expressive — fills container, expressive motion, adjustable spacing
       * - divided: Baseline — 16dp fixed spacing, no expressive motion
       */
      style: {
        /**
         * Contained (Expressive): spacing governed by data-[with-actions] content flag.
         *   With actions:    px-1 gap-1 (4dp each)
         *   Without actions: px-4      (16dp each)
         */
        contained: [
          "px-4", // default: no-actions 16dp
          "data-[with-actions]:px-1 data-[with-actions]:gap-1", // with-actions: 4dp
        ],
        /**
         * Divided (Baseline): fixed 16dp side padding, 16dp icon-label gap.
         */
        divided: "px-4 gap-4",
      },
    },
    defaultVariants: { style: "contained" },
  }
);

// ─── SEARCH BAR STATE LAYER ──────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay inside the bar container.
 *
 * Must be inside overflow-hidden (placed on the same pill via the root's inner wrapper).
 * Color: on-surface (MD3 search bar state layer color).
 * Opacities: hover 8%, pressed 10% (doubled selector wins over hover).
 * Hidden when disabled (no state affordance on non-interactive element).
 */
export const searchBarStateLayerVariants = cva([
  "absolute inset-0 rounded-full pointer-events-none opacity-0",
  "bg-on-surface",
  // Effects transition — no overshoot on opacity
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hover: 8%
  "group-data-[hovered]/search:opacity-8",
  // Pressed: 10%, doubled selector wins over hover at equal cascade position
  "group-data-[pressed]/search:group-data-[pressed]/search:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/search:hidden",
]);

// ─── SEARCH BAR FOCUS RING ────────────────────────────────────────────────────

/**
 * Focus ring overlay.
 *
 * Rendered outside the overflow-hidden container (as a sibling, in a relative wrapper)
 * so it can extend 3px beyond the pill boundary and remain fully visible.
 * Color: Secondary (MD3 focus indicator color).
 * Thickness: 3dp (MD3 state.focus-indicator.thickness).
 */
export const searchBarFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-full",
  "outline outline-[3px] outline-offset-0 outline-secondary",
  // Effects transition
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/search:opacity-100",
]);

// ─── SEARCH BAR LEADING ICON ──────────────────────────────────────────────────

/**
 * Leading icon wrapper — 48dp tap target with centered 24dp icon.
 * Color: on-surface (MD3 leading icon color).
 */
export const searchBarLeadingIconVariants = cva([
  "flex size-12 shrink-0 items-center justify-center text-on-surface",
]);

// ─── SEARCH BAR TRAILING ACTION ───────────────────────────────────────────────

/**
 * Trailing action wrapper — 48dp tap target for each trailing icon button.
 * Color: on-surface-variant (MD3 trailing icon color).
 */
export const searchBarTrailingActionVariants = cva([
  "flex size-12 shrink-0 items-center justify-center text-on-surface-variant",
]);

// ─── SEARCH BAR AVATAR ────────────────────────────────────────────────────────

/**
 * Avatar wrapper — 48dp tap target containing a 30dp rounded-full image/element.
 * Shape: CornerFull (MD3 avatar shape).
 * Size: 30dp (MD3 avatar size).
 */
export const searchBarAvatarVariants = cva(["flex size-12 shrink-0 items-center justify-center"]);

// ─── SEARCH BAR TRAILING ACTIONS GROUP ────────────────────────────────────────

/**
 * Trailing actions group wrapper — lays out multiple trailing icon slots in a row.
 * gap = 0 per MD3 spec (contained trailing-actions gap token = 0dp).
 */
export const searchBarTrailingActionsVariants = cva(["flex items-center"]);

// ─── SEARCH BAR INPUT ─────────────────────────────────────────────────────────

/**
 * Text input inside the search bar.
 * Typography: body-large (MD3 supporting text / input text font).
 * Colors: on-surface for input, on-surface-variant for placeholder.
 *
 * `min-w-0` is required so `flex-1` can shrink when trailing actions are present.
 * The native browser search cancel button and decoration are hidden so only our
 * MD3 clear button (in SearchView) controls clearing.
 */
export const searchBarInputVariants = cva([
  "flex-1 min-w-0 bg-transparent outline-none",
  "text-body-large text-on-surface",
  "placeholder:text-on-surface-variant",
  "focus-visible:outline-none",
  // Hide native browser search affordances — our MD3 clear button handles clearing
  "[&::-webkit-search-cancel-button]:appearance-none",
  "[&::-webkit-search-decoration]:appearance-none",
]);

// ─── SEARCH VIEW CONTAINER ────────────────────────────────────────────────────

/**
 * Search view container — the expanded/focused search surface.
 *
 * All 4 style × layout combinations via compound variants:
 *   contained + fullscreen: surface-container-low,  no rounding
 *   contained + docked:     surface-container-high, rounded-xl (12dp), 2dp gap
 *   divided   + fullscreen: surface-container-high, no rounding
 *   divided   + docked:     surface-container-high, rounded-[28px] (extra-large)
 *
 * @see docs/md3-components/search/tokens/layout-text.md
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
    // Contained + fullscreen: surface-container-low, square corners
    {
      style: "contained",
      layout: "fullscreen",
      class: "bg-surface-container-low rounded-none",
    },
    // Contained + docked: surface-container-high, 12dp results rounding, 2dp gap
    {
      style: "contained",
      layout: "docked",
      class: "bg-surface-container-high rounded-xl gap-0.5",
    },
    // Divided + fullscreen: surface-container-high, square corners
    {
      style: "divided",
      layout: "fullscreen",
      class: "bg-surface-container-high rounded-none",
    },
    // Divided + docked: surface-container-high, extra-large rounding (28dp)
    {
      style: "divided",
      layout: "docked",
      class: "bg-surface-container-high rounded-[28px]",
    },
  ],
  defaultVariants: { style: "contained", layout: "fullscreen" },
});

// ─── SEARCH VIEW HEADER ───────────────────────────────────────────────────────

/**
 * Search view header row.
 *
 * Heights per MD3 spec:
 *   Contained (both layouts):  56dp (h-14), 12dp side padding (px-3)
 *   Divided + fullscreen:      72dp (h-[72px]), 16dp side padding (px-4)
 *   Divided + docked:          56dp (h-14), overridden by docked layout variant
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
        // Docked overrides height to 56dp regardless of style
        docked: "h-14",
        fullscreen: "",
      },
    },
    defaultVariants: { style: "contained", layout: "fullscreen" },
  }
);

// ─── SEARCH VIEW BACK BUTTON ──────────────────────────────────────────────────

/**
 * Back arrow button wrapper — 48dp tap target.
 * Color: on-surface (MD3 header leading icon color).
 * Includes visual state layer for hover/focus feedback (button handles its own states).
 */
export const searchViewBackButtonVariants = cva([
  "flex size-12 shrink-0 items-center justify-center",
  "text-on-surface rounded-full",
  "cursor-pointer",
]);

// ─── SEARCH VIEW CLEAR BUTTON ─────────────────────────────────────────────────

/**
 * Clear (✕) button wrapper — 48dp tap target.
 * Color: on-surface-variant (MD3 trailing icon color).
 * Transitions opacity when shown/hidden (Standard fast effects).
 */
export const searchViewClearButtonVariants = cva([
  "flex size-12 shrink-0 items-center justify-center",
  "text-on-surface-variant rounded-full",
  "cursor-pointer",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
]);

// ─── SEARCH VIEW TRAILING ACTION ──────────────────────────────────────────────

/**
 * Trailing action wrapper in the view header — 48dp tap target.
 * Color: on-surface-variant (MD3 trailing icon color).
 */
export const searchViewTrailingActionVariants = cva([
  "flex size-12 shrink-0 items-center justify-center text-on-surface-variant",
]);

// ─── SEARCH VIEW TRAILING ACTIONS GROUP ───────────────────────────────────────

/**
 * Trailing actions group wrapper in the view header — lays out multiple action
 * slots in a row. gap = 0 per MD3 spec.
 */
export const searchViewTrailingActionsVariants = cva(["flex items-center"]);

// ─── SEARCH VIEW INPUT ────────────────────────────────────────────────────────

/**
 * Text input inside the view header.
 * Typography: body-large.
 * Colors: on-surface for input text, on-surface-variant for placeholder.
 *
 * `min-w-0` lets `flex-1` shrink when clear/trailing buttons are present.
 * Native search affordances hidden — MD3 clear button controls clearing.
 */
export const searchViewInputVariants = cva([
  "flex-1 min-w-0 bg-transparent outline-none",
  "text-body-large text-on-surface",
  "placeholder:text-on-surface-variant",
  "focus-visible:outline-none",
  // Hide native browser search affordances
  "[&::-webkit-search-cancel-button]:appearance-none",
  "[&::-webkit-search-decoration]:appearance-none",
]);

// ─── SEARCH VIEW DIVIDER ──────────────────────────────────────────────────────

/**
 * Horizontal divider between the view header and results area.
 * Color: outline (MD3 divider color).
 * Only rendered when searchStyle="divided".
 */
export const searchViewDividerVariants = cva(["border-t border-outline w-full"]);

// ─── SEARCH VIEW CONTENT AREA ─────────────────────────────────────────────────

/**
 * Results / suggestions content area.
 * flex-1 to fill remaining height; overflow-y-auto for independent scroll.
 */
export const searchViewContentVariants = cva(["flex-1 overflow-y-auto"]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type SearchBarRootVariants = VariantProps<typeof searchBarRootVariants>;
export type SearchBarStateLayerVariants = VariantProps<typeof searchBarStateLayerVariants>;
export type SearchBarFocusRingVariants = VariantProps<typeof searchBarFocusRingVariants>;
export type SearchBarLeadingIconVariants = VariantProps<typeof searchBarLeadingIconVariants>;
export type SearchBarTrailingActionVariants = VariantProps<typeof searchBarTrailingActionVariants>;
export type SearchBarTrailingActionsVariants = VariantProps<
  typeof searchBarTrailingActionsVariants
>;
export type SearchBarAvatarVariants = VariantProps<typeof searchBarAvatarVariants>;
export type SearchBarInputVariants = VariantProps<typeof searchBarInputVariants>;
export type SearchViewVariants = VariantProps<typeof searchViewVariants>;
export type SearchViewHeaderVariants = VariantProps<typeof searchViewHeaderVariants>;
export type SearchViewBackButtonVariants = VariantProps<typeof searchViewBackButtonVariants>;
export type SearchViewClearButtonVariants = VariantProps<typeof searchViewClearButtonVariants>;
export type SearchViewTrailingActionVariants = VariantProps<
  typeof searchViewTrailingActionVariants
>;
export type SearchViewTrailingActionsVariants = VariantProps<
  typeof searchViewTrailingActionsVariants
>;
export type SearchViewInputVariants = VariantProps<typeof searchViewInputVariants>;
export type SearchViewDividerVariants = VariantProps<typeof searchViewDividerVariants>;
export type SearchViewContentVariants = VariantProps<typeof searchViewContentVariants>;
