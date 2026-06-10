import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 List Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (density, slot type).
 * - All interaction/selection states are driven by data-* attributes on the root <li>
 *   via group-data-[x]/list-item Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-leading, data-with-trailing) are set explicitly by ListItem.
 *
 * Slot responsibilities:
 *   listVariants               — container <ul>; bg-surface
 *   listItemVariants           — root <li>; group/list-item; density height; cursor; disabled
 *   listItemStateLayerVariants — absolute inset overlay; hover/focus/pressed opacity ring
 *   listItemFocusRingVariants  — keyboard focus indicator outline
 *   listItemLeadingVariants    — leading slot wrapper; type-specific size/shape + color states
 *   listItemTrailingVariants   — trailing slot wrapper; type-specific size/shape + color states
 *   listItemOverlineVariants   — overline text; color reacts to selected/disabled
 *   listItemHeadlineVariants   — headline text; color reacts to selected/disabled
 *   listItemSupportingTextVariants — supporting text; color reacts to selected/disabled
 *
 * MD3 Spec (lists/specs):
 *   One-line:   56dp min-height
 *   Two-line:   72dp min-height
 *   Three-line: 88dp min-height (leading/trailing top-aligned)
 *   Padding: 16dp horizontal, 8dp vertical
 *   Leading icon: 24dp, text-on-surface-variant
 *   Leading avatar: 40dp circle
 *   State-layer opacities: hover 8% | focus 10% | pressed 10%
 *   Disabled: content 38% opacity, pointer-events none
 *   Selected: bg-secondary-container, text/icons on-secondary-container
 */

// ─── LIST CONTAINER ───────────────────────────────────────────────────────────

/**
 * List container (<ul>).
 * MD3: Lists use `surface` color role for their container.
 */
export const listVariants = cva("w-full bg-surface");

// ─── LIST ITEM ROOT ───────────────────────────────────────────────────────────

/**
 * Root <li> element — carries `group/list-item` and emits data-* interaction attributes.
 *
 * Design-time variant: `density` only.
 * All interaction/selection states are driven via group-data-[x]/list-item selectors
 * in the slot CVAs below — NOT as CVA variant keys here.
 *
 *   one-line:   56dp (min-h-14)
 *   two-line:   72dp (min-h-18)
 *   three-line: 88dp (min-h-22, items-start for top-aligned slots)
 *
 * Selected background: group-data-[selected]/list-item:bg-secondary-container
 * Interactive cursor: data-[interactive]:cursor-pointer
 * Disabled: self-targeting data-[disabled]: selectors (38% + no pointer)
 */
export const listItemVariants = cva(
  [
    // Layout
    "relative flex items-center overflow-hidden px-4 py-2 select-none",
    // Color transition — effects spring (no spatial overshoot on color)
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Cursor: non-interactive base; data-[interactive] overrides
    "cursor-default",
    "data-[interactive]:cursor-pointer",
    // Selected: secondary-container background
    "group-data-[selected]/list-item:bg-secondary-container",
    // Disabled: self-targeting selectors (not group, since root is the group)
    "data-[disabled]:opacity-38 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      /**
       * Visual density — derived from content, not a user prop.
       * one-line:   headline only (56dp)
       * two-line:   headline + supportingText (72dp)
       * three-line: overline + headline + supportingText (88dp)
       */
      density: {
        "one-line": "min-h-14",
        "two-line": "min-h-18",
        "three-line": "min-h-22 items-start",
      },
    },

    defaultVariants: {
      density: "one-line",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay that transitions opacity on interaction.
 *
 * Color: bg-on-surface (matches MD3 list item state layer color on surface).
 * On selected items (bg-secondary-container), MD3 uses on-secondary-container
 * for the state layer. We keep bg-on-surface and let the background provide context.
 *
 * Opacity:
 *   0 at rest
 *   8% hover  (group-data-[hovered]/list-item:)
 *   10% focus (group-data-[focus-visible]/list-item:)
 *   10% pressed — doubled selector wins over hover at same cascade position
 *   hidden when disabled
 */
export const listItemStateLayerVariants = cva([
  "absolute inset-0 pointer-events-none opacity-0",
  "bg-on-surface",
  // Effects transition for opacity — no spatial overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hover: 8%
  "group-data-[hovered]/list-item:opacity-8",
  // Focus: 10%
  "group-data-[focus-visible]/list-item:opacity-10",
  // Pressed: 10%, doubled selector beats hover
  "group-data-[pressed]/list-item:group-data-[pressed]/list-item:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/list-item:hidden",
]);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring — absolute inset outline for keyboard/programmatic focus.
 *
 * Uses an inset outline (not a box-shadow or extra padding) so it stays
 * clipped to the list item bounds. opacity transitions rather than display
 * toggling allows smooth animation.
 */
export const listItemFocusRingVariants = cva([
  "pointer-events-none absolute inset-0",
  "outline outline-2 -outline-offset-2 outline-secondary",
  // Effects transition — opacity must NOT overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/list-item:opacity-100",
]);

// ─── LEADING SLOT ─────────────────────────────────────────────────────────────

/**
 * Leading slot wrapper.
 *
 * type-specific styling:
 *   icon   — 24dp, text-on-surface-variant at rest, reacts to selected/disabled
 *   avatar — 40dp circle, overflow-hidden (no color tokens, content provides color)
 *   checkbox / radio — no sizing; slot is purely a layout wrapper
 *
 * For checkbox/radio, selection semantics come from the parent <li>'s useOption
 * (aria-selected), so these slots are wrapped in aria-hidden by ListItemLeading.
 */
export const listItemLeadingVariants = cva(
  [
    "mr-4 flex shrink-0 items-center",
    // Effects transition for icon color changes
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      type: {
        icon: [
          "size-6",
          "text-on-surface-variant",
          // Selected: icon color changes to on-secondary-container
          "group-data-[selected]/list-item:text-on-secondary-container",
          // Disabled: 38% (inherited from root opacity-38, but also explicit for color accuracy)
          "group-data-[disabled]/list-item:text-on-surface/38",
        ],
        avatar: [
          "size-10 overflow-hidden rounded-full",
          // Avatar color provided by content; no token overrides needed
        ],
        checkbox: [],
        radio: [],
      },
    },
    defaultVariants: {
      type: "icon",
    },
  }
);

// ─── TRAILING SLOT ────────────────────────────────────────────────────────────

/**
 * Trailing slot wrapper.
 *
 * type-specific styling:
 *   icon   — 24dp, text-on-surface-variant, reacts to selected/disabled
 *   text   — label-small typography, text-on-surface-variant, reacts to selected/disabled
 *   checkbox / radio — no sizing; selection semantics come from useOption
 */
export const listItemTrailingVariants = cva(
  [
    "ml-auto flex shrink-0 items-center",
    // Effects transition for color changes
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      type: {
        icon: [
          "size-6",
          "text-on-surface-variant",
          "group-data-[selected]/list-item:text-on-secondary-container",
          "group-data-[disabled]/list-item:text-on-surface/38",
        ],
        text: [
          "text-label-small",
          "text-on-surface-variant",
          "group-data-[selected]/list-item:text-on-secondary-container",
          "group-data-[disabled]/list-item:text-on-surface/38",
        ],
        checkbox: [],
        radio: [],
      },
    },
    defaultVariants: {
      type: "icon",
    },
  }
);

// ─── TEXT SLOTS ───────────────────────────────────────────────────────────────

/**
 * Overline text — appears above the headline in three-line density.
 * MD3: label-small typography, on-surface-variant color at rest.
 */
export const listItemOverlineVariants = cva([
  "text-label-small",
  "text-on-surface-variant",
  // Effects transition for color
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected: on-secondary-container
  "group-data-[selected]/list-item:text-on-secondary-container",
  // Disabled: opacity inherited from root; explicit for color
  "group-data-[disabled]/list-item:text-on-surface/38",
]);

/**
 * Headline text — primary list item label.
 * MD3: body-large typography, on-surface color at rest.
 */
export const listItemHeadlineVariants = cva([
  "text-body-large",
  "text-on-surface",
  // Effects transition for color
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected: on-secondary-container
  "group-data-[selected]/list-item:text-on-secondary-container",
  // Disabled: 38% color via CSS (opacity-38 on root handles all descendants, but
  // explicit token ensures predictable rendering when color is specified).
  "group-data-[disabled]/list-item:text-on-surface/38",
]);

/**
 * Supporting text — secondary label below the headline.
 * MD3: body-medium typography, on-surface-variant color at rest.
 */
export const listItemSupportingTextVariants = cva([
  "text-body-medium",
  "text-on-surface-variant",
  // Effects transition for color
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected: on-secondary-container
  "group-data-[selected]/list-item:text-on-secondary-container",
  // Disabled: 38% color
  "group-data-[disabled]/list-item:text-on-surface/38",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type ListVariants = VariantProps<typeof listVariants>;
export type ListItemVariants = VariantProps<typeof listItemVariants>;
export type ListItemStateLayerVariants = VariantProps<typeof listItemStateLayerVariants>;
export type ListItemFocusRingVariants = VariantProps<typeof listItemFocusRingVariants>;
export type ListItemLeadingVariants = VariantProps<typeof listItemLeadingVariants>;
export type ListItemTrailingVariants = VariantProps<typeof listItemTrailingVariants>;
export type ListItemOverlineVariants = VariantProps<typeof listItemOverlineVariants>;
export type ListItemHeadlineVariants = VariantProps<typeof listItemHeadlineVariants>;
export type ListItemSupportingTextVariants = VariantProps<typeof listItemSupportingTextVariants>;
