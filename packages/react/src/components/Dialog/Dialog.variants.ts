import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Dialog Variants (CVA)
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no state variants, no state compoundVariants).
 * - `group/dialog` on the panel root lets slot children consume `data-with-icon` via
 *   `group-data-[with-icon]/dialog:` selectors (centering headline/content when icon is present).
 * - Content flags (`data-with-icon`) are set explicitly by the component, not via CVA.
 * - Scroll dividers are toggled by `data-scrolled-top` / `data-scrolled-bottom` on the content
 *   element (set by DialogContent's scroll handler) — no CVA variants needed for those.
 *
 * Slot responsibilities:
 *   dialogScrimVariants          — fixed full-screen overlay; bg-scrim/32; animated fade
 *   dialogPanelVariants          — floating card (basic) or full-viewport (fullscreen); surface, shape, elevation
 *   dialogWrapperVariants        — centering wrapper rendered by DialogHeadless around the panel
 *   dialogAnimationVariants      — enter/exit animation state machine (composite animate-md-* keyframes)
 *   dialogIconVariants           — optional hero icon above headline; centered; text-secondary
 *   dialogHeadlineVariants       — headline h2; text-headline-small; centers on icon presence
 *   dialogHeadlineTitleVariants  — title inside fullscreen top-app-bar row
 *   dialogContentVariants        — scrollable body; text-body-medium; scroll-divider borders
 *   dialogActionsVariants        — right-aligned action button row
 *
 * MD3 Specifications (https://m3.material.io/components/dialogs/specs):
 * - Basic surface:       surface-container-high
 * - Elevation:           level 3 → shadow-elevation-3
 * - Shape (Basic):       extra-large (28dp) → rounded-xl
 * - Min width (Basic):   280dp → min-w-70
 * - Max width (Basic):   560dp → max-w-dialog-max
 * - Internal padding:    24dp → p-6; headline mb-4; actions pt-3
 * - Scrim:               bg-scrim/32
 * - Headline:            text-headline-small, text-on-surface; centered when icon present
 * - Body:                text-body-medium, text-on-surface-variant; scrollable
 * - Action row:          right-aligned flex, gap-2, pt-3 (24dp)
 *
 * Motion (MD3 Expressive — composite keyframe utilities):
 * - Basic enter:        animate-md-scale-in  (expressive-fast-spatial 350ms)
 * - Basic exit:         animate-md-scale-out (emphasized-accelerate 200ms)
 * - Fullscreen enter:   animate-md-slide-in-bottom (standard-default-spatial 500ms)
 * - Fullscreen exit:    animate-md-slide-out-bottom (emphasized-accelerate 200ms)
 * - Scrim enter:        animate-md-fade-in (expressive-default-effects 200ms)
 * - Scrim exit:         animate-md-fade-out (standard-fast-effects 150ms)
 * - Reduced motion:     getAnimationClassName returns "" (no animation class added)
 */

// ─── Scrim overlay ──────────────────────────────────────────────────────────────

/**
 * Scrim overlay variants.
 *
 * Fades in on enter, fades out on exit via composite animate-md-* utilities.
 * The scrim's color + opacity are baked into `bg-scrim/32` so the element is
 * immediately visible even before the animation plays (forward-fill).
 *
 * Full-screen variant: same scrim but onClick is a no-op per MD3 spec.
 */
export const dialogScrimVariants = cva(
  [
    "fixed",
    "inset-0",
    "z-40",
    // MD3 scrim: bg-scrim at 32% opacity — always set so instant-show works in reduced-motion
    "bg-scrim/32",
  ],
  {
    variants: {
      animationState: {
        entering: ["opacity-0"],
        visible: ["animate-md-fade-in"],
        exiting: ["animate-md-fade-out"],
        exited: ["opacity-0", "pointer-events-none"],
      },
    },
    defaultVariants: {
      animationState: "entering",
    },
  }
);

export type DialogScrimVariants = VariantProps<typeof dialogScrimVariants>;

// ─── Panel container ────────────────────────────────────────────────────────────

/**
 * Dialog panel container variants.
 *
 * `group/dialog` enables child slots to read `data-with-icon` content flag via
 * `group-data-[with-icon]/dialog:` selectors (centers headline and content text).
 *
 * - `basic`:      floating card with rounded corners, elevation, max-width constraint.
 * - `fullscreen`: full viewport coverage, no corners, no max-width.
 *
 * `will-change-[opacity,transform]` is kept to hint the browser compositor during
 * the composite keyframe animation. `transition-*` is intentionally absent — the
 * composite `animate-md-*` utilities manage timing entirely.
 */
export const dialogPanelVariants = cva(
  [
    // Stacking above scrim
    "z-50",

    // Surface
    "bg-surface-container-high",

    // Flex column layout for slots
    "flex",
    "flex-col",

    // Compositor hint for keyframe animation
    "will-change-[opacity,transform]",

    // group scope — lets child slots consume data-with-icon via group-data-[with-icon]/dialog:
    "group/dialog",
  ],
  {
    variants: {
      variant: {
        basic: [
          // Shape: MD3 extra-large = 28dp
          "rounded-xl",
          // Elevation level 3
          "shadow-elevation-3",
          // Width constraints per MD3 spec (280dp min, 560dp max)
          "min-w-70",
          "max-w-dialog-max",
          "w-full",
          // Internal spacing: 24dp padding, headline mb-4, content mb-6, actions pt-3
          "pt-6",
          "pb-3",
          "px-6",
          // Positioning (centering wrapper handles the viewport centering)
          "relative",
        ],
        fullscreen: [
          // Full viewport
          "w-full",
          "h-full",
          // No rounded corners on fullscreen
          "rounded-none",
          // No elevation shadow on fullscreen
          "shadow-none",
          "relative",
        ],
      },
    },
    defaultVariants: {
      variant: "basic",
    },
  }
);

export type DialogPanelVariants = VariantProps<typeof dialogPanelVariants>;

// ─── Portal wrapper ─────────────────────────────────────────────────────────────

/**
 * Wrapper that centers the basic dialog in the viewport.
 * Not applied to the fullscreen variant (which fills the viewport directly).
 * Consumed by Dialog.tsx and passed as `wrapperClassName` to DialogHeadless.
 */
export const dialogWrapperVariants = cva([], {
  variants: {
    variant: {
      basic: ["fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "px-4"],
      fullscreen: ["fixed", "inset-0", "z-50"],
    },
  },
  defaultVariants: {
    variant: "basic",
  },
});

export type DialogWrapperVariants = VariantProps<typeof dialogWrapperVariants>;

// ─── Animation state classes ────────────────────────────────────────────────────

/**
 * Animation state variants — applied by `DialogHeadless` via `getAnimationClassName`.
 *
 * Uses composite `animate-md-*` keyframe utilities so that the correct MD3 Expressive
 * spring easing + duration are automatically encoded in the animation shorthand.
 *
 * Motion decisions per md3-motion.mdc:
 * - Basic dialog: standard-size component → `animate-md-scale-in` / `animate-md-scale-out`
 *   (expressive-fast-spatial 350ms enter; emphasized-accelerate 200ms exit)
 * - Fullscreen dialog: full-screen → `animate-md-slide-in-bottom` / `animate-md-slide-out-bottom`
 *   (standard-default-spatial 500ms enter; emphasized-accelerate 200ms exit)
 * - Enter = decelerate; Exit = accelerate (MD3 rule: enter fast→rest, exit slow→fast)
 *
 * The panel's onAnimationEnd handler advances "exiting" → "exited" so the portal is
 * removed after the exit animation completes (with a 250ms fallback timer as safety net).
 */
export const dialogAnimationVariants = cva("", {
  variants: {
    animationState: {
      // initial mount frame before the animation starts — rendered invisible
      entering: [],
      // entry animation active
      visible: [],
      // exit animation active
      exiting: [],
      // fully dismissed; portal gate will remove the element
      exited: [],
    },
    variant: {
      basic: [],
      fullscreen: [],
    },
  },
  compoundVariants: [
    // ── Basic ────────────────────────────────────────────────────────────────
    // entering: start invisible (animate-md-scale-in keyframe starts from scale(0.85)/opacity:0)
    {
      animationState: "entering",
      variant: "basic",
      className: ["opacity-0"],
    },
    // visible: composite scale-in keyframe (expressive-fast-spatial 350ms)
    {
      animationState: "visible",
      variant: "basic",
      className: ["animate-md-scale-in"],
    },
    // exiting: composite scale-out keyframe (emphasized-accelerate 200ms)
    {
      animationState: "exiting",
      variant: "basic",
      className: ["animate-md-scale-out"],
    },
    // exited: keep hidden until portal gate removes it
    {
      animationState: "exited",
      variant: "basic",
      className: ["opacity-0", "pointer-events-none"],
    },

    // ── Fullscreen ───────────────────────────────────────────────────────────
    // entering: start off-screen below (slide-in-bottom starts from translateY(100%)/opacity:0)
    {
      animationState: "entering",
      variant: "fullscreen",
      className: ["opacity-0"],
    },
    // visible: composite slide-in-bottom keyframe (standard-default-spatial 500ms)
    {
      animationState: "visible",
      variant: "fullscreen",
      className: ["animate-md-slide-in-bottom"],
    },
    // exiting: composite slide-out-bottom keyframe (emphasized-accelerate 200ms)
    {
      animationState: "exiting",
      variant: "fullscreen",
      className: ["animate-md-slide-out-bottom"],
    },
    // exited: keep hidden until portal gate removes it
    {
      animationState: "exited",
      variant: "fullscreen",
      className: ["opacity-0", "pointer-events-none"],
    },
  ],
  defaultVariants: {
    animationState: "entering",
    variant: "basic",
  },
});

export type DialogAnimationVariants = VariantProps<typeof dialogAnimationVariants>;

// ─── Hero Icon ──────────────────────────────────────────────────────────────────

/**
 * Optional hero icon slot — centered above the headline per MD3 spec.
 *
 * MD3: 24dp icon, text-secondary color, centered in the dialog.
 * When the `icon` prop is present, DialogHeadless sets `data-with-icon` on the
 * panel root so `group-data-[with-icon]/dialog:text-center` in headline/content
 * variants applies automatically.
 */
export const dialogIconVariants = cva([
  // Center the icon in the panel
  "flex",
  "items-center",
  "justify-center",
  // Bottom margin separating icon from headline
  "mb-4",
  // MD3 spec: icon color = secondary
  "text-secondary",
  // 24dp icon size (children — typically an SVG — should be 24×24)
  "size-6",
]);

export type DialogIconVariants = VariantProps<typeof dialogIconVariants>;

// ─── DialogHeadline ─────────────────────────────────────────────────────────────

/**
 * Headline element variants.
 * MD3: text-headline-small, text-on-surface.
 * Centers text when the dialog has a hero icon (`group-data-[with-icon]/dialog:text-center`).
 */
export const dialogHeadlineVariants = cva(["text-headline-small", "text-on-surface"], {
  variants: {
    variant: {
      basic: [
        "mb-4",
        // Center headline text when hero icon is present
        "group-data-[with-icon]/dialog:text-center",
      ],
      fullscreen: [
        // Top app bar row in fullscreen: flex, items-center, gap
        "flex",
        "items-center",
        "gap-4",
        "px-4",
        "h-14",
        "shrink-0",
        "border-b",
        "border-outline-variant",
      ],
    },
  },
  defaultVariants: {
    variant: "basic",
  },
});

export type DialogHeadlineVariants = VariantProps<typeof dialogHeadlineVariants>;

/**
 * Headline text inside the fullscreen top app bar row.
 */
export const dialogHeadlineTitleVariants = cva([
  "flex-1",
  "text-headline-small",
  "text-on-surface",
  "truncate",
]);

// ─── DialogContent ──────────────────────────────────────────────────────────────

/**
 * Scrollable body content variants.
 *
 * MD3: text-body-medium, text-on-surface-variant, scrollable.
 * Centers text when hero icon is present (`group-data-[with-icon]/dialog:text-center`).
 *
 * Scroll dividers: when DialogContent's scroll handler determines the content
 * is not scrolled to the top, it sets `data-scrolled-top` (which removes the
 * top divider class). Similarly `data-scrolled-bottom` for the bottom divider.
 * We use presence-based `data-*` attributes: attribute present = divider shown.
 *
 * Top divider: `border-t border-outline-variant` when `data-[scroll-divider-top]`
 * Bottom divider: `border-b border-outline-variant` when `data-[scroll-divider-bottom]`
 */
export const dialogContentVariants = cva(
  [
    "text-body-medium",
    "text-on-surface-variant",
    "overflow-y-auto",
    "flex-1",
    // Center supporting text when hero icon is present
    "group-data-[with-icon]/dialog:text-center",
    // Scroll dividers — activated by DialogContent's scroll handler
    "data-[scroll-divider-top]:border-t",
    "data-[scroll-divider-top]:border-outline-variant",
    "data-[scroll-divider-bottom]:border-b",
    "data-[scroll-divider-bottom]:border-outline-variant",
  ],
  {
    variants: {
      variant: {
        basic: ["mb-6"],
        fullscreen: ["px-6", "py-4"],
      },
    },
    defaultVariants: {
      variant: "basic",
    },
  }
);

export type DialogContentVariants = VariantProps<typeof dialogContentVariants>;

// ─── DialogActions ──────────────────────────────────────────────────────────────

/**
 * Action button row variants.
 * MD3: right-aligned flex row with gap-2, pt-3 (24dp from content bottom).
 */
export const dialogActionsVariants = cva([
  "flex",
  "items-center",
  "justify-end",
  "gap-2",
  "pt-3",
  "shrink-0",
]);

export type DialogActionsVariants = VariantProps<typeof dialogActionsVariants>;
