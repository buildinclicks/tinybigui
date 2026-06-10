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
 * Background per menuStyle × colorScheme:
 *   baseline + standard:  bg-surface-container
 *   vertical + standard:  bg-surface-container-low
 *   vertical + vibrant:   bg-tertiary-container
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
       * Color scheme — drives the container background (baseline only).
       * vertical menus paint each item with the group surface; the container
       * itself is transparent so the 2dp gap between groups reveals nothing.
       */
      colorScheme: {
        standard: [],
        vibrant: [],
      },
      /**
       * Visual style — drives corner radius and container background.
       *
       * baseline: solid surface-container, 4dp corners, 8dp vertical padding.
       * vertical: transparent container, 16dp corners, no vertical padding —
       *   each item owns its group background so gaps appear between them.
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
 * Why here and not on the inner RACMenu:
 * RAC's Popover owns the overlay lifecycle and sets these data attributes on
 * itself, not on the child Menu element. Placing animation classes on RACMenu
 * means they never match.
 *
 * Motion:
 *   Enter: animate-md-scale-in (350ms expressive-fast-spatial, scale+fade)
 *   Exit:  animate-md-scale-out (200ms emphasized-accelerate, scale+fade)
 *
 * Transform-origin is placement-aware: menus below the trigger expand from the
 * top edge; menus above expand from the bottom, etc.
 *
 * @see https://m3.material.io/components/menus/specs — Motion
 */
export const menuPopoverVariants = cva([
  // Promote to compositor layer so scale + opacity animate without layout reflow
  "will-change-[transform,opacity]",
  // Block pointer events while animating to prevent accidental item clicks
  "data-[entering]:pointer-events-none data-[exiting]:pointer-events-none",
  // Enter: 350ms expressive-fast-spatial spring (intentional overshoot)
  "data-[entering]:animate-md-scale-in",
  // Exit: 200ms emphasized-accelerate (accelerating exit)
  "data-[exiting]:animate-md-scale-out",
  // Transform origin — default bottom placement expands downward from top edge
  "origin-top",
  "data-[placement=top]:origin-bottom",
  "data-[placement=left]:origin-right",
  "data-[placement=right]:origin-left",
  // Reduced motion: skip both animations entirely
  "motion-reduce:data-[entering]:animate-none motion-reduce:data-[exiting]:animate-none",
]);

// ─── MENU ITEM ROOT ───────────────────────────────────────────────────────────

/**
 * Material Design 3 Menu item root variants (CVA).
 *
 * Architecture: Variants vs States
 * - CVA holds only design-time decisions: colorScheme, menuStyle.
 * - All interaction/selection states are driven by data-* attributes that RAC
 *   MenuItem emits natively (data-hovered, data-pressed, data-focus-visible,
 *   data-selected, data-disabled) — read via group-data-[x]/menuitem selectors.
 * - The root element sets group/menuitem so all slot children can read state.
 *
 * Typography: Label Large per MD3 menu spec (14sp / 500 weight).
 * Height: 48/44/40/36dp (baseline/vertical) controlled by density via context.
 * Padding: baseline 12dp left/right; vertical 16dp left/right (ItemLeadingSpace).
 * Gap between icon and label: 12dp (ItemBetweenSpace, unchanged).
 *
 * Vertical segmented group background strategy:
 *   The container is transparent for vertical menus. Each item paints its own
 *   group surface (bg-surface-container-low / bg-tertiary-container), and CSS
 *   sibling selectors on [data-menu-gap] adjacent items produce the correct
 *   corner-radius composition:
 *     leading item (first or after-gap): rounded-t-lg (16dp top) + rounded-b-xs (4dp bottom)
 *     trailing item (last or before-gap): rounded-t-xs (4dp top) + rounded-b-lg (16dp bottom)
 *     standalone (first AND last): rounded-lg (all 16dp)
 *     middle item: rounded-xs (4dp all)
 *   [data-menu-gap] is set on the MenuGap component so the CSS selectors resolve.
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
       * Color scheme — drives default text color, state-layer color, and
       * selection text colors.
       */
      colorScheme: {
        standard: ["text-on-surface"],
        vibrant: ["text-on-tertiary-container"],
      },
      /**
       * Visual style — drives padding, group background, and corner rounding.
       *
       * baseline: 12dp h-padding, no item background (container provides it).
       * vertical: 16dp h-padding, item owns group surface background, CSS
       *   sibling selectors on [data-menu-gap] form the rounded group cards.
       */
      menuStyle: {
        baseline: ["px-3"],
        vertical: [
          "px-4",
          // Group surface — the container is transparent for vertical
          "bg-surface-container-low",
          // Segmented corner rounding
          // Default: inner item (4dp all corners)
          "rounded-xs",
          // First item in menu: 16dp top corners
          "first:rounded-t-lg",
          // Last item in menu: 16dp bottom corners
          "last:rounded-b-lg",
          // Item immediately before a gap: 16dp bottom corners
          "has-[[data-menu-gap]~&]:rounded-b-lg",
          // Item immediately after a gap: 16dp top corners
          "[[data-menu-gap]~&]:rounded-t-lg",
        ],
      },
    },
    compoundVariants: [
      // vertical + vibrant: item bg → tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["bg-tertiary-container"],
      },
      // vertical + standard: selected text → on-tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: ["data-[selected]:text-on-tertiary-container"],
      },
      // vertical + vibrant: selected text → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["data-[selected]:text-on-tertiary"],
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
 * Selected-background highlight layer for menu items.
 *
 * Geometry is menuStyle-aware:
 *   baseline — `inset-0` (full-bleed, square background; unchanged MD3 look)
 *   vertical — `inset-x-1 inset-y-0 rounded-md` (horizontal-only 4dp inset,
 *               12dp CornerMedium per MD3 Expressive; selection no longer spans
 *               full width but does fill item height to avoid vertical gaps)
 *
 * The layer is always present in the DOM and transitions its background-color
 * to the selection color on `data-selected`.
 *
 * Selection colors per menuStyle × colorScheme:
 *   baseline (any):         group-data-[selected]/menuitem:bg-surface-container-highest
 *   vertical + standard:    group-data-[selected]/menuitem:bg-tertiary-container
 *   vertical + vibrant:     group-data-[selected]/menuitem:bg-tertiary
 *
 * @see https://m3.material.io/components/menus/specs — Selected state
 */
export const menuItemHighlightVariants = cva(
  [
    "absolute pointer-events-none",
    // Effects transition for background-color — no overshoot
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // z-0: below state layer (z-[1]) and content (z-10)
    "z-0",
  ],
  {
    variants: {
      menuStyle: {
        baseline: ["inset-0"],
        // horizontal-only inset + 12dp corners (CornerMedium = ItemSelectedShape)
        vertical: ["inset-x-1 inset-y-0 rounded-md"],
      },
      colorScheme: {
        standard: [
          // baseline selected bg (vertical standard compound below overrides)
          "group-data-[selected]/menuitem:bg-surface-container-highest",
        ],
        vibrant: [
          // baseline + vibrant: use surface-container-highest as fallback
          // (vertical vibrant compound below overrides)
          "group-data-[selected]/menuitem:bg-surface-container-highest",
        ],
      },
    },
    compoundVariants: [
      // vertical + standard selected: tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: ["group-data-[selected]/menuitem:bg-tertiary-container"],
      },
      // vertical + vibrant selected: tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["group-data-[selected]/menuitem:bg-tertiary"],
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
 * hover / focus / press interaction states.
 *
 * Architecture mirrors buttonStateLayerVariants:
 * - Opacity driven by group-data-[x]/menuitem selectors (no CSS pseudo-classes)
 * - Pressed (opacity-10) uses doubled attribute selector to beat hover (opacity-8)
 * - Hidden entirely when disabled — no state layer on disabled items
 * - Color is variant-driven (on-surface for standard, on-tertiary-container for
 *   vibrant), with selected override per menuStyle × colorScheme
 *
 * State-layer opacities per MD3 spec:
 *   Hover:         8%   (opacity-8)
 *   Focus visible: 10%  (opacity-10)
 *   Pressed:       10%  (opacity-10, doubled selector wins over hover)
 *
 * @see https://m3.material.io/components/menus/specs#state-layers
 */
export const menuItemStateLayerVariants = cva(
  [
    "absolute overflow-hidden pointer-events-none opacity-0",
    // Effects transition — opacity must NOT overshoot
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/menuitem:opacity-8",
    // Focus visible: 10%
    "group-data-[focus-visible]/menuitem:opacity-10",
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
        // baseline: full-bleed, inherits container corner radius
        baseline: ["inset-0 rounded-[inherit]"],
        // vertical: horizontal-only inset to match the highlight layer shape
        vertical: ["inset-x-1 inset-y-0 rounded-md"],
      },
    },
    compoundVariants: [
      // vertical + standard selected: state layer switches to on-tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: ["group-data-[selected]/menuitem:bg-on-tertiary-container"],
      },
      // vertical + vibrant selected: state layer switches to on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["group-data-[selected]/menuitem:bg-on-tertiary"],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

// ─── MENU ITEM ICON ───────────────────────────────────────────────────────────

/**
 * Icon slot (leading and trailing icons) for menu items.
 *
 * Base: 24×24dp, on-surface-variant color.
 * Selected: color follows the menuStyle × colorScheme selection color.
 * Disabled: on-surface/38 per MD3 spec.
 * Transition: effects spring (no overshoot on color).
 *
 * @see https://m3.material.io/components/menus/specs#anatomy
 */
export const menuItemIconVariants = cva(
  [
    "relative z-10 shrink-0 flex items-center justify-center",
    "text-on-surface-variant",
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled: 38% opacity on icon color
    "group-data-[disabled]/menuitem:text-on-surface/38",
  ],
  {
    variants: {
      colorScheme: {
        standard: [],
        vibrant: [
          // Vibrant unselected icon: on-tertiary-container
          "text-on-tertiary-container",
        ],
      },
      /**
       * Size per menuStyle:
       *   baseline — 24dp (MD3 baseline spec)
       *   vertical — 20dp (SegmentedMenuTokens.ItemLeadingIconSize = 20dp)
       */
      menuStyle: {
        baseline: ["h-6 w-6"],
        vertical: ["h-5 w-5"],
      },
    },
    compoundVariants: [
      // vertical + standard selected: icon → on-tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: ["group-data-[selected]/menuitem:text-on-tertiary-container"],
      },
      // vertical + vibrant selected: icon → on-tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["group-data-[selected]/menuitem:text-on-tertiary"],
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
 * Typography: `text-title-small text-on-surface-variant` per MD3 spec.
 */
export const menuSectionHeaderVariants = cva([
  "px-3 pt-2 pb-1",
  "text-title-small text-on-surface-variant",
  "select-none",
]);

// ─── MENU DIVIDER ─────────────────────────────────────────────────────────────

/**
 * Menu item divider variants (CVA).
 *
 * Horizontal separator with `border-outline-variant`.
 * Padding: 8dp top/bottom (`my-2`) per MD3 spec.
 *
 * @see https://m3.material.io/components/menus/specs — Measurements
 */
export const menuDividerVariants = cva(["border-t border-outline-variant", "my-0.5 mx-3"]);

// ─── MENU GAP ────────────────────────────────────────────────────────────────

/**
 * Menu gap variants (CVA).
 *
 * A visual spacer for MD3 Expressive vertical menus. Uses spacing instead of
 * a border line to separate item groups. Set aria-hidden and role="none" in
 * the component.
 *
 * @see https://m3.material.io/components/menus/guidelines#gaps-and-dividers
 */
export const menuGapVariants = cva(["h-0.5 w-full"]);

// ─── MENU ITEM TRAILING TEXT ──────────────────────────────────────────────────

/**
 * Trailing text (keyboard shortcut) variants (CVA).
 *
 * Color: `text-on-surface-variant`, size: `text-label-large` (14sp).
 * The element also carries `aria-keyshortcuts` for screen reader support.
 * Disabled: on-surface/38 to match the rest of the item content.
 */
export const menuItemTrailingTextVariants = cva([
  "ml-auto shrink-0 text-label-large text-on-surface-variant",
  "select-none",
  "group-data-[disabled]/menuitem:text-on-surface/38",
]);

// ─── MENU ITEM DESCRIPTION ────────────────────────────────────────────────────

/**
 * Menu item description (supporting text) variants (CVA).
 *
 * Rendered below the label text.
 * Typography: `text-body-medium text-on-surface-variant`.
 * Disabled: on-surface/38.
 */
export const menuItemDescriptionVariants = cva([
  "text-body-medium text-on-surface-variant",
  "select-none",
  "group-data-[disabled]/menuitem:text-on-surface/38",
]);

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type MenuContainerVariants = VariantProps<typeof menuContainerVariants>;
export type MenuPopoverVariants = VariantProps<typeof menuPopoverVariants>;
export type MenuItemVariants = VariantProps<typeof menuItemVariants>;
export type MenuItemHighlightVariants = VariantProps<typeof menuItemHighlightVariants>;
export type MenuItemStateLayerVariants = VariantProps<typeof menuItemStateLayerVariants>;
export type MenuItemIconVariants = VariantProps<typeof menuItemIconVariants>;
export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;
