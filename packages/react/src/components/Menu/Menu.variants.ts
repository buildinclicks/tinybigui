import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Menu container variants (CVA).
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (menuStyle, colorScheme).
 * - Animation (enter/exit motion) lives on `menuPopoverVariants` which is
 *   applied to the RAC Popover element — the element where RAC actually emits
 *   data-entering, data-exiting, and data-placement.
 *
 * Shape per menuStyle:
 *   baseline: `rounded-xs` (4dp extra-small)
 *   vertical: `rounded-lg` (16dp large, MD3 Expressive)
 *
 * Background per menuStyle:
 *   baseline: bg-surface-container (solid, houses all items)
 *   vertical: bg-transparent (items paint their own segment cards; gap reveals
 *             the page background between segments — acting as the divider)
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuContainerVariants = cva(
  [
    // Elevation: level 2
    "shadow-elevation-2",
    // Width constraints: 112dp min / 280dp max per MD3 spec
    "min-w-28 max-w-70",
    // Scroll behaviour
    "overflow-y-auto",
    "max-h-[calc(var(--visual-viewport-height,100vh)-2rem)]",
    // Stacking
    "z-50",
    // Focus outline delegated to React Aria
    "outline-none",
  ],
  {
    variants: {
      /**
       * Color scheme — drives item/segment background and content colors.
       * standard: surface-container-low item background.
       * vibrant:  tertiary-container item background.
       */
      colorScheme: {
        standard: [],
        vibrant: [],
      },
      /**
       * Visual style — drives corner radius and container background.
       *
       * baseline: solid surface-container, 4dp corners, 8dp vertical padding.
       * vertical: transparent container, 16dp corners, no container padding —
       *   items own their segment surface, gaps reveal the page background.
       */
      menuStyle: {
        baseline: ["rounded-xs", "bg-surface-container", "py-2"],
        vertical: ["rounded-lg", "bg-transparent"],
      },
    },
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── MENU POPOVER ────────────────────────────────────────────────────────────

/**
 * Applied to the React Aria `<Popover>` element — the element where RAC emits
 * `data-entering`, `data-exiting`, and `data-placement`.
 *
 * Motion:
 *   Enter: animate-md-scale-in (350ms expressive-fast-spatial, scale+fade)
 *   Exit:  animate-md-scale-out (200ms emphasized-accelerate, scale+fade)
 *
 * @see https://m3.material.io/components/menus/specs — Motion
 */
export const menuPopoverVariants = cva([
  "will-change-[transform,opacity]",
  "data-[entering]:pointer-events-none data-[exiting]:pointer-events-none",
  "data-[entering]:animate-md-scale-in",
  "data-[exiting]:animate-md-scale-out",
  "origin-top",
  "data-[placement=top]:origin-bottom",
  "data-[placement=left]:origin-right",
  "data-[placement=right]:origin-left",
  "motion-reduce:data-[entering]:animate-none motion-reduce:data-[exiting]:animate-none",
]);

// ─── MENU ITEM ROOT ───────────────────────────────────────────────────────────

/**
 * Material Design 3 Menu item root variants (CVA).
 *
 * Segmented vertical model (MD3 Expressive):
 *   The container is transparent. Each item paints its own segment surface
 *   (bg-surface-container-low / bg-tertiary-container). Groups of items are
 *   visually separated by a MenuGap spacer whose 2dp height reveals the page
 *   background between segments — creating the "divider" effect without a line.
 *
 * Segmented corner-rounding strategy (vertical):
 *   Each item defaults to rounded-xs (4dp, inner corners).
 *   The first item in a segment gets rounded-t-lg (16dp top corners).
 *   The last item in a segment gets rounded-b-lg (16dp bottom corners).
 *   Segment boundaries are determined by:
 *     - first/last pseudo-classes (start/end of entire menu)
 *     - CSS adjacent-sibling selectors relative to [data-menu-gap] elements
 *
 *   Adjacent-sibling selectors:
 *     Immediately after a gap  → [[data-menu-gap]+&]:rounded-t-lg
 *     Immediately before a gap → the item uses has-[+[data-menu-gap]] which
 *                                only works if the gap is a true sibling.
 *                                RAC wraps items in <li> so we use
 *                                [:has(+[data-menu-gap])]:rounded-b-lg on the
 *                                item element itself when supported; where not,
 *                                the MenuItem component also computes and
 *                                injects explicit override classes.
 *
 * Color mapping (MD3 Expressive spec):
 *   Standard — item bg: surface-container-low; label: on-surface; icons/trailing: on-surface-variant
 *              selected/open bg: tertiary-container; content: on-tertiary-container
 *   Vibrant  — item bg: tertiary-container; label: on-tertiary-container; icons/trailing: on-tertiary-container
 *              selected/open bg: tertiary; content: on-tertiary
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuItemVariants = cva(
  [
    // Layout — height set by density context in MenuItem component
    "relative flex w-full items-center",
    "gap-3",
    // Typography: Label Large per MD3 menu spec
    "text-label-large",
    // Interaction
    "cursor-pointer select-none outline-none",
    // Color transition (effects — no overshoot)
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled — self-targeting data-[x]: selectors (RAC emits data-disabled)
    "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      /**
       * Color scheme — drives item bg, default text/icon color, and selection colors.
       *
       * standard: surface-container-low bg, on-surface text, on-surface-variant icons.
       *           Selected/open: tertiary-container bg highlight, on-tertiary-container content.
       * vibrant:  tertiary-container bg, on-tertiary-container text AND icons.
       *           Selected/open: tertiary bg highlight, on-tertiary content.
       */
      colorScheme: {
        standard: ["text-on-surface"],
        vibrant: ["text-on-tertiary-container"],
      },
      /**
       * Visual style — drives padding, segment surface, and corner rounding.
       *
       * baseline: 12dp h-padding, no item background (container provides it).
       * vertical: 16dp h-padding, item owns segment surface, segmented rounding
       *   via first/last + adjacent-sibling gap selectors.
       */
      menuStyle: {
        baseline: ["px-3"],
        vertical: [
          "px-4",
          // Default: inner item (4dp all corners)
          "rounded-xs",
          // First item in the whole menu → 16dp top corners
          "first:rounded-t-lg",
          // Last item in the whole menu → 16dp bottom corners
          "last:rounded-b-lg",
          // Immediately AFTER a MenuGap → 16dp top corners (new segment starts)
          "[[data-menu-gap]+&]:rounded-t-lg",
          // Immediately BEFORE a MenuGap → 16dp bottom corners (segment ends)
          // has() targets the element that has an immediately adjacent sibling gap
          "[&:has(+[data-menu-gap])]:rounded-b-lg",
        ],
      },
    },
    compoundVariants: [
      // vertical + standard: item background = surface-container-low
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: ["bg-surface-container-low"],
      },
      // vertical + vibrant: item background = tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["bg-tertiary-container"],
      },
      // vertical + standard: selected/open text → on-tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: [
          "data-[selected]:text-on-tertiary-container",
          "data-[open]:text-on-tertiary-container",
        ],
      },
      // vertical + vibrant: selected/open text → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["data-[selected]:text-on-tertiary", "data-[open]:text-on-tertiary"],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── MENU ITEM HIGHLIGHT ─────────────────────────────────────────────────────

/**
 * Selected/active-background highlight layer for menu items.
 *
 * Geometry:
 *   baseline — `inset-0 rounded-[inherit]` (full-bleed, inherits item corner radius)
 *   vertical — `inset-0 rounded-[inherit]` (full-bleed, inherits segment card corners)
 *
 * Both styles use `inset-0 rounded-[inherit]` so the highlight always fills the
 * item exactly, respecting whichever corner radii the item has (inner 4dp for
 * middle items, outer 16dp for top/bottom items in a segment).
 *
 * Selection/active colors per menuStyle × colorScheme:
 *   baseline (any):         group-data-[selected]/menuitem:bg-surface-container-highest
 *   vertical + standard:    group-data-[selected]/menuitem:bg-tertiary-container
 *                           group-data-[open]/menuitem:bg-tertiary-container
 *   vertical + vibrant:     group-data-[selected]/menuitem:bg-tertiary
 *                           group-data-[open]/menuitem:bg-tertiary
 *
 * @see https://m3.material.io/components/menus/specs — Selected state
 */
export const menuItemHighlightVariants = cva(
  [
    "absolute inset-0 pointer-events-none",
    // Inherit the item's own corner radius (inner 4dp or outer 16dp)
    "rounded-[inherit]",
    // Effects transition for background-color — no overshoot
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // z-0: below state layer (z-[1]) and content (z-10)
    "z-0",
  ],
  {
    variants: {
      menuStyle: {
        baseline: [],
        vertical: [],
      },
      colorScheme: {
        standard: [
          // baseline selected bg
          "group-data-[selected]/menuitem:bg-surface-container-highest",
        ],
        vibrant: [
          // baseline + vibrant: use surface-container-highest as fallback
          "group-data-[selected]/menuitem:bg-surface-container-highest",
        ],
      },
    },
    compoundVariants: [
      // vertical + standard: selected/open highlight → tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: [
          "group-data-[selected]/menuitem:bg-tertiary-container",
          "group-data-[open]/menuitem:bg-tertiary-container",
        ],
      },
      // vertical + vibrant: selected/open highlight → tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: [
          "group-data-[selected]/menuitem:bg-tertiary",
          "group-data-[open]/menuitem:bg-tertiary",
        ],
      },
    ],
    defaultVariants: {
      menuStyle: "baseline",
      colorScheme: "standard",
    },
  }
);

// ─── MENU ITEM STATE LAYER ────────────────────────────────────────────────────

/**
 * State layer slot — absolute inset overlay that transitions opacity on
 * hover / press interaction states.
 *
 * Geometry: `inset-0 rounded-[inherit]` for both baseline and vertical —
 * full-bleed, inherits item corner radius so the state layer respects
 * the segment card shape.
 *
 * Color mapping (MD3 Expressive):
 *   standard: bg-on-surface (unselected/unopen)
 *             group-data-[selected] / group-data-[open]: bg-on-tertiary-container
 *   vibrant:  bg-on-tertiary-container (unselected/unopen)
 *             group-data-[selected] / group-data-[open]: bg-on-tertiary
 *
 * Focus-visible state is NOT expressed as a state-layer opacity here —
 * it is expressed via the dedicated focus-ring slot (menuItemFocusRingVariants)
 * per the MD3 Expressive reference state grid.
 *
 * State-layer opacities per MD3 spec:
 *   Hover:   8%   (opacity-8)
 *   Pressed: 10%  (opacity-10, doubled selector wins over hover)
 *
 * @see https://m3.material.io/components/menus/specs#state-layers
 */
export const menuItemStateLayerVariants = cva(
  [
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
    // Effects transition — opacity must NOT overshoot
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/menuitem:opacity-8",
    // Pressed: 10%, doubled selector wins over hover at same cascade position
    "group-data-[pressed]/menuitem:group-data-[pressed]/menuitem:opacity-10",
    // No state layer when disabled
    "group-data-[disabled]/menuitem:hidden",
    // z-[1]: above highlight layer (z-0), below content (z-10)
    "z-[1]",
  ],
  {
    variants: {
      colorScheme: {
        standard: ["bg-on-surface"],
        vibrant: ["bg-on-tertiary-container"],
      },
      menuStyle: {
        baseline: [],
        vertical: [],
      },
    },
    compoundVariants: [
      // vertical + standard: selected/open state layer → on-tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: [
          "group-data-[selected]/menuitem:bg-on-tertiary-container",
          "group-data-[open]/menuitem:bg-on-tertiary-container",
        ],
      },
      // vertical + vibrant: selected/open state layer → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: [
          "group-data-[selected]/menuitem:bg-on-tertiary",
          "group-data-[open]/menuitem:bg-on-tertiary",
        ],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── MENU ITEM FOCUS RING ─────────────────────────────────────────────────────

/**
 * Focus ring slot — keyboard-focus indicator rendered as an absolute overlay
 * with an outline that extends inside the item boundary.
 *
 * Unlike the Button focus ring (which uses `inset-[-3px]` to extend outward),
 * the menu item focus ring uses `-outline-offset-2` (inset 2dp) so it stays
 * within the segment card without clipping adjacent items.
 *
 * Geometry: `inset-0 rounded-[inherit]` — full-bleed, inherits item corners.
 * Color: `outline-secondary` per MD3 focus indicator token.
 * Opacity: 0 at rest → 100% on focus-visible.
 *
 * @see https://m3.material.io/components/menus/specs — States
 */
export const menuItemFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-[inherit]",
  "outline outline-2 -outline-offset-2 outline-secondary",
  // Effects transition — opacity must not overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/menuitem:opacity-100",
  // z-[2]: above state layer (z-[1]) and highlight (z-0), below content (z-10)
  "z-[2]",
]);

// ─── MENU ITEM ICON ───────────────────────────────────────────────────────────

/**
 * Icon slot (leading and trailing icons) for menu items.
 *
 * Color mapping (MD3 Expressive):
 *   standard:  on-surface-variant (unselected); on-tertiary-container (selected/open)
 *   vibrant:   on-tertiary-container (unselected); on-tertiary (selected/open)
 *
 * Size per menuStyle:
 *   baseline — 24dp (MD3 baseline spec)
 *   vertical — 20dp (SegmentedMenuTokens.ItemLeadingIconSize = 20dp)
 *
 * Disabled: on-surface/38 per MD3 spec.
 *
 * @see https://m3.material.io/components/menus/specs#anatomy
 */
export const menuItemIconVariants = cva(
  [
    "relative z-10 shrink-0 flex items-center justify-center",
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled: 38% opacity on icon color
    "group-data-[disabled]/menuitem:text-on-surface/38",
  ],
  {
    variants: {
      colorScheme: {
        standard: ["text-on-surface-variant"],
        vibrant: ["text-on-tertiary-container"],
      },
      menuStyle: {
        baseline: ["h-6 w-6"],
        vertical: ["h-5 w-5"],
      },
    },
    compoundVariants: [
      // vertical + standard: selected/open icon → on-tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: [
          "group-data-[selected]/menuitem:text-on-tertiary-container",
          "group-data-[open]/menuitem:text-on-tertiary-container",
        ],
      },
      // vertical + vibrant: selected/open icon → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: [
          "group-data-[selected]/menuitem:text-on-tertiary",
          "group-data-[open]/menuitem:text-on-tertiary",
        ],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── MENU SECTION ─────────────────────────────────────────────────────────────

/**
 * Menu section container variants (CVA).
 */
export const menuSectionVariants = cva(["flex flex-col w-full"]);

// ─── MENU SECTION HEADER ──────────────────────────────────────────────────────

/**
 * Menu section header variants (CVA).
 *
 * Color mapping (MD3 Expressive):
 *   standard: text-on-surface-variant
 *   vibrant:  text-on-tertiary-container
 *
 * @see https://m3.material.io/components/menus/specs — Callout 10
 */
export const menuSectionHeaderVariants = cva(
  ["px-3 pt-2 pb-1", "text-title-small", "select-none"],
  {
    variants: {
      colorScheme: {
        standard: ["text-on-surface-variant"],
        vibrant: ["text-on-tertiary-container"],
      },
    },
    defaultVariants: {
      colorScheme: "standard",
    },
  }
);

// ─── MENU DIVIDER ─────────────────────────────────────────────────────────────

/**
 * Menu item divider variants (CVA).
 *
 * Horizontal separator with `border-outline-variant`.
 * Spacing: 2dp top/bottom (`my-0.5`) per MD3 spec.
 *
 * @see https://m3.material.io/components/menus/specs — Measurements
 */
export const menuDividerVariants = cva(["border-t border-outline-variant", "my-0.5 mx-3"]);

// ─── MENU GAP ────────────────────────────────────────────────────────────────

/**
 * Menu gap variants (CVA).
 *
 * A 2dp visual spacer for MD3 Expressive vertical menus. The gap reveals the
 * page background between item segments, acting as a visual divider without
 * a line. Set aria-hidden and role="none" in the component.
 *
 * Height: 2dp (h-0.5) — keeps the segment separation tight but visible.
 *
 * @see https://m3.material.io/components/menus/guidelines#gaps-and-dividers
 */
export const menuGapVariants = cva(["h-0.5 w-full"]);

// ─── MENU ITEM TRAILING TEXT ──────────────────────────────────────────────────

/**
 * Trailing text (keyboard shortcut) variants (CVA).
 *
 * Color mapping (MD3 Expressive):
 *   standard: on-surface-variant (unselected); on-tertiary-container (selected/open)
 *   vibrant:  on-tertiary-container (unselected); on-tertiary (selected/open)
 *
 * Disabled: on-surface/38.
 */
export const menuItemTrailingTextVariants = cva(
  [
    "ml-auto shrink-0 text-label-large",
    "select-none",
    "group-data-[disabled]/menuitem:text-on-surface/38",
  ],
  {
    variants: {
      colorScheme: {
        standard: ["text-on-surface-variant"],
        vibrant: ["text-on-tertiary-container"],
      },
      menuStyle: {
        baseline: [],
        vertical: [
          "group-data-[selected]/menuitem:text-on-tertiary-container",
          "group-data-[open]/menuitem:text-on-tertiary-container",
        ],
      },
    },
    compoundVariants: [
      // vertical + vibrant: selected/open trailing text → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: [
          "group-data-[selected]/menuitem:text-on-tertiary",
          "group-data-[open]/menuitem:text-on-tertiary",
        ],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── MENU ITEM DESCRIPTION ────────────────────────────────────────────────────

/**
 * Menu item description (supporting text) variants (CVA).
 *
 * Rendered below the label text.
 *
 * Color mapping (MD3 Expressive):
 *   standard: on-surface-variant (unselected); on-tertiary-container (selected/open)
 *   vibrant:  on-tertiary-container (unselected); on-tertiary (selected/open)
 *
 * Disabled: on-surface/38.
 */
export const menuItemDescriptionVariants = cva(
  ["text-body-medium", "select-none", "group-data-[disabled]/menuitem:text-on-surface/38"],
  {
    variants: {
      colorScheme: {
        standard: ["text-on-surface-variant"],
        vibrant: ["text-on-tertiary-container"],
      },
      menuStyle: {
        baseline: [],
        vertical: [
          "group-data-[selected]/menuitem:text-on-tertiary-container",
          "group-data-[open]/menuitem:text-on-tertiary-container",
        ],
      },
    },
    compoundVariants: [
      // vertical + vibrant: selected/open description → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: [
          "group-data-[selected]/menuitem:text-on-tertiary",
          "group-data-[open]/menuitem:text-on-tertiary",
        ],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type MenuContainerVariants = VariantProps<typeof menuContainerVariants>;
export type MenuPopoverVariants = VariantProps<typeof menuPopoverVariants>;
export type MenuItemVariants = VariantProps<typeof menuItemVariants>;
export type MenuItemHighlightVariants = VariantProps<typeof menuItemHighlightVariants>;
export type MenuItemStateLayerVariants = VariantProps<typeof menuItemStateLayerVariants>;
export type MenuItemFocusRingVariants = VariantProps<typeof menuItemFocusRingVariants>;
export type MenuItemIconVariants = VariantProps<typeof menuItemIconVariants>;
export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;
export type MenuSectionHeaderVariants = VariantProps<typeof menuSectionHeaderVariants>;
export type MenuItemTrailingTextVariants = VariantProps<typeof menuItemTrailingTextVariants>;
export type MenuItemDescriptionVariants = VariantProps<typeof menuItemDescriptionVariants>;
