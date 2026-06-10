import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Menu container variants (CVA).
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (menuStyle, colorScheme).
 * - Enter/exit animation uses composite MD3 utilities (animate-md-scale-in/out)
 *   sourced from the token system — no hardcoded durations or beziers.
 * - Placement-aware transform-origin is set via data-placement data attributes
 *   emitted by React Aria's Popover.
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
    // Layout
    "py-2",
    // Scroll behaviour
    "overflow-y-auto",
    "max-h-[calc(var(--visual-viewport-height,100vh)-2rem)]",
    // Stacking
    "z-50",
    // Focus outline delegated to React Aria
    "outline-none",
    // Promote to compositor layer — scale + opacity animations run without layout reflow
    "will-change-[transform,opacity]",
    // Block pointer events during animation to prevent accidental item clicks
    "data-[entering]:pointer-events-none data-[exiting]:pointer-events-none",

    // ── Enter animation ─────────────────────────────────────────────────────
    // animate-md-scale-in: scale(0.85)+opacity:0 → scale(1)+opacity:1
    // Duration: 350ms expressive-fast-spatial spring (intentional overshoot)
    "data-[entering]:animate-md-scale-in",

    // ── Exit animation ──────────────────────────────────────────────────────
    // animate-md-scale-out: scale(1)+opacity:1 → scale(0.85)+opacity:0
    // Duration: 200ms emphasized-accelerate (accelerating exit)
    "data-[exiting]:animate-md-scale-out",

    // ── Transform origin (placement-aware) ──────────────────────────────────
    // RAC sets data-placement on the Popover element.
    // Default (bottom): origin at top edge (menu expands downward)
    "origin-top",
    "data-[placement=top]:origin-bottom",
    "data-[placement=left]:origin-right",
    "data-[placement=right]:origin-left",

    // ── Reduced motion ───────────────────────────────────────────────────────
    "motion-reduce:data-[entering]:animate-none motion-reduce:data-[exiting]:animate-none",
  ],
  {
    variants: {
      /**
       * Color scheme — drives the container background (vertical style only).
       * baseline always uses surface-container regardless of colorScheme.
       */
      colorScheme: {
        standard: [],
        vibrant: [],
      },
      /**
       * Visual style — drives corner radius and container background.
       */
      menuStyle: {
        baseline: ["rounded-xs", "bg-surface-container"],
        vertical: ["rounded-lg", "bg-surface-container-low"],
      },
    },
    compoundVariants: [
      // vertical + vibrant → tertiary container background
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["bg-tertiary-container"],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

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
 * Height: 48/44/40/36dp controlled by density via context (not CVA).
 * Padding: 12dp left/right, 12dp gap between elements.
 *
 * Selected backgrounds per menuStyle × colorScheme:
 *   baseline (any):          data-[selected]:bg-surface-container-highest
 *   vertical + standard:     data-[selected]:bg-tertiary-container
 *   vertical + vibrant:      data-[selected]:bg-tertiary
 *
 * Disabled:
 *   The root itself gets data-[disabled]:pointer-events-none/cursor-not-allowed.
 *   Content (label, icons) are coloured at 38% via per-slot selectors.
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuItemVariants = cva(
  [
    // Layout — height set by density context in MenuItem component
    "relative flex w-full items-center",
    "px-3 gap-3",
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
       * Visual style — drives corner radius on items and selection background.
       */
      menuStyle: {
        baseline: [
          // Selected: surface-container-highest, text stays on-surface
          "data-[selected]:bg-surface-container-highest",
        ],
        vertical: [],
      },
    },
    compoundVariants: [
      // vertical + standard: selected → tertiary-container
      {
        menuStyle: "vertical",
        colorScheme: "standard",
        class: [
          "data-[selected]:bg-tertiary-container",
          "data-[selected]:text-on-tertiary-container",
        ],
      },
      // vertical + vibrant: selected → tertiary
      {
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["data-[selected]:bg-tertiary", "data-[selected]:text-on-tertiary"],
      },
    ],
    defaultVariants: {
      colorScheme: "standard",
      menuStyle: "baseline",
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
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
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
    "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center",
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
      menuStyle: {
        baseline: [],
        vertical: [],
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
export const menuDividerVariants = cva(["border-t border-outline-variant", "my-2 mx-0"]);

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
export const menuGapVariants = cva(["h-2 w-full"]);

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
export type MenuItemVariants = VariantProps<typeof menuItemVariants>;
export type MenuItemStateLayerVariants = VariantProps<typeof menuItemStateLayerVariants>;
export type MenuItemIconVariants = VariantProps<typeof menuItemIconVariants>;
export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;
