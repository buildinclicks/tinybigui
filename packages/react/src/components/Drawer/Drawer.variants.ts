import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Navigation Drawer container variants (CVA).
 *
 * Width: 360dp (`w-drawer`)
 * Shape: `rounded-r-xl` (28px right-side radius per MD3 shape extra-large)
 *
 * Slide-in animation is driven by MD3 motion tokens:
 * - Enter: `duration-medium4` (400ms), `ease-emphasized-decelerate`
 * - Exit:  `duration-medium2` (300ms), `ease-emphasized-accelerate`
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerVariants = cva(
  [
    // Layout
    "fixed top-0 left-0 h-full",
    "flex flex-col overflow-y-auto",
    // Stacking and shape
    "z-50",
    "rounded-r-xl",
    // Slide animation (transition applies to all open/closed state changes)
    "transition-transform duration-medium4 ease-emphasized-decelerate",
    // Focus outline removal (focus management handled by FocusScope / React Aria)
    "outline-none",
    // Padding for content spacing
    "px-3",
  ],
  {
    variants: {
      /**
       * Structural variant — drives surface color and elevation.
       * - `standard`: inline nav panel, lower-elevation surface
       * - `modal`: overlay dialog with elevation shadow
       */
      variant: {
        standard: ["bg-surface-container-low"],
        modal: ["bg-surface-container", "shadow-elevation-1"],
      },

      /**
       * Open/closed state — drives translation.
       * - `true`:  drawer visible (`translate-x-0`)
       * - `false`: drawer off-screen (`-translate-x-full`)
       */
      open: {
        true: ["translate-x-0"],
        false: ["-translate-x-full"],
      },

      /**
       * Icon-only compact mode — 80dp rail instead of 360dp drawer.
       * - `true`:  `w-20` (80dp), items centered
       * - `false`: `w-drawer` (360dp), standard layout
       */
      iconOnly: {
        true: ["w-20", "items-center"],
        false: ["w-drawer"],
      },
    },

    defaultVariants: {
      variant: "standard",
      open: false,
      iconOnly: false,
    },
  }
);

/**
 * Material Design 3 Navigation Drawer item variants (CVA).
 *
 * Each item is a full-width flex row with a pill-shaped active indicator.
 *
 * Active item: `bg-secondary-container` / `text-on-secondary-container`
 * Inactive item: `text-on-surface-variant`
 * State layers: `opacity-8` hover, `opacity-12` pressed
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerItemVariants = cva(
  [
    // Layout
    "relative flex w-full items-center gap-3",
    "h-14 px-4",
    "rounded-full",
    // Typography
    "text-label-large",
    // Interaction
    "cursor-pointer select-none outline-none",
    // State layer pseudo-element (z-[1] above active indicator)
    "before:absolute before:inset-0 before:rounded-full before:z-[1]",
    "before:transition-opacity before:duration-short2 before:ease-standard",
    "before:opacity-0",
    // Hover and focus visible state layers
    "hover:before:opacity-8",
    "focus-visible:before:opacity-12",
    // Active pressed state
    "active:before:opacity-12",
    // Transition for color changes
    "transition-colors duration-short2 ease-standard",
  ],
  {
    variants: {
      /**
       * Whether this item is the currently active destination.
       *
       * Active indicator is a 336dp pill rendered via `after:` pseudo-element
       * per MD3 Navigation Drawer spec.
       */
      isActive: {
        true: [
          "text-on-secondary-container",
          "before:bg-on-secondary-container",
          // Active indicator — 336dp pill via after: pseudo
          "after:absolute after:inset-0 after:mx-auto after:max-w-[336px]",
          "after:rounded-full after:bg-secondary-container",
        ],
        false: ["bg-transparent", "text-on-surface-variant", "before:bg-on-surface-variant"],
      },

      /**
       * Whether the item is disabled.
       * Applies `opacity-38` per MD3 disabled state spec.
       */
      isDisabled: {
        true: ["opacity-38 cursor-not-allowed pointer-events-none"],
        false: [],
      },
    },

    defaultVariants: {
      isActive: false,
      isDisabled: false,
    },
  }
);

/**
 * Modal scrim overlay variants (CVA).
 *
 * Covers the full viewport behind the modal drawer.
 * Clicking the scrim closes the drawer.
 *
 * Color: `bg-scrim` at `opacity-32` per MD3 spec.
 */
export const scrimVariants = cva([
  "fixed inset-0 z-40",
  "bg-scrim opacity-32",
  "transition-opacity duration-short4 ease-standard",
]);

/**
 * Drawer section container variants (CVA).
 *
 * Groups related items with an optional header label and divider.
 */
export const drawerSectionVariants = cva(["flex flex-col w-full"]);

/**
 * Drawer section header variants (CVA).
 *
 * Header text: `text-title-small text-on-surface-variant` per MD3 spec.
 */
export const drawerSectionHeaderVariants = cva([
  "px-4 pt-4 pb-2",
  "text-title-small text-on-surface-variant",
  "select-none",
]);

/**
 * Drawer section divider variants (CVA).
 *
 * Horizontal rule using `border-outline-variant`.
 */
export const drawerDividerVariants = cva(["border-t border-outline-variant", "mx-4 my-2"]);

// ─── Type exports ─────────────────────────────────────────────────────────────

export type DrawerVariants = VariantProps<typeof drawerVariants>;
export type DrawerItemVariants = VariantProps<typeof drawerItemVariants>;
export type ScrimVariants = VariantProps<typeof scrimVariants>;
export type DrawerSectionVariants = VariantProps<typeof drawerSectionVariants>;
