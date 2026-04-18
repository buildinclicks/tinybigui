import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Switch Variants (CVA)
 *
 * Type-safe variant management for Switch component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * MD3 Specifications:
 * - Track: 52x32dp, border-radius 16dp (full)
 * - Handle: 16x16dp (unselected), 24x24dp (selected), 28x28dp (pressed)
 * - Touch target: 48x48dp minimum
 * - State layers: 8% hover, 12% focus/pressed (on handle)
 * - Disabled: 12% container opacity, 38% content opacity
 * - Label spacing: 16px (ml-4)
 */

/**
 * Switch wrapper/label variants (main container)
 */
export const switchVariants = cva(
  [
    // Base classes (always applied to label wrapper)
    "relative inline-flex items-center cursor-pointer select-none",
    "transition-opacity duration-200",
  ],
  {
    variants: {
      /**
       * Disabled state
       */
      disabled: {
        true: "opacity-38 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

/**
 * Switch track variants (the 52x32dp background rail)
 */
export const switchTrackVariants = cva(
  [
    // Base classes for track
    "relative flex items-center",
    "w-[52px] h-[32px]", // MD3 spec: 52x32dp
    "rounded-full", // MD3 spec: border-radius 16dp (full)
    "transition-all duration-200",
  ],
  {
    variants: {
      /**
       * Switch state (determines track color)
       */
      selected: {
        true: "bg-primary", // MD3: selected track
        false: "bg-surface-container-highest", // MD3: unselected track
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "bg-on-surface/12", // MD3: 12% opacity for disabled
        false: "",
      },
    },
    compoundVariants: [
      // Disabled state overrides normal colors
      {
        selected: true,
        disabled: true,
        className: "bg-on-surface/12",
      },
      {
        selected: false,
        disabled: true,
        className: "bg-on-surface/12",
      },
    ],
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
);

/**
 * Switch handle container variants (the movable thumb with state layers)
 */
export const switchHandleContainerVariants = cva(
  [
    // Base classes for handle container (includes state layer)
    "absolute flex items-center justify-center",
    "rounded-full",
    "transition-all duration-200",

    // State layer (hover, focus, active) - MD3 spec: 8%/12%/12% opacity
    "before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-200",
    "before:bg-current before:opacity-0",
    "hover:before:opacity-8",
    "active:before:opacity-12",
  ],
  {
    variants: {
      /**
       * Switch state (determines handle position and size)
       */
      selected: {
        true: [
          "left-[24px]", // Position when ON (52px - 24px = 28px)
          "text-primary", // State layer color
        ],
        false: [
          "left-[8px]", // Position when OFF (centered in left half)
          "text-on-surface-variant", // State layer color
        ],
      },

      /**
       * Pressed state (increases handle size)
       */
      pressed: {
        true: "w-[28px] h-[28px]", // MD3: 28dp when pressed
        false: "",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      // Size depends on selected + pressed state
      {
        selected: true,
        pressed: false,
        className: "w-[24px] h-[24px]", // MD3: 24dp when selected
      },
      {
        selected: false,
        pressed: false,
        className: "w-[16px] h-[16px]", // MD3: 16dp when unselected
      },
    ],
    defaultVariants: {
      selected: false,
      pressed: false,
      disabled: false,
    },
  }
);

/**
 * Switch handle (the actual thumb visual)
 */
export const switchHandleVariants = cva(
  [
    // Base classes for the handle
    "relative z-10 rounded-full",
    "transition-all duration-200",
    "flex items-center justify-center",
  ],
  {
    variants: {
      /**
       * Switch state (determines handle color and size)
       */
      selected: {
        true: "bg-on-primary", // MD3: on-primary when selected
        false: "bg-outline", // MD3: outline when unselected
      },

      /**
       * Pressed state
       */
      pressed: {
        true: "w-[28px] h-[28px]", // MD3: 28dp when pressed
        false: "",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "bg-on-surface/38", // MD3: 38% opacity for disabled
        false: "",
      },
    },
    compoundVariants: [
      // Size depends on selected + pressed state
      {
        selected: true,
        pressed: false,
        className: "w-[24px] h-[24px]", // MD3: 24dp when selected
      },
      {
        selected: false,
        pressed: false,
        className: "w-[16px] h-[16px]", // MD3: 16dp when unselected
      },
      // Disabled state overrides normal colors
      {
        selected: true,
        disabled: true,
        className: "bg-on-surface/38",
      },
      {
        selected: false,
        disabled: true,
        className: "bg-on-surface/38",
      },
    ],
    defaultVariants: {
      selected: false,
      pressed: false,
      disabled: false,
    },
  }
);

/**
 * Switch icon variants (icons inside handle)
 */
export const switchIconVariants = cva(
  [
    // Base classes for icons
    "w-4 h-4", // MD3: 16x16dp icon size
    "transition-all duration-200",
  ],
  {
    variants: {
      /**
       * Icon visibility based on state
       */
      visible: {
        true: "opacity-100",
        false: "opacity-0",
      },

      /**
       * Disabled state
       */
      disabled: {
        true: "opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      visible: true,
      disabled: false,
    },
  }
);

/**
 * Switch label text variants
 */
export const switchLabelVariants = cva(
  [
    "text-sm", // MD3: Body Medium (14px)
    "text-on-surface",
    "select-none",
    "ml-4", // 16px spacing between switch and label (MD3 standard)
  ],
  {
    variants: {
      disabled: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type SwitchVariants = VariantProps<typeof switchVariants>;
export type SwitchTrackVariants = VariantProps<typeof switchTrackVariants>;
export type SwitchHandleContainerVariants = VariantProps<typeof switchHandleContainerVariants>;
export type SwitchHandleVariants = VariantProps<typeof switchHandleVariants>;
export type SwitchIconVariants = VariantProps<typeof switchIconVariants>;
export type SwitchLabelVariants = VariantProps<typeof switchLabelVariants>;
