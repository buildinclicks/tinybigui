import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Button Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no disabled/loading state variants).
 * - All interaction states are driven by data-* attributes on the root via
 *   group-data-[x]/button Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-icon, data-loading) are set explicitly by the component.
 *
 * Slot responsibilities:
 *   buttonVariants           — root <button>; shape, color, elevation
 *   buttonStateLayerVariants — hover/focus/press opacity ring (absolute inset overlay)
 *   buttonFocusRingVariants  — keyboard focus outline, MUST NOT be inside overflow-hidden
 *   buttonIconVariants       — leading/trailing icon wrapper
 *   buttonLabelVariants      — label text slot
 *
 * MD3 Spec:
 *   Shape: rounded-full (corner-full)
 *   Height: 32dp small | 40dp medium | 56dp large
 *   Padding: 16dp small | 24dp medium | 32dp large (12dp text variant)
 *   Icon size: 18px × 18px
 *   State-layer opacities: hover 8% | focus 10% | pressed 10%
 *   Disabled: container 12% opacity, content 38% opacity
 *
 * Elevation per state (MD3 comp tokens):
 *   Filled   base=0  hover=1  focus=0  pressed=0
 *   Tonal    base=0  hover=1  focus=0  pressed=0
 *   Elevated base=1  hover=2  focus=1  pressed=1
 *   Outlined base=0  hover=0  focus=0  pressed=0
 *   Text     base=0  hover=0  focus=0  pressed=0
 */

// ─── BUTTON ROOT / CONTAINER ─────────────────────────────────────────────────

/**
 * Root <button> element.
 *
 * IMPORTANT — overflow is intentionally NOT on the root.
 * Overflow clipping is delegated to the ripple container and state layer
 * via `overflow-hidden rounded-[inherit]` on those children. This lets the
 * focus ring span (`inset-[-3px]`) extend outside the button boundary and
 * remain fully visible — if overflow-hidden were on the root it would be
 * clipped to zero width.
 */
export const buttonVariants = cva(
  [
    // Layout + shape — NO overflow-hidden here (see note above)
    "relative inline-flex items-center justify-center",
    "rounded-full cursor-pointer select-none",
    // Split MD3 transition: spatial (border-radius) → expressive spring;
    // effects (color/bg/shadow) → standard effects spring.
    "btn-transition",
    // Disabled — self-targeting data-[x]: selectors
    "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  ],
  {
    variants: {
      /**
       * Button variant (MD3 specification — strict, no color override)
       *
       * Elevation per state follows _md-comp-*-button.scss tokens:
       *   Filled/Tonal  hover→level-1, focus/pressed→level-0
       *   Elevated      base→level-1, hover→level-2, focus/pressed→level-1
       *   Outlined/Text no elevation
       */
      variant: {
        /**
         * Filled — highest emphasis.
         * MD3: container=primary, label=on-primary, state-layer=on-primary
         * Elevation: 0 base → 1 hover → 0 focus → 0 pressed
         */
        filled: [
          "bg-primary text-on-primary shadow-none",
          // Hover: gains level-1 elevation
          "group-data-[hovered]/button:shadow-elevation-1",
          // Focus/pressed: shadow must explicitly return to level-0
          // (doubled attribute selector → higher specificity than hover)
          "group-data-[focus-visible]/button:shadow-none",
          "group-data-[pressed]/button:shadow-none",
          // Disabled overrides
          "group-data-[disabled]/button:bg-on-surface/12",
          "group-data-[disabled]/button:text-on-surface/38",
          "group-data-[disabled]/button:shadow-none",
        ],

        /**
         * Outlined — medium emphasis. Transparent with border.
         * MD3: container=transparent, outline=outline, label=primary, state-layer=primary
         * Elevation: always 0
         */
        outlined: [
          "bg-transparent border border-outline-variant text-primary",
          // Disabled overrides
          "group-data-[disabled]/button:border-on-surface/12",
          "group-data-[disabled]/button:text-on-surface/38",
        ],

        /**
         * Tonal — secondary emphasis.
         * MD3 name: "Filled tonal". container=secondary-container, label=on-secondary-container
         * Elevation: 0 base → 1 hover → 0 focus → 0 pressed
         */
        tonal: [
          "bg-secondary-container text-on-secondary-container shadow-none",
          // Hover: gains level-1 elevation (same as filled)
          "group-data-[hovered]/button:shadow-elevation-1",
          // Focus/pressed: return to level-0
          "group-data-[focus-visible]/button:shadow-none",
          "group-data-[pressed]/button:shadow-none",
          // Disabled overrides
          "group-data-[disabled]/button:bg-on-surface/12",
          "group-data-[disabled]/button:text-on-surface/38",
          "group-data-[disabled]/button:shadow-none",
        ],

        /**
         * Elevated — separation via shadow.
         * MD3: container=surface-container-low, label=primary
         * Elevation: 1 base → 2 hover → 1 focus → 1 pressed
         */
        elevated: [
          "bg-surface-container-low text-primary shadow-elevation-1",
          // Hover: gains extra elevation
          "group-data-[hovered]/button:shadow-elevation-2",
          // Focus/pressed: return to base level-1
          // (doubled selector wins over single hover selector at same cascade position)
          "group-data-[focus-visible]/button:shadow-elevation-1",
          "group-data-[pressed]/button:shadow-elevation-1",
          // Disabled overrides
          "group-data-[disabled]/button:bg-on-surface/12",
          "group-data-[disabled]/button:text-on-surface/38",
          "group-data-[disabled]/button:shadow-none",
        ],

        /**
         * Text — lowest emphasis.
         * MD3: container=transparent, label=primary, state-layer=primary
         * Elevation: always 0
         */
        text: [
          "bg-transparent text-primary",
          // Disabled overrides
          "group-data-[disabled]/button:text-on-surface/38",
        ],
      },

      /**
       * Button size
       * MD3 spec: small=32dp, medium=40dp, large=56dp
       * Padding: small=16dp, medium=24dp, large=32dp
       * Text variant uses reduced padding: small=12dp, medium=12dp
       */
      size: {
        small: "h-8 px-4 gap-1 text-label-medium tracking-[0.1px]",
        medium: "h-10 px-6 gap-2 text-label-large tracking-[0.1px]",
        large: "h-14 px-8 gap-2 text-title-medium",
      },

      /**
       * Full width button (spans container)
       */
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    /**
     * Compound variants for text variant reduced padding per size
     * MD3: text buttons use 12dp padding (px-3) instead of standard padding
     */
    compoundVariants: [
      { variant: "text", size: "small", className: "px-3" },
      { variant: "text", size: "medium", className: "px-3" },
      { variant: "text", size: "large", className: "px-4" },
    ],

    defaultVariants: {
      variant: "filled",
      size: "medium",
      fullWidth: false,
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay that transitions opacity on interaction.
 *
 * Color is variant-specific (uses the "on-container" role per MD3):
 *   filled   → bg-on-primary
 *   outlined → bg-primary
 *   tonal    → bg-on-secondary-container
 *   elevated → bg-primary
 *   text     → bg-primary
 *
 * Opacity:
 *   0 at rest
 *   8% hover
 *   10% focus/pressed
 *   hidden when disabled
 *
 * Pressed (10%) must win over hover (8%) when both data attributes are set
 * simultaneously. The doubled attribute selector for pressed gives it higher
 * specificity than the singly-chained hover selector:
 *   group-data-[hovered]/button:           → specificity (0,1,0) relative weight
 *   group-data-[pressed]/button:group-...  → specificity (0,2,0) always wins
 *
 * overflow-hidden is placed HERE (not on the root button) so the state layer
 * clips to the button shape while the focus ring span can extend outside.
 */
export const buttonStateLayerVariants = cva(
  [
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
    // Effects transition for opacity — standard spring, no overshoot
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/button:opacity-[0.08]",
    // Focus: 10%
    "group-data-[focus-visible]/button:opacity-10",
    // Pressed: 10%, doubled selector wins over hover
    "group-data-[pressed]/button:opacity-10",
    // No state layer when disabled
    "group-data-[disabled]/button:hidden",
  ],
  {
    variants: {
      variant: {
        filled: "bg-on-primary",
        outlined: "bg-primary",
        tonal: "bg-on-secondary-container",
        elevated: "bg-primary",
        text: "bg-primary",
      },
    },
    defaultVariants: { variant: "filled" },
  }
);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring overlay.
 *
 * Rendered as an absolute `<span>` with `inset-[-3px]` so it extends 3px
 * outside the button boundary. This REQUIRES that `overflow-hidden` is NOT
 * on the root `<button>` element — overflow clipping is moved to the ripple
 * container and state layer instead.
 *
 * The ring is always present in the DOM (opacity-0 at rest) and transitions
 * to opacity-100 on keyboard/programmatic focus, which avoids layout shifts
 * and allows the CSS transition to animate it smoothly.
 */
export const buttonFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  // Effects transition — opacity change must not overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/button:opacity-100",
]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Icon wrapper (leading or trailing).
 *
 * MD3 spec: icons inside buttons must be 18×18px.
 * Color is inherited from the parent button's text color.
 * `invisible` (not `hidden`) when loading — keeps layout stable so the
 * spinner can take the same space without reflowing adjacent content.
 */
export const buttonIconVariants = cva(
  [
    "relative z-10 inline-flex shrink-0 items-center justify-center",
    "size-[18px]",
    // Color transition uses effects token (no spatial overshoot on color)
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      hidden: {
        true: "invisible",
        false: "",
      },
    },
    defaultVariants: { hidden: false },
  }
);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Label text wrapper.
 * Typography + color are inherited from the root buttonVariants classes.
 * z-10 keeps it above the state layer and ripple overlays.
 */
export const buttonLabelVariants = cva(["relative z-10 inline-flex items-center"]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type ButtonStateLayerVariants = VariantProps<typeof buttonStateLayerVariants>;
export type ButtonIconVariants = VariantProps<typeof buttonIconVariants>;
export type ButtonLabelVariants = VariantProps<typeof buttonLabelVariants>;
