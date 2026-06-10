import type React from "react";
import type { Key, Selection, SelectionMode } from "react-stately";

/**
 * Visual density based on content lines (MD3 List)
 *
 * - `one-line`: headline only (56dp min-height)
 * - `two-line`: headline + supporting text (72dp min-height)
 * - `three-line`: overline + headline + supporting text (88dp min-height)
 */
export type ListDensity = "one-line" | "two-line" | "three-line";

/**
 * Leading slot content type
 */
export type ListLeadingType = "icon" | "avatar" | "checkbox" | "radio";

/**
 * Trailing slot content type
 */
export type ListTrailingType = "icon" | "checkbox" | "radio" | "text";

/**
 * MD3 List container props.
 *
 * Supports two modes:
 * - **Static**: `selectionMode="none"` (default) and no `onAction` → `role="list"`
 * - **Interactive**: `selectionMode` is `"single"` or `"multiple"`, or `onAction` provided → `role="listbox"`
 *
 * @example
 * ```tsx
 * // Static list
 * <ListHeadless aria-label="Settings">
 *   <ListItemHeadless value="wifi" headline="Wi-Fi" />
 *   <ListItemHeadless value="bt" headline="Bluetooth" />
 * </ListHeadless>
 *
 * // Interactive single-select list
 * <ListHeadless
 *   aria-label="Alignment"
 *   selectionMode="single"
 *   onSelectionChange={setSelection}
 * >
 *   <ListItemHeadless value="left" headline="Left" />
 *   <ListItemHeadless value="center" headline="Center" />
 *   <ListItemHeadless value="right" headline="Right" />
 * </ListHeadless>
 * ```
 */
export interface ListProps {
  /**
   * Selection mode.
   * @default 'none'
   */
  selectionMode?: SelectionMode;

  /** Controlled selected keys */
  selectedKeys?: Selection;

  /** Initial selected keys (uncontrolled) */
  defaultSelectedKeys?: Iterable<Key>;

  /** Called when the selection changes */
  onSelectionChange?: (keys: Selection) => void;

  /** Per-item action callback (triggered on click or Enter/Space) */
  onAction?: (key: Key) => void;

  /** Render a Divider between items */
  showDividers?: boolean;

  /** Accessible label for the list */
  "aria-label"?: string;

  /** ID of the element that labels this list */
  "aria-labelledby"?: string;

  /** Additional CSS classes */
  className?: string;

  /** ListItem children */
  children: React.ReactNode;
}

/**
 * MD3 List Item props.
 *
 * Each item requires a unique `value` used as the collection key.
 *
 * @example
 * ```tsx
 * <ListItemHeadless
 *   value="wifi"
 *   headline="Wi-Fi"
 *   supportingText="Connected to Home Network"
 * />
 * ```
 */
export interface ListItemProps {
  /** Unique key for selection tracking */
  value: string | number;

  /** Primary text content */
  headline: string;

  /**
   * Secondary text below the headline.
   * When present, density becomes two-line.
   */
  supportingText?: string;

  /**
   * Overline text above the headline.
   * Three-line density requires overline OR long supporting text.
   */
  overline?: string;

  /** Content rendered in the leading slot */
  leadingSlot?: React.ReactNode;

  /** Semantic type of the leading content */
  leadingType?: ListLeadingType;

  /** Content rendered in the trailing slot */
  trailingSlot?: React.ReactNode;

  /** Semantic type of the trailing content */
  trailingType?: ListTrailingType;

  /** Whether this item is disabled */
  isDisabled?: boolean;

  /** Render an inset Divider at the bottom of this item */
  insetDivider?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for the ListItem leading slot
 */
export interface ListItemLeadingProps {
  /** Semantic content type */
  type: ListLeadingType;

  /** Additional CSS classes */
  className?: string;

  /** Slot content */
  children: React.ReactNode;
}

/**
 * Props for the ListItem trailing slot
 */
export interface ListItemTrailingProps {
  /** Semantic content type */
  type: ListTrailingType;

  /** Additional CSS classes */
  className?: string;

  /** Slot content */
  children: React.ReactNode;
}

/**
 * Props for the ListItem text area
 */
export interface ListItemTextProps {
  /** Primary text */
  headline: string;

  /** Secondary text */
  supportingText?: string;

  /** Overline text */
  overline?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Headless List container props — identical to ListProps for the foundation layer.
 */
export type ListHeadlessProps = ListProps;
