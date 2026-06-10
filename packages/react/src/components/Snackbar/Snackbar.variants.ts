import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Snackbar Variants (CVA)
 *
 * Architecture: Variants vs States
 * ─────────────────────────────────
 * - CVA holds design-time choices only (twoLine density, animationState, position).
 * - Dedicated slot CVAs for the action button and close button replace the old
 *   shared `Button`/`IconButton` usage, giving MD3-correct state-layer colors
 *   on the inverse surface:
 *     • Action button  → state-layer  bg-inverse-primary
 *     • Close button   → state-layer  bg-inverse-on-surface
 * - All interaction states on action/close slots are driven by data-* attributes
 *   via group-data-[x]/snackbar-action and group-data-[x]/snackbar-close selectors.
 *
 * MD3 Specifications:
 * - Surface color    : inverse-surface
 * - Text color       : inverse-on-surface
 * - Shape            : extra-small (4dp) → rounded-xs
 * - Elevation        : level-3 → shadow-elevation-3
 * - Width            : 288dp min (min-w-72) / 568dp max (max-w-snackbar-max)
 * - Single-line height: 48dp (min-h-12)
 * - Two-line height  : 68dp (min-h-[4.25rem])
 * - Action text      : label-large, inverse-primary
 * - Close icon       : 24dp (size-6), inverse-on-surface
 * - Entry motion     : slide + fade in, spring-standard-default-effects (200ms)
 * - Exit motion      : slide + fade out, spring-standard-fast-effects (150ms)
 */

// ─── Stack container (fixed viewport anchor, per-position group) ──────────────

/**
 * Outer wrapper rendered once per active position group by `SnackbarProvider`.
 * Handles the fixed viewport positioning and stacking direction for all
 * snackbars sharing the same `position` value.
 *
 * - Bottom positions use `flex-col-reverse` so the newest snackbar sits at
 *   the bottom edge and older ones push upward.
 * - Top positions use `flex-col` so the newest sits at the top edge and
 *   older ones push downward.
 * - `pointer-events-none` on the container lets clicks pass through the gaps
 *   between snackbars; each snackbar restores `pointer-events-auto`.
 */
export const snackbarStackContainerVariants = cva(
  ["fixed", "z-50", "flex", "gap-2", "pointer-events-none"],
  {
    variants: {
      position: {
        "bottom-center": [
          "bottom-4",
          "left-1/2",
          "-translate-x-1/2",
          "flex-col-reverse",
          "items-center",
        ],
        "bottom-left": ["bottom-4", "left-4", "flex-col-reverse", "items-start"],
        "bottom-right": ["bottom-4", "right-4", "flex-col-reverse", "items-end"],
        "top-center": ["top-4", "left-1/2", "-translate-x-1/2", "flex-col", "items-center"],
        "top-left": ["top-4", "left-4", "flex-col", "items-start"],
        "top-right": ["top-4", "right-4", "flex-col", "items-end"],
      },
    },
    defaultVariants: { position: "bottom-center" },
  }
);

export type SnackbarStackContainerVariants = VariantProps<typeof snackbarStackContainerVariants>;

// ─── Base container (surface, shape, density — no positioning) ────────────────

/**
 * Snackbar base container variants — structural, surface, and density classes.
 * Positioning is handled by the stack container (`snackbarStackContainerVariants`).
 *
 * `twoLine` drives two distinct density profiles:
 *   false — 48dp min-height, content vertically centered (MD3 single-line)
 *   true  — 68dp min-height, content top-aligned (MD3 two-line)
 */
export const snackbarBaseVariants = cva(
  [
    // Sizing (MD3 spec: 288dp min, 568dp max)
    "min-w-72",
    "max-w-snackbar-max",
    "w-max",

    // Restore pointer events so hover/focus timer pause works
    "pointer-events-auto",

    // Surface
    "bg-inverse-surface",

    // Shape: MD3 extra-small corner = 4dp
    "rounded-xs",

    // Elevation level 3
    "shadow-elevation-3",

    // Layout
    "flex",
    "gap-x-1",
    "pl-4",

    // Typography base (inherited by message/supporting-text slots)
    "text-body-medium",
    "text-inverse-on-surface",

    // Slide + fade transition — spring-standard effects tokens (no overshoot).
    // The translate offset is small (12px), so using the effects token pair for
    // BOTH opacity AND transform is safe: no visible overshoot at this scale.
    "transition-[opacity,transform]",
    "will-change-[opacity,transform]",
  ],
  {
    variants: {
      /**
       * Two-line density mode.
       *   false — 48dp, items centered (single-line message)
       *   true  — 68dp, items top-aligned (message + supporting text)
       */
      twoLine: {
        false: ["min-h-12", "items-center", "pr-1"],
        true: ["min-h-[4.25rem]", "items-start", "pr-1"],
      },
    },
    defaultVariants: {
      twoLine: false,
    },
  }
);

export type SnackbarBaseVariants = VariantProps<typeof snackbarBaseVariants>;

// ─── Position variants (standalone / headless usage) ─────────────────────────

/**
 * Snackbar screen position variants.
 *
 * Applied to the **stack container** in `SnackbarProvider`. Kept as a separate
 * export so standalone (non-provider) `SnackbarHeadless` usage can apply
 * position classes directly.
 *
 * MD3 default is `bottom-center`.
 */
export const snackbarPositionVariants = cva("", {
  variants: {
    position: {
      "bottom-center": ["bottom-4", "left-1/2", "-translate-x-1/2"],
      "bottom-left": ["bottom-4", "left-4"],
      "bottom-right": ["bottom-4", "right-4"],
      "top-center": ["top-4", "left-1/2", "-translate-x-1/2"],
      "top-left": ["top-4", "left-4"],
      "top-right": ["top-4", "right-4"],
    },
  },
  defaultVariants: {
    position: "bottom-center",
  },
});

export type SnackbarPositionVariants = VariantProps<typeof snackbarPositionVariants>;

// ─── Animation state classes ──────────────────────────────────────────────────

/**
 * Position-aware slide + fade animation variants.
 *
 * Replaces the legacy scale/zoom approach with MD3-compliant slide + fade
 * using spring-standard effects tokens (no overshoot on opacity or the small
 * translate offset).
 *
 * Enter direction:
 *   up   (bottom positions) → element starts below viewport edge, slides up
 *   down (top positions)    → element starts above viewport edge, slides down
 *
 * Animation flow:
 *   entering → initial paint (opacity-0 + directional translate, no duration)
 *   visible  → slide in + fade in (spring-standard-default-effects = 200ms)
 *   exiting  → slide out + fade out (spring-standard-fast-effects = 150ms)
 *   exited   → hold final position (removed from DOM by provider)
 *
 * compoundVariants express (animationState × enterDirection) pairs — both are
 * derived runtime values, and full explicit compounds are the only reliable way
 * to set direction-specific translate without Tailwind class-order conflicts.
 */
export const snackbarAnimationVariants = cva("", {
  variants: {
    animationState: {
      entering: [],
      visible: [],
      exiting: [],
      exited: [],
    },
    enterDirection: {
      up: [],
      down: [],
    },
  },
  compoundVariants: [
    // ── entering ──────────────────────────────────────────────────────────────
    // No transition duration — instant jump to offset state before first paint.
    {
      animationState: "entering",
      enterDirection: "up",
      className: ["opacity-0", "translate-y-3"],
    },
    {
      animationState: "entering",
      enterDirection: "down",
      className: ["opacity-0", "-translate-y-3"],
    },

    // ── visible ───────────────────────────────────────────────────────────────
    // spring-standard default effects = 200ms, no overshoot.
    {
      animationState: "visible",
      enterDirection: "up",
      className: [
        "opacity-100",
        "translate-y-0",
        "duration-spring-standard-default-effects",
        "ease-spring-standard-default-effects",
      ],
    },
    {
      animationState: "visible",
      enterDirection: "down",
      className: [
        "opacity-100",
        "translate-y-0",
        "duration-spring-standard-default-effects",
        "ease-spring-standard-default-effects",
      ],
    },

    // ── exiting ───────────────────────────────────────────────────────────────
    // spring-standard fast effects = 150ms (quicker exit).
    {
      animationState: "exiting",
      enterDirection: "up",
      className: [
        "opacity-0",
        "translate-y-3",
        "duration-spring-standard-fast-effects",
        "ease-spring-standard-fast-effects",
      ],
    },
    {
      animationState: "exiting",
      enterDirection: "down",
      className: [
        "opacity-0",
        "-translate-y-3",
        "duration-spring-standard-fast-effects",
        "ease-spring-standard-fast-effects",
      ],
    },

    // ── exited ────────────────────────────────────────────────────────────────
    // Hold final position — element is removed from DOM shortly after.
    {
      animationState: "exited",
      enterDirection: "up",
      className: ["opacity-0", "translate-y-3"],
    },
    {
      animationState: "exited",
      enterDirection: "down",
      className: ["opacity-0", "-translate-y-3"],
    },
  ],
  defaultVariants: {
    animationState: "entering",
    enterDirection: "up",
  },
});

export type SnackbarAnimationVariants = VariantProps<typeof snackbarAnimationVariants>;

/**
 * Combined container variants (base + position + animation) for convenience.
 * Used by consumers who want the full combined class string without the
 * render-prop pattern (e.g. standalone headless usage outside the provider).
 *
 * The main rendering path uses `snackbarBaseVariants` + `snackbarAnimationVariants`
 * separately for better separation of concerns.
 */
export const snackbarContainerVariants = cva(
  [
    "min-w-72",
    "max-w-snackbar-max",
    "w-max",
    "pointer-events-auto",
    "bg-inverse-surface",
    "rounded-xs",
    "shadow-elevation-3",
    "flex",
    "gap-x-1",
    "pl-4",
    "text-body-medium",
    "text-inverse-on-surface",
    "transition-[opacity,transform]",
    "will-change-[opacity,transform]",
  ],
  {
    variants: {
      twoLine: {
        false: ["min-h-12", "items-center", "pr-1"],
        true: ["min-h-[4.25rem]", "items-start", "pr-1"],
      },
      animationState: {
        entering: [],
        visible: [],
        exiting: [],
        exited: [],
      },
      enterDirection: {
        up: [],
        down: [],
      },
      position: {
        "bottom-center": ["bottom-4", "left-1/2", "-translate-x-1/2"],
        "bottom-left": ["bottom-4", "left-4"],
        "bottom-right": ["bottom-4", "right-4"],
        "top-center": ["top-4", "left-1/2", "-translate-x-1/2"],
        "top-left": ["top-4", "left-4"],
        "top-right": ["top-4", "right-4"],
      },
    },
    compoundVariants: [
      {
        animationState: "entering",
        enterDirection: "up",
        className: ["opacity-0", "translate-y-3"],
      },
      {
        animationState: "entering",
        enterDirection: "down",
        className: ["opacity-0", "-translate-y-3"],
      },
      {
        animationState: "visible",
        enterDirection: "up",
        className: [
          "opacity-100",
          "translate-y-0",
          "duration-spring-standard-default-effects",
          "ease-spring-standard-default-effects",
        ],
      },
      {
        animationState: "visible",
        enterDirection: "down",
        className: [
          "opacity-100",
          "translate-y-0",
          "duration-spring-standard-default-effects",
          "ease-spring-standard-default-effects",
        ],
      },
      {
        animationState: "exiting",
        enterDirection: "up",
        className: [
          "opacity-0",
          "translate-y-3",
          "duration-spring-standard-fast-effects",
          "ease-spring-standard-fast-effects",
        ],
      },
      {
        animationState: "exiting",
        enterDirection: "down",
        className: [
          "opacity-0",
          "-translate-y-3",
          "duration-spring-standard-fast-effects",
          "ease-spring-standard-fast-effects",
        ],
      },
      {
        animationState: "exited",
        enterDirection: "up",
        className: ["opacity-0", "translate-y-3"],
      },
      {
        animationState: "exited",
        enterDirection: "down",
        className: ["opacity-0", "-translate-y-3"],
      },
    ],
    defaultVariants: {
      animationState: "entering",
      enterDirection: "up",
      position: "bottom-center",
      twoLine: false,
    },
  }
);

export type SnackbarContainerVariants = VariantProps<typeof snackbarContainerVariants>;

// ─── Content column ───────────────────────────────────────────────────────────

/**
 * Inner content column (message + optional supporting text).
 *
 * `py-3` (12dp) provides vertical breathing room:
 *   Single-line: 12px + 20px text + 12px = 44px, centered in 48dp by parent
 *   Two-line:    12px + 44px content + 12px = 68dp = exactly min-h-[4.25rem]
 */
export const snackbarContentVariants = cva([
  "flex",
  "flex-col",
  "flex-1",
  "min-w-0",
  "py-3",
  "pr-2",
]);

// ─── Message ─────────────────────────────────────────────────────────────────

/**
 * Primary message text slot.
 * MD3: body-medium, inverse-on-surface color.
 */
export const snackbarMessageVariants = cva([
  "flex-1",
  "text-body-medium",
  "text-inverse-on-surface",
]);

// ─── Supporting text ─────────────────────────────────────────────────────────

/**
 * Supporting text slot (two-line configuration).
 * MD3: body-medium, full inverse-on-surface color (no opacity reduction).
 */
export const snackbarSupportingTextVariants = cva([
  "text-body-medium",
  "text-inverse-on-surface",
  "mt-1",
]);

// ─── Initial hidden state ─────────────────────────────────────────────────────

/**
 * Classes applied before the enter animation begins (component just mounted).
 * Transparent — the slide-in entry starts from this state.
 * The translate offset is applied via `snackbarAnimationVariants` entering state.
 */
export const snackbarInitialVariants = cva(["opacity-0"]);

// ─── Position → direction helper ─────────────────────────────────────────────

/**
 * Derives the enter animation direction from the Snackbar position.
 * Bottom positions slide up; top positions slide down.
 */
export function getEnterDirection(position: string): "up" | "down" {
  return position.startsWith("top") ? "down" : "up";
}

// ─── ACTION BUTTON — dedicated slot CVAs ─────────────────────────────────────
//
// Replaces the reused shared `Button` component whose state-layer color
// (`bg-primary`) is wrong on an inverse-surface container. The dedicated slot
// uses `bg-inverse-primary` for both label and state-layer per MD3 spec.
//
// Group scope: group/snackbar-action

/**
 * Action button root.
 *
 * MD3: text button style on inverse-surface.
 * - Container: 36dp height (h-9), 12dp horizontal padding (px-3)
 * - Shape: full rounded (rounded-full)
 * - Color: inverse-primary label
 * - No overflow-hidden on root so focus-ring span (inset-[-3px]) is not clipped.
 *   State-layer has its own overflow-hidden to clip ripple children.
 */
export const snackbarActionVariants = cva([
  // Layout
  "relative inline-flex items-center justify-center shrink-0",
  "h-9 px-3",
  "rounded-full cursor-pointer select-none",

  // Typography (MD3 text button: label-large)
  "text-label-large",
  "text-inverse-primary",

  // Effects transition (color)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",

  // Disabled
  "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  "data-[disabled]:text-on-surface/38",
]);

/**
 * Action button state layer.
 * MD3: state-layer color = inverse-primary (matches the label color role).
 * Opacities: hover 8% | focus-visible 10% | pressed 10% (doubled wins over hover).
 */
export const snackbarActionStateLayerVariants = cva([
  "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
  "bg-inverse-primary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hover: 8%
  "group-data-[hovered]/snackbar-action:opacity-8",
  // Focus: 10%
  "group-data-[focus-visible]/snackbar-action:opacity-10",
  // Pressed: 10%, doubled selector wins over hover
  "group-data-[pressed]/snackbar-action:group-data-[pressed]/snackbar-action:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/snackbar-action:hidden",
]);

/**
 * Action button focus ring.
 * Extends 3px outside the button boundary (inset-[-3px]).
 * Requires NO overflow-hidden on the root button.
 */
export const snackbarActionFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-full",
  "outline outline-2 outline-offset-0 outline-inverse-primary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/snackbar-action:opacity-100",
]);

// ─── CLOSE BUTTON — dedicated slot CVAs ──────────────────────────────────────
//
// Replaces the reused shared `IconButton` which was `size="medium"` (56dp),
// overflowing the 48dp snackbar. The dedicated slot is 32dp (size-8) and uses
// `bg-inverse-on-surface` for the state-layer per MD3 spec.
//
// Group scope: group/snackbar-close

/**
 * Close button root.
 *
 * MD3: standard icon button style on inverse-surface.
 * - Container: 32dp (size-8) — fits within 48dp snackbar with 8dp margin each side
 * - Shape: rounded-full
 * - Color: inverse-on-surface icon
 * - No overflow-hidden on root so focus-ring span (inset-[-3px]) is not clipped.
 */
export const snackbarCloseVariants = cva([
  // Layout
  "relative inline-flex items-center justify-center shrink-0",
  "size-8",
  "rounded-full cursor-pointer select-none",

  // Color
  "text-inverse-on-surface",

  // Effects transition (color)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",

  // Disabled
  "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  "data-[disabled]:text-on-surface/38",
]);

/**
 * Close button state layer.
 * MD3: state-layer color = inverse-on-surface (matches the icon color role).
 * Opacities: hover 8% | focus-visible 10% | pressed 10% (doubled wins over hover).
 */
export const snackbarCloseStateLayerVariants = cva([
  "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
  "bg-inverse-on-surface",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hover: 8%
  "group-data-[hovered]/snackbar-close:opacity-8",
  // Focus: 10%
  "group-data-[focus-visible]/snackbar-close:opacity-10",
  // Pressed: 10%, doubled selector wins over hover
  "group-data-[pressed]/snackbar-close:group-data-[pressed]/snackbar-close:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/snackbar-close:hidden",
]);

/**
 * Close button focus ring.
 * Extends 3px outside the button boundary (inset-[-3px]).
 * Requires NO overflow-hidden on the root button.
 */
export const snackbarCloseFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-full",
  "outline outline-2 outline-offset-0 outline-inverse-on-surface",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/snackbar-close:opacity-100",
]);

/**
 * Close button icon wrapper.
 * MD3: 24dp icon inside a 32dp touch target.
 */
export const snackbarCloseIconVariants = cva([
  "relative z-10 inline-flex shrink-0 items-center justify-center",
  "size-6",
]);

// ─── Exported types ───────────────────────────────────────────────────────────

export type SnackbarActionVariants = VariantProps<typeof snackbarActionVariants>;
export type SnackbarActionStateLayerVariants = VariantProps<
  typeof snackbarActionStateLayerVariants
>;
export type SnackbarActionFocusRingVariants = VariantProps<typeof snackbarActionFocusRingVariants>;
export type SnackbarCloseVariants = VariantProps<typeof snackbarCloseVariants>;
export type SnackbarCloseStateLayerVariants = VariantProps<typeof snackbarCloseStateLayerVariants>;
export type SnackbarCloseFocusRingVariants = VariantProps<typeof snackbarCloseFocusRingVariants>;
export type SnackbarCloseIconVariants = VariantProps<typeof snackbarCloseIconVariants>;
