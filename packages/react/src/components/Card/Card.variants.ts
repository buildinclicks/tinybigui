import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Card Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (the `variant` axis). No interaction
 *   state variants (hovered/pressed/focused/dragged/disabled) live in CVA.
 * - All interaction states are driven by data-* attributes on the root via
 *   `data-[x]:` (self-targeting) on the root and `group-data-[x]/card:` selectors
 *   in each slot's base classes.
 * - Content flags (`data-interactive`) are set explicitly by the component.
 *
 * Slot responsibilities:
 *   cardVariants           — root container; shape, color, per-state elevation
 *   cardStateLayerVariants — hover/focus/press/drag opacity ring (absolute overlay)
 *   cardFocusRingVariants  — keyboard focus outline (inset so overflow-hidden never clips it)
 *
 * MD3 Spec (https://m3.material.io/components/cards/specs):
 *   Shape: medium corner (12dp) → `rounded-md`
 *   State-layer color: on-surface (all variants)
 *   State-layer opacities: hover 8% | focus 10% | pressed 10% | dragged 16%
 *   Disabled: container 38% opacity, no pointer events
 *
 * Elevation per state (MD3 comp tokens):
 *   Elevated  enabled=1  hover=2  focus=1  pressed=1  dragged=4
 *   Filled    enabled=0  hover=1  focus=0  pressed=0  dragged=3
 *   Outlined  enabled=0  hover=1  focus=0  pressed=0  dragged=3
 *
 * Motion tier: Standard **default** (cards are standard-size components alongside
 *   dialogs/menus — not the fast tier used for small <48dp controls like buttons).
 *   All effect transitions use `duration-spring-standard-default-effects` (200ms) +
 *   `ease-spring-standard-default-effects`.
 *
 * Specificity strategy (self-targeting `data-[x]:` on the root):
 *   base → hover (single) → focus (single) → pressed (doubled) → dragged (tripled)
 *   Doubling/tripling the attribute selector guarantees the later state wins
 *   regardless of Tailwind's emitted class order. `pressed` (and `dragged`,
 *   which co-occurs with a held pointer) therefore beat `hover` deterministically.
 */

// ─── ROOT / CONTAINER ────────────────────────────────────────────────────────

/**
 * Root container element.
 *
 * `overflow-hidden` clips full-bleed media (CardMedia), the ripple, and the
 * state layer to the card's rounded shape. Because the root clips, the focus
 * ring is rendered as an INSET overlay (see `cardFocusRingVariants`) rather than
 * an outset ring, so it is never cut off.
 *
 * Elevation responds to the root's own `data-*` state attributes via
 * self-targeting selectors (the root carries both `group/card` and the state
 * attributes). The shadow, opacity, and border-color changes are effects, so
 * they use the standard-default-effects spring (200ms, no overshoot).
 */
export const cardVariants = cva(
  [
    // Shape: MD3 medium corner = 12dp
    "relative overflow-hidden rounded-md text-on-surface",
    // Transition: effects properties — standard default tier (cards are standard-size, not <48dp)
    // Covers shadow (elevation), opacity (disabled fade), border-color (outlined state)
    "transition-[box-shadow,opacity,border-color] duration-spring-standard-default-effects ease-spring-standard-default-effects",
    // Interactive affordance (content flag set by the component)
    "data-[interactive]:cursor-pointer",
    // Disabled — self-targeting selectors (38% container, no interaction)
    "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none data-[disabled]:opacity-38",
  ],
  {
    variants: {
      /**
       * Card visual variant per MD3 specification.
       */
      variant: {
        /**
         * Elevated — separation via shadow.
         * MD3: container=surface-container-low.
         * Elevation: 1 base → 2 hover → 1 focus → 1 pressed → 4 dragged.
         */
        elevated: [
          "bg-surface-container-low",
          "shadow-elevation-1",
          "data-[hovered]:shadow-elevation-2",
          "data-[focus-visible]:shadow-elevation-1",
          "data-[pressed]:data-[pressed]:shadow-elevation-1",
          "data-[dragged]:data-[dragged]:data-[dragged]:shadow-elevation-4",
          "data-[disabled]:shadow-none",
        ],

        /**
         * Filled — subtle container fill, no resting shadow.
         * MD3: container=surface-container-highest.
         * Elevation: 0 base → 1 hover → 0 focus → 0 pressed → 3 dragged.
         */
        filled: [
          "bg-surface-container-highest",
          "shadow-none",
          "data-[hovered]:shadow-elevation-1",
          "data-[focus-visible]:shadow-none",
          "data-[pressed]:data-[pressed]:shadow-none",
          "data-[dragged]:data-[dragged]:data-[dragged]:shadow-elevation-3",
          "data-[disabled]:shadow-none",
        ],

        /**
         * Outlined — visual boundary via border, no resting shadow.
         * MD3: container=surface, outline=outline-variant.
         * Elevation: 0 base → 1 hover → 0 focus → 0 pressed → 3 dragged.
         */
        outlined: [
          "bg-surface border border-outline-variant",
          "shadow-none",
          "data-[hovered]:shadow-elevation-1",
          "data-[focus-visible]:shadow-none",
          "data-[pressed]:data-[pressed]:shadow-none",
          "data-[dragged]:data-[dragged]:data-[dragged]:shadow-elevation-3",
          "data-[disabled]:shadow-none",
        ],
      },
    },

    defaultVariants: {
      variant: "elevated",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute overlay that transitions opacity on interaction.
 *
 * Color is always `on-surface` per MD3 (cards do not vary the state-layer color
 * by variant). Rendered below the content (content wrapper carries `z-10`) so it
 * tints the container surface without reducing text legibility.
 *
 * Opacity: 0 rest → 8% hover → 10% focus/pressed → 16% dragged → hidden disabled.
 * `pressed` (doubled) and `dragged` (tripled) win over `hover` (single) by
 * specificity when multiple attributes are set simultaneously.
 */
export const cardStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0",
  "bg-on-surface",
  // Effects transition for opacity — standard default tier (200ms, no overshoot)
  "transition-opacity duration-spring-standard-default-effects ease-spring-standard-default-effects",
  "group-data-[hovered]/card:opacity-8",
  "group-data-[focus-visible]/card:opacity-10",
  "group-data-[pressed]/card:group-data-[pressed]/card:opacity-10",
  "group-data-[dragged]/card:group-data-[dragged]/card:group-data-[dragged]/card:opacity-16",
  "group-data-[disabled]/card:hidden",
]);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring overlay.
 *
 * Rendered INSET (`-outline-offset-2`, `z-20`) so it stays inside the root's
 * `overflow-hidden` clip and sits above the content. Always present in the DOM
 * (opacity-0 at rest) and fades in on keyboard/programmatic focus, which avoids
 * layout shift and lets the opacity transition animate smoothly.
 */
export const cardFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 z-20 rounded-[inherit]",
  "outline outline-2 -outline-offset-2 outline-secondary",
  // Effects transition — standard default tier, opacity must not overshoot
  "transition-opacity duration-spring-standard-default-effects ease-spring-standard-default-effects",
  "opacity-0",
  "group-data-[focus-visible]/card:opacity-100",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

/**
 * Extract variant prop types from CVA for typed usage.
 */
export type CardVariants = VariantProps<typeof cardVariants>;
export type CardStateLayerVariants = VariantProps<typeof cardStateLayerVariants>;
export type CardFocusRingVariants = VariantProps<typeof cardFocusRingVariants>;
