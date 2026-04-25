import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Menu container variants (CVA).
 *
 * Surface: `bg-surface-container`
 * Elevation: `shadow-elevation-2`
 * Shape: `rounded-xs` (4dp per MD3 shape extra-small)
 * Width: min 112dp (`min-w-28`) / max 280dp (`max-w-70`) per MD3 spec
 *
 * Entry animation: scale-y + fade-in from top anchor point.
 * - Duration: `duration-medium2` (300ms)
 * - Easing: `ease-emphasized-decelerate`
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuContainerVariants = cva(
  [
    // Surface and elevation
    "bg-surface-container",
    "shadow-elevation-2",
    // Shape
    "rounded-xs",
    // Width constraints per MD3 spec (112dp min / 280dp max)
    "min-w-28 max-w-70",
    // Layout
    "py-2",
    "overflow-y-auto",
    // Stacking
    "z-50",
    // Focus outline handled by React Aria
    "outline-none",
    // Animation origin — scale from top anchor point
    "origin-top",
    // Transition for open/close scale+opacity animation
    "transition-[transform,opacity]",
    "duration-medium2",
    "ease-emphasized-decelerate",
  ],
  {
    variants: {
      /**
       * Open/closed state — drives scale and opacity.
       * - `true`:  menu visible (`scale-y-100 opacity-100`)
       * - `false`: menu collapsed (`scale-y-0 opacity-0 pointer-events-none`)
       */
      open: {
        true: ["scale-y-100 opacity-100"],
        false: ["scale-y-0 opacity-0 pointer-events-none"],
      },
    },
    defaultVariants: {
      open: false,
    },
  }
);

/**
 * Material Design 3 Menu item variants (CVA).
 *
 * Item height: 48dp (`h-12`) per MD3 spec.
 * Label: `text-label-large text-on-surface`
 * Leading/trailing icon color: `text-on-surface-variant`
 *
 * State layers (MD3 spec):
 * - Hover:         `opacity-8`  on `before:bg-on-surface`
 * - Focus visible: `opacity-12` on `before:bg-on-surface`
 * - Pressed:       `opacity-12` on `before:bg-on-surface`
 * - Disabled:      `opacity-38` on entire item, non-interactive
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const menuItemVariants = cva(
  [
    // Layout
    "relative flex w-full items-center",
    "h-12 px-3 gap-3",
    // Typography
    "text-label-large text-on-surface",
    // Interaction
    "cursor-pointer select-none outline-none",
    // State layer pseudo-element
    "before:absolute before:inset-0",
    "before:transition-opacity before:duration-short2 before:ease-standard",
    "before:opacity-0",
    // Hover and focus visible state layers
    "hover:before:opacity-8 before:bg-on-surface",
    "focus-visible:before:opacity-12",
    // Active pressed state layer
    "active:before:opacity-12",
    // Color transition for selection state
    "transition-colors duration-short2 ease-standard",
  ],
  {
    variants: {
      /**
       * Whether this item is disabled.
       * Applies `opacity-38` and removes pointer interaction per MD3 spec.
       */
      isDisabled: {
        true: ["opacity-38 cursor-not-allowed pointer-events-none"],
        false: [],
      },
      /**
       * Whether this item is currently selected (select variant).
       * Applies `bg-secondary-container` / `text-on-secondary-container` and
       * changes state-layer color to `on-secondary-container`.
       */
      isSelected: {
        true: [
          "bg-secondary-container",
          "text-on-secondary-container",
          "before:bg-on-secondary-container",
        ],
        false: [],
      },
    },
    defaultVariants: {
      isDisabled: false,
      isSelected: false,
    },
  }
);

/**
 * Menu section container variants (CVA).
 * Groups related menu items.
 */
export const menuSectionVariants = cva(["flex flex-col w-full"]);

/**
 * Menu section header variants (CVA).
 *
 * Header text: `text-title-small text-on-surface-variant` per MD3 spec.
 */
export const menuSectionHeaderVariants = cva([
  "px-3 pt-2 pb-1",
  "text-title-small text-on-surface-variant",
  "select-none",
]);

/**
 * Menu item divider variants (CVA).
 *
 * Horizontal rule using `border-outline-variant` per MD3 spec.
 */
export const menuDividerVariants = cva(["border-t border-outline-variant", "my-1 mx-0"]);

/**
 * Trailing text (keyboard shortcut) variants (CVA).
 *
 * Rendered at the trailing end of a MenuItem for keyboard shortcut hints.
 * Color: `text-on-surface-variant`, size: `text-label-large`.
 */
export const menuItemTrailingTextVariants = cva([
  "ml-auto shrink-0 text-label-large text-on-surface-variant",
  "select-none",
]);

// ─── Type exports ─────────────────────────────────────────────────────────────

export type MenuContainerVariants = VariantProps<typeof menuContainerVariants>;
export type MenuItemVariants = VariantProps<typeof menuItemVariants>;
export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;
