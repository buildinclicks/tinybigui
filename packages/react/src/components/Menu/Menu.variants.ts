import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Menu container variants (CVA).
 *
 * Elevation: `shadow-elevation-2` (both styles)
 * Width: min 112dp / max 280dp per MD3 spec
 *
 * Shape per menuStyle:
 * - baseline: `rounded-xs` (4dp extra-small)
 * - vertical: `rounded-lg` (16dp large)
 *
 * Background per colorScheme + menuStyle:
 * - baseline + standard: `bg-surface-container`
 * - vertical + standard: `bg-surface-container-low`
 * - vertical + vibrant:  `bg-tertiary-container`
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuContainerVariants = cva(
  [
    // Elevation
    "shadow-elevation-2",
    // Width constraints per MD3 spec (112dp min / 280dp max)
    "min-w-28 max-w-70",
    // Layout
    "py-2",
    // Scroll: show scrollbar when content overflows; max height avoids clipping
    "overflow-y-auto",
    "max-h-[calc(var(--visual-viewport-height,100vh)-2rem)]",
    // Stacking
    "z-50",
    // Focus outline handled by React Aria
    "outline-none",
    // GPU compositing — promotes menu to its own compositor layer so
    // scale + opacity animations run without triggering layout reflow.
    "will-change-[transform,opacity]",
    // Pointer events blocked during animation to prevent accidental clicks
    // on menu items while the panel is still animating in or out.
    "data-[entering]:pointer-events-none data-[exiting]:pointer-events-none",
    // ── Enter animation ────────────────────────────────────────────────────
    // @keyframes menu-enter (defined in styles.css): scale(0.8)+opacity:0 →
    // scale(1)+opacity:1 in 120ms with cubic-bezier(0,0,0.2,1) (standard
    // decelerate — matches Angular Material's _mat-menu-enter keyframe).
    "data-[entering]:animate-[menu-enter_120ms_cubic-bezier(0,0,0.2,1)_both]",
    // ── Exit animation ─────────────────────────────────────────────────────
    // @keyframes menu-exit (defined in styles.css): opacity:1 → opacity:0
    // in 100ms after 25ms delay, linear — matches Angular Material's
    // _mat-menu-exit keyframe (fade-only, no reverse scale).
    "data-[exiting]:animate-[menu-exit_100ms_25ms_linear_both]",
    // ── Transform origin (placement-aware) ────────────────────────────────
    // RAC sets data-placement="bottom|top|left|right" on the Popover element.
    // Default (bottom): origin at top edge (menu expands downward).
    "origin-top",
    // top: origin at bottom edge (menu expands upward)
    "data-[placement=top]:origin-bottom",
    // left: origin at right edge
    "data-[placement=left]:origin-right",
    // right: origin at left edge
    "data-[placement=right]:origin-left",
    // ── Reduced motion ────────────────────────────────────────────────────
    // Skip both animations entirely for users who prefer reduced motion.
    "motion-reduce:data-[entering]:animate-none motion-reduce:data-[exiting]:animate-none",
  ],
  {
    variants: {
      /**
       * Color scheme — drives the container background.
       * baseline+standard uses a separate compound variant.
       */
      colorScheme: {
        standard: [],
        vibrant: [],
      },
      /**
       * Visual style — drives corner radius and baseline vs vertical background.
       */
      menuStyle: {
        baseline: ["rounded-xs", "bg-surface-container"],
        vertical: ["rounded-lg", "bg-surface-container-low"],
      },
    },
    compoundVariants: [
      // Vertical + vibrant: tertiary container background
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

/**
 * Material Design 3 Menu item variants (CVA).
 *
 * Typography: `text-body-large` per MD3 baseline spec (16sp / 400 weight).
 * Padding: `px-3` (12dp left/right), `gap-3` (12dp between elements).
 *
 * State layers (MD3 spec):
 * - Hover:         `opacity-8`  on state layer
 * - Focus visible: `opacity-12` on state layer
 * - Pressed:       `opacity-12` on state layer
 * - Disabled:      `opacity-38` on entire item
 *
 * Selection colors per menuStyle + colorScheme:
 * - baseline (any):         `bg-surface-container-highest`
 * - vertical + standard:    `bg-tertiary-container text-on-tertiary-container`
 * - vertical + vibrant:     `bg-tertiary text-on-tertiary`
 *
 * Note: item height (48/44/40/36dp) is controlled by density via context,
 * applied directly in MenuItem component (not CVA) to avoid negative key issues.
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuItemVariants = cva(
  [
    // Layout — height set by density context in MenuItem component
    "relative flex w-full items-center",
    "px-3 gap-3",
    // Typography: Body Large per MD3 baseline spec
    "text-body-large",
    // Interaction
    "cursor-pointer select-none outline-none",
    // State layer pseudo-element
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:transition-opacity before:duration-short2 before:ease-standard",
    "before:opacity-0",
    // Hover state layer
    "hover:before:opacity-8",
    // Focus visible state layer
    "focus-visible:before:opacity-12",
    // Active pressed state layer
    "active:before:opacity-12",
    // Color transition for selection
    "transition-colors duration-short2 ease-standard",
  ],
  {
    variants: {
      /**
       * Disabled state: reduces opacity and blocks interaction.
       */
      isDisabled: {
        true: ["opacity-38 cursor-not-allowed pointer-events-none"],
        false: [],
      },
      /**
       * Selected state: background and text color driven by compound variants.
       */
      isSelected: {
        true: [],
        false: [],
      },
      /**
       * Color scheme: drives default text and state layer colors.
       * - standard: on-surface text, on-surface state layer
       * - vibrant (vertical only): on-tertiary-container text + state layer
       */
      colorScheme: {
        standard: ["text-on-surface", "before:bg-on-surface"],
        vibrant: ["text-on-tertiary-container", "before:bg-on-tertiary-container"],
      },
      /**
       * Visual style: drives corner radius on items (vertical uses rounded-lg
       * inherited from container, items stay flat inside).
       */
      menuStyle: {
        baseline: [],
        vertical: [],
      },
    },
    compoundVariants: [
      // ── Baseline selection (both colorSchemes) ──────────────────────────
      {
        isSelected: true,
        menuStyle: "baseline",
        class: [
          "bg-surface-container-highest",
          // text-on-surface already applied by standard colorScheme variant
        ],
      },
      // ── Vertical + Standard selection ───────────────────────────────────
      {
        isSelected: true,
        menuStyle: "vertical",
        colorScheme: "standard",
        class: [
          "bg-tertiary-container",
          "text-on-tertiary-container",
          "before:bg-on-tertiary-container",
        ],
      },
      // ── Vertical + Vibrant selection ─────────────────────────────────────
      {
        isSelected: true,
        menuStyle: "vertical",
        colorScheme: "vibrant",
        class: ["bg-tertiary", "text-on-tertiary", "before:bg-on-tertiary"],
      },
    ],
    defaultVariants: {
      isDisabled: false,
      isSelected: false,
      colorScheme: "standard",
      menuStyle: "baseline",
    },
  }
);

/**
 * Menu section container variants (CVA).
 */
export const menuSectionVariants = cva(["flex flex-col w-full"]);

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

/**
 * Menu item divider variants (CVA).
 *
 * Renders a horizontal separator with `border-outline-variant`.
 * Padding: 8dp top/bottom (`my-2`) per MD3 spec.
 *
 * @see https://m3.material.io/components/menus/specs — Measurements
 */
export const menuDividerVariants = cva(["border-t border-outline-variant", "my-2 mx-0"]);

/**
 * Menu gap variants (CVA).
 *
 * A visual spacer for M3 Expressive vertical menus. Uses spacing instead of
 * a border line to separate item groups. `aria-hidden` and `role="none"`.
 *
 * @see https://m3.material.io/components/menus/guidelines#gaps-and-dividers
 */
export const menuGapVariants = cva(["h-2 w-full"]);

/**
 * Trailing text (keyboard shortcut) variants (CVA).
 *
 * Color: `text-on-surface-variant`, size: `text-label-large` (14sp).
 * The element also carries `aria-keyshortcuts` for screen reader support.
 */
export const menuItemTrailingTextVariants = cva([
  "ml-auto shrink-0 text-label-large text-on-surface-variant",
  "select-none",
]);

/**
 * Menu item description (supporting text) variants (CVA).
 *
 * Rendered below the label text.
 * Typography: `text-body-medium text-on-surface-variant`.
 */
export const menuItemDescriptionVariants = cva([
  "text-body-medium text-on-surface-variant",
  "select-none",
]);

// ─── Type exports ─────────────────────────────────────────────────────────────

export type MenuContainerVariants = VariantProps<typeof menuContainerVariants>;
export type MenuItemVariants = VariantProps<typeof menuItemVariants>;
export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;
