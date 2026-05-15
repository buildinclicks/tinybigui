import type React from "react";

/**
 * Badge color roles (Material Design 3)
 */
export type BadgeColor = "error" | "primary";

/**
 * Props for the BadgeContent indicator element.
 *
 * Renders either a small dot (no count) or a count pill (with count).
 */
export interface BadgeContentProps {
  /**
   * Numeric count to display. When omitted, renders a small dot indicator.
   */
  count?: number | undefined;

  /**
   * Maximum displayable count. Values exceeding this render as `"${max}+"`.
   * @default 999
   */
  max?: number;

  /**
   * Badge color role mapped to MD3 design tokens.
   * @default 'error'
   */
  color?: BadgeColor;

  /**
   * Whether the badge is invisible (scale-0 / opacity-0).
   * @default false
   */
  invisible?: boolean;

  /**
   * Accessible label override. Defaults to `"New"` for dot badges
   * or `"${count} notifications"` for count badges.
   */
  "aria-label"?: string | undefined;

  /**
   * Whether to skip transition animations (reduced motion).
   * @default false
   */
  reducedMotion?: boolean;

  /**
   * Additional CSS classes merged via `cn()`.
   */
  className?: string;
}

/**
 * Props for the headless Badge wrapper.
 *
 * Provides the structural `relative inline-flex` container that positions
 * the badge indicator absolutely over the host element.
 */
export interface BadgeHeadlessProps {
  /**
   * Whether the badge indicator is invisible.
   */
  invisible?: boolean;

  /**
   * Accessible label for the badge region.
   */
  "aria-label"?: string;

  /**
   * Additional CSS classes merged via `cn()`.
   */
  className?: string | undefined;

  /**
   * The host element(s) to badge — typically an icon, IconButton, or avatar.
   */
  children?: React.ReactNode;
}

/**
 * Material Design 3 Badge Component Props
 *
 * Composes `BadgeHeadless` (structure) + `BadgeContent` (indicator).
 *
 * @example
 * ```tsx
 * // Dot badge (no count)
 * <Badge>
 *   <IconButton icon={<BellIcon />} aria-label="Notifications" />
 * </Badge>
 *
 * // Count badge
 * <Badge count={3}>
 *   <IconButton icon={<BellIcon />} aria-label="Notifications" />
 * </Badge>
 *
 * // Capped count
 * <Badge count={1200} max={99}>
 *   <IconButton icon={<MailIcon />} aria-label="Messages" />
 * </Badge>
 *
 * // Primary color
 * <Badge count={5} color="primary">
 *   <IconButton icon={<BellIcon />} aria-label="Alerts" />
 * </Badge>
 * ```
 */
export interface BadgeProps {
  /**
   * Numeric count to display. When omitted, renders a dot indicator.
   */
  count?: number;

  /**
   * Maximum displayable count. Values exceeding this render as `"${max}+"`.
   * @default 999
   */
  max?: number;

  /**
   * Badge color role mapped to MD3 design tokens.
   * @default 'error'
   */
  color?: BadgeColor;

  /**
   * When `true`, hides the badge indicator.
   * Also hides when `count` is `0`.
   * @default false
   */
  invisible?: boolean;

  /**
   * Accessible label override for the badge indicator.
   */
  "aria-label"?: string;

  /**
   * Additional CSS classes merged via `cn()`.
   */
  className?: string;

  /**
   * The host element to badge — typically an icon, IconButton, or avatar.
   */
  children: React.ReactNode;
}
