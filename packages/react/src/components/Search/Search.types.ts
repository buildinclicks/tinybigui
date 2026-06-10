import type React from "react";

/**
 * Visual style of the search component.
 * - `contained`: M3 Expressive style — filled container, rounded pill shape, expressive motion.
 *   Recommended for new designs.
 * - `divided`: Baseline (original M3) style — uses a divider to separate bar from results.
 *   Does not include expressive motion or updated shapes.
 *
 * @see docs/md3-components/search/images/expressive.png
 * @see docs/md3-components/search/images/baseline.png
 */
export type SearchStyle = "contained" | "divided";

/**
 * Layout mode for the search suggestions/results container.
 * - `fullscreen`: Covers the full viewport (width: 100%, height: 100%).
 *   Shape: corner-none (no rounding) for contained; no rounding for divided.
 * - `docked`: Constrained popover (min 360dp, max 720dp width; min 240dp, max 2/3 screen height).
 *   Shape: rounded-full bar + 12dp results container (contained); 28dp extra-large container (divided).
 *
 * @see docs/md3-components/search/images/full-screen-layout.png
 * @see docs/md3-components/search/images/docked-layout.png
 */
export type SearchLayout = "fullscreen" | "docked";

/**
 * Props for the SearchBar component — the collapsed/maximized search affordance.
 *
 * The bar shows:
 * - A leading icon (default: search icon) on the left
 * - Placeholder/hinted search text in the center
 * - Optional trailing actions (icon buttons, avatar, or combinations) on the right
 *
 * When clicked/focused, the component transitions to Focused State (SearchView).
 *
 * @example
 * ```tsx
 * <SearchBar placeholder="Search messages" onFocus={() => setOpen(true)} />
 * ```
 */
export interface SearchBarProps {
  /** Controlled value of the search input */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Called when input value changes */
  onChange?: (value: string) => void;
  /** Called when the user submits the search (Enter key in Focused state) */
  onSubmit?: (value: string) => void;
  /** Called when the user clears the input (Escape key when value exists) */
  onClear?: () => void;
  /**
   * Placeholder / hinted search text. Also used as the accessibility label
   * for the input field when no explicit `aria-label` is provided.
   */
  placeholder?: string;
  /**
   * Leading icon slot. Defaults to a search icon.
   * In Focused state this is replaced by a back arrow button.
   */
  leadingIcon?: React.ReactNode;
  /**
   * Trailing action buttons (icon buttons, avatar, or combinations).
   * Supports all 4 configurations from the MD3 spec:
   * 1. Avatar only
   * 2. One trailing icon button
   * 3. Two trailing icon buttons
   * 4. One trailing icon button + avatar
   *
   * When the bar transitions to Focused state, trailing actions are replaced by a clear button.
   *
   * @see docs/md3-components/search/images/examples.png
   */
  trailingActions?: React.ReactNode[];
  /**
   * Optional avatar element for the trailing slot.
   * Rendered at 30dp size with rounded-full shape per MD3 spec.
   * When provided alongside trailingActions, renders after the action buttons.
   */
  avatar?: React.ReactNode;
  /** Disables the search bar */
  isDisabled?: boolean;
  /**
   * Accessible label for the search input. When not provided, `placeholder` is
   * used as the label per MD3 accessibility guidance (labeling-elements spec).
   */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
  /**
   * Visual style — contained (expressive) or divided (baseline).
   * @default 'contained'
   */
  searchStyle?: SearchStyle;
  /** Called when the search bar receives focus */
  onFocus?: () => void;
  /** Called when the search bar loses focus */
  onBlur?: () => void;
}

/**
 * Props for the SearchView component — the expanded/focused search experience.
 *
 * The view shows:
 * - A header with back arrow, input field, and clear button
 * - An optional divider (divided style only)
 * - A content area for suggestions/results (via children — use the List component)
 *
 * @example
 * ```tsx
 * <SearchView isOpen={isOpen} onClose={() => setOpen(false)} aria-label="Search messages">
 *   <List>{suggestions.map(s => <ListItem key={s.id} headline={s.label} />)}</List>
 * </SearchView>
 * ```
 */
export interface SearchViewProps {
  /** Whether the search view is open */
  isOpen: boolean;
  /** Called when the view should close (back arrow click or Escape key) */
  onClose: () => void;
  /** Controlled value of the search input */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Called when input value changes */
  onChange?: (value: string) => void;
  /** Called when the user submits the search (Enter key) */
  onSubmit?: (value: string) => void;
  /** Placeholder / hinted search text */
  placeholder?: string;
  /** Accessible label for the search view — required */
  "aria-label": string;
  /** Additional CSS classes */
  className?: string;
  /**
   * Suggestions and results content area.
   * Use the List component here. Screen readers automatically announce
   * list results per MD3 accessibility guidance.
   * Supports visual gaps between result groups (M3 Expressive: "Gaps can separate results into groups").
   */
  children?: React.ReactNode;
  /**
   * Visual style — contained (expressive) or divided (baseline).
   * @default 'contained'
   */
  searchStyle?: SearchStyle;
  /**
   * Layout mode — fullscreen or docked.
   * @default 'fullscreen'
   */
  layout?: SearchLayout;
  /**
   * Leading icon for the view header. Defaults to a back arrow button.
   * Clicking the back arrow calls `onClose`.
   */
  leadingIcon?: React.ReactNode;
  /**
   * Trailing action buttons displayed in the view header alongside the clear button.
   * Only rendered in Focused state.
   */
  trailingActions?: React.ReactNode[];
  /**
   * Whether to show a divider between the header and suggestions area.
   * Automatically true when searchStyle='divided'. Can be overridden.
   */
  showDivider?: boolean;
}

/**
 * Props for the compound Search component — combines SearchBar + SearchView
 * state management in one controlled/uncontrolled component.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Search placeholder="Search messages" />
 *
 * // Controlled
 * <Search isOpen={isOpen} onOpenChange={setOpen} value={query} onChange={setQuery} />
 * ```
 */
export interface SearchProps extends Omit<SearchBarProps, "onFocus"> {
  /** Whether the search view is open (controlled) */
  isOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Layout mode for the search view.
   * @default 'fullscreen'
   */
  layout?: SearchLayout;
  /**
   * Content for the suggestions/results area.
   * Rendered inside SearchView when open.
   */
  children?: React.ReactNode;
  /** Accessible label for the search view */
  viewAriaLabel?: string;
}

/** Props for SearchBarHeadless — the headless primitive for the bar */
export interface SearchBarHeadlessProps extends SearchBarProps {
  /** Ref forwarded to the form element */
  ref?: React.Ref<HTMLFormElement>;
  /**
   * Slot class names applied directly to the bar's inner elements.
   * Passed from SearchBar so per-slot CVA classes apply without descendant selectors.
   */
  inputClassName?: string | undefined;
  trailingActionsClassName?: string | undefined;
}

/** Props for SearchViewHeadless — the headless primitive for the view */
export interface SearchViewHeadlessProps extends SearchViewProps {
  /** Ref forwarded to the view container div */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Slot class names applied directly to inner headless elements.
   * Passed by SearchView so per-slot CVA classes can be applied
   * without descendant-selector blobs.
   */
  headerClassName?: string;
  backButtonClassName?: string;
  clearButtonClassName?: string;
  inputClassName?: string;
  trailingActionsClassName?: string | undefined;
  dividerClassName?: string;
  contentClassName?: string;
}
