import type { ReactNode } from "react";
import type { AriaButtonProps, PressEvent } from "react-aria";

// ─── CardVariant ──────────────────────────────────────────────────────────────

/**
 * Visual variant for the MD3 Card component.
 *
 * - `elevated` — Drop shadow providing separation from the background.
 *   Background: `surface-container-low`, elevation: 1dp.
 *
 * - `filled` — Subtle fill with no shadow. Background: `surface-container-highest`.
 *   Lower emphasis than elevated or outlined.
 *
 * - `outlined` — Visual boundary via `outline-variant` border. No shadow.
 *   Greater emphasis than filled.
 *
 * @default 'elevated'
 */
export type CardVariant = "elevated" | "filled" | "outlined";

// ─── CardProps ────────────────────────────────────────────────────────────────

/**
 * Props for the MD3 styled `Card` component (Layer 3).
 *
 * When `onPress` or `href` is provided the card becomes interactive:
 * it receives `role="button"`, keyboard activation (Enter/Space), and
 * a focus ring via `useFocusRing`. Without either prop the card renders
 * as a static `role="article"` container.
 *
 * @example
 * ```tsx
 * // Static card (informational)
 * <Card variant="outlined">
 *   <CardHeader headline="Title" subheader="Subtitle" />
 *   <CardContent>Body text goes here.</CardContent>
 * </Card>
 *
 * // Interactive card (navigable / clickable)
 * <Card
 *   variant="elevated"
 *   onPress={() => router.push('/details')}
 *   aria-label="View product details"
 * >
 *   <CardHeader headline="Product" />
 * </Card>
 * ```
 */
export interface CardProps {
  /**
   * Visual variant of the card.
   * @default 'elevated'
   */
  variant?: CardVariant;

  /**
   * Press handler — makes the card interactive (`role="button"`).
   */
  onPress?: (e: PressEvent) => void;

  /**
   * Navigation href — makes the card interactive as a link.
   */
  href?: string;

  /**
   * Accessible label. Required when the card has no visible headline text.
   */
  "aria-label"?: string;

  /**
   * When `true`, applies the MD3 dragged elevation state.
   * @default false
   */
  isDraggable?: boolean;

  /**
   * Disables the interactive card; ignored for static cards.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Additional CSS classes merged onto the root element.
   */
  className?: string;

  /**
   * Card slot content — `CardMedia`, `CardHeader`, `CardContent`, `CardActions`.
   */
  children?: ReactNode;
}

// ─── CardHeadlessProps ────────────────────────────────────────────────────────

/**
 * Props for the `CardHeadless` primitive (Layer 2).
 *
 * Extends `AriaButtonProps` to gain `onPress`, `href`, `isDisabled`, and all
 * React Aria press/keyboard interaction props. When none of the interactive
 * props are present the component renders as a plain `role="article"` div.
 *
 * @example
 * ```tsx
 * // Interactive headless card
 * <CardHeadless
 *   onPress={handlePress}
 *   aria-label="Open details"
 *   className={cardVariants({ variant })}
 * >
 *   {children}
 * </CardHeadless>
 *
 * // Static headless card
 * <CardHeadless className={cardVariants({ variant })}>
 *   {children}
 * </CardHeadless>
 * ```
 */
export interface CardHeadlessProps extends AriaButtonProps {
  /**
   * Additional CSS classes merged onto the root div element.
   */
  className?: string;

  /**
   * Card content.
   */
  children?: ReactNode;
}

// ─── CardMediaProps ───────────────────────────────────────────────────────────

/**
 * Props for the `CardMedia` sub-component.
 *
 * Renders a responsive image slot at the top of the card per MD3 spec.
 * Implemented in M06.
 *
 * @example
 * ```tsx
 * <CardMedia
 *   src="/images/preview.jpg"
 *   alt="Product preview"
 *   aspectRatio="16/9"
 * />
 * ```
 */
export interface CardMediaProps {
  /**
   * Image source URL.
   */
  src: string;

  /**
   * Descriptive alt text for the image (required for accessibility).
   */
  alt: string;

  /**
   * Aspect ratio of the media container.
   * @default 'auto'
   */
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";

  /**
   * Additional CSS classes merged onto the media container.
   */
  className?: string;
}

// ─── CardHeaderProps ──────────────────────────────────────────────────────────

/**
 * Props for the `CardHeader` sub-component.
 *
 * Renders the card headline and optional subheader per MD3 spec.
 * Implemented in M06.
 *
 * @example
 * ```tsx
 * <CardHeader headline="Card title" subheader="Supporting text" />
 * ```
 */
export interface CardHeaderProps {
  /**
   * Primary headline text (required).
   */
  headline: string;

  /**
   * Optional secondary subheader text below the headline.
   */
  subheader?: string;

  /**
   * Additional CSS classes merged onto the header container.
   */
  className?: string;
}

// ─── CardContentProps ─────────────────────────────────────────────────────────

/**
 * Props for the `CardContent` sub-component.
 *
 * Renders the main body area of the card. Implemented in M06.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Supporting text about the card content.</p>
 * </CardContent>
 * ```
 */
export interface CardContentProps {
  /**
   * Additional CSS classes merged onto the content container.
   */
  className?: string;

  /**
   * Content elements.
   */
  children: ReactNode;
}

// ─── CardActionsProps ─────────────────────────────────────────────────────────

/**
 * Props for the `CardActions` sub-component.
 *
 * Renders a row of action buttons at the bottom of the card per MD3 spec.
 * Typically contains `Button` components. Implemented in M06.
 *
 * @example
 * ```tsx
 * <CardActions>
 *   <Button variant="text" onPress={onCancel}>Cancel</Button>
 *   <Button variant="filled" onPress={onConfirm}>Confirm</Button>
 * </CardActions>
 * ```
 */
export interface CardActionsProps {
  /**
   * Additional CSS classes merged onto the actions container.
   */
  className?: string;

  /**
   * Action elements — typically `Button` components.
   */
  children: ReactNode;
}
