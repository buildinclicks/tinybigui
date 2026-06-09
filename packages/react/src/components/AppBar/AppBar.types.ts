import type React from "react";

/**
 * MD3 Top App Bar size variants
 *
 * Each variant differs in height, title alignment, and type scale.
 * - `small`: 64dp height, title left-aligned, title-large type scale
 * - `center-aligned`: 64dp height, title centered, title-large type scale
 * - `medium`: min 112dp height, title bottom-left, headline-medium type scale
 * - `large`: min 120dp height, title bottom-left, display-small type scale
 *
 * Medium and large grow vertically when a subtitle is present.
 *
 * @see https://m3.material.io/components/top-app-bar/specs
 */
export type AppBarVariant = "small" | "center-aligned" | "medium" | "large";

/**
 * Material Design 3 Top App Bar Component Props
 *
 * Provides a top app bar with navigation icon, title, and trailing action icon slots.
 * Supports scroll-triggered elevation changes with both controlled and uncontrolled modes.
 *
 * **Usage:**
 * - Pass existing `<IconButton>` components into `navigationIcon` and `actions` slots
 * - No hardcoded slot components — fully composable API
 *
 * @example
 * ```tsx
 * // Small variant with navigation icon and actions
 * <AppBar
 *   title="Page Title"
 *   navigationIcon={
 *     <IconButton aria-label="Open navigation">
 *       <MenuIcon />
 *     </IconButton>
 *   }
 *   actions={
 *     <IconButton aria-label="Search">
 *       <SearchIcon />
 *     </IconButton>
 *   }
 * />
 *
 * // Center-aligned with controlled scroll state
 * <AppBar
 *   variant="center-aligned"
 *   title="My App"
 *   scrolled={isScrolled}
 *   onScrollStateChange={setIsScrolled}
 * />
 *
 * // Large variant for hero/expanded layouts
 * <AppBar
 *   variant="large"
 *   title="Article Title"
 * />
 * ```
 */
export interface AppBarProps {
  /**
   * Size variant of the Top App Bar
   * Controls height, title position, and type scale
   * @default 'small'
   */
  variant?: AppBarVariant;

  /**
   * The title content. Accepts a string or any React node.
   * Typography scale is automatically applied based on `variant`.
   */
  title: React.ReactNode;

  /**
   * Optional subtitle content rendered below the title.
   * Typography scale and color are automatically applied based on `variant`:
   * - `small` / `center-aligned`: title-medium, on-surface-variant
   * - `medium`: title-large, on-surface
   * - `large`: headline-small, on-surface
   *
   * @example
   * ```tsx
   * <AppBar
   *   title="Settings"
   *   subtitle="Account preferences"
   *   variant="medium"
   * />
   * ```
   */
  subtitle?: React.ReactNode;

  /**
   * Navigation icon slot (leading position, optional).
   * Expects a React node — typically an `<IconButton>` with `aria-label`.
   *
   * **Accessibility:** Per MD3 spec, focus should initially land on this element
   * since it is the first interactive element in the app bar. The `aria-label`
   * must clearly describe the action (e.g. "Open navigation menu", "Go back").
   *
   * @example
   * ```tsx
   * navigationIcon={
   *   <IconButton aria-label="Open navigation menu">
   *     <MenuIcon />
   *   </IconButton>
   * }
   * ```
   */
  navigationIcon?: React.ReactNode;

  /**
   * Trailing action icon slots (up to 3, optional).
   * Expects one or more React nodes — typically `<IconButton>` components.
   *
   * @example
   * ```tsx
   * actions={
   *   <>
   *     <IconButton aria-label="Search"><SearchIcon /></IconButton>
   *     <IconButton aria-label="More options"><MoreIcon /></IconButton>
   *   </>
   * }
   * ```
   */
  actions?: React.ReactNode;

  /**
   * Controlled scroll state.
   * When provided, the component operates in controlled mode — the consumer
   * is responsible for managing this value.
   * When `undefined`, internal scroll detection is used (uncontrolled mode).
   *
   * - `false` (default): flat surface — `bg-surface`, `shadow-elevation-0`
   * - `true`: on-scroll surface — `bg-surface-container`, `shadow-elevation-2`
   */
  scrolled?: boolean;

  /**
   * Callback fired when the scroll elevation state changes.
   * In uncontrolled mode, this fires when the user scrolls past the threshold.
   * In controlled mode, this is an informational callback — the consumer
   * decides whether to update `scrolled`.
   *
   * @param scrolled - The new scroll state
   */
  onScrollStateChange?: (scrolled: boolean) => void;

  /**
   * Additional CSS classes to merge onto the root `<header>` element.
   * Uses Tailwind CSS — conflicting classes are resolved by `cn()`.
   */
  className?: string;
}

/**
 * AppBarHeadless Component Props
 *
 * Unstyled primitive for the Top App Bar.
 * Renders a `<header role="banner">` and manages scroll elevation state.
 * Use this for full visual control when the styled `AppBar` is not sufficient.
 *
 * Extends `React.HTMLAttributes<HTMLElement>` so all standard HTML attributes
 * (including `data-*` attributes) are forwarded to the underlying `<header>`.
 *
 * @example
 * ```tsx
 * <AppBarHeadless
 *   className="my-custom-appbar"
 *   scrolled={scrolled}
 *   onScrollStateChange={setScrolled}
 * >
 *   <div>My custom layout</div>
 * </AppBarHeadless>
 * ```
 */
export interface AppBarHeadlessProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content to render inside the header
   */
  children: React.ReactNode;

  /**
   * Controlled scroll state.
   * When `undefined`, the component uses internal scroll detection.
   */
  scrolled?: boolean;

  /**
   * Callback fired when scroll state changes
   */
  onScrollStateChange?: (scrolled: boolean) => void;
}
