import type React from "react";

/**
 * ButtonGroup layout variant (Material Design 3)
 *
 * - `standard`: Buttons are separate, gap shrinks/grows with interaction
 * - `connected`: Buttons are visually joined with 2dp gap; used for toggle patterns
 */
export type ButtonGroupVariant = "standard" | "connected";

/**
 * ButtonGroup size — inherited by child buttons
 *
 * Maps to MD3 button height tiers. Controls inner gap between buttons.
 */
export type ButtonGroupSize = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Corner shape applied to child buttons (Material Design 3)
 *
 * - `round`: Fully-rounded (pill) outer corners with smaller inner corners (connected variant)
 * - `square`: Uniform corner radius matching the size tier
 */
export type ButtonGroupShape = "round" | "square";

/**
 * Selection mode for toggle-button groups
 *
 * - `single`: At most one button selected at a time (deselectable)
 * - `required`: Exactly one button must always be selected (non-deselectable)
 * - `multi`: Any number of buttons may be selected simultaneously
 */
export type ButtonGroupSelectionMode = "single" | "multi" | "required";

/**
 * Value provided to child buttons via `ButtonGroupContext`
 */
export interface ButtonGroupContextValue {
  /**
   * Layout variant inherited from the parent group
   */
  variant: ButtonGroupVariant;

  /**
   * Size inherited from the parent group
   */
  size: ButtonGroupSize;

  /**
   * Shape inherited from the parent group
   */
  shape: ButtonGroupShape;

  /**
   * Selection mode inherited from the parent group.
   * `undefined` when the group is action-only (no selection).
   */
  selectionMode: ButtonGroupSelectionMode | undefined;

  /**
   * Currently selected button values.
   * Empty set when nothing is selected.
   */
  selectedValues: Set<string>;

  /**
   * Callback invoked when a child button is pressed / toggled.
   * The child passes its own `value` string.
   */
  onSelectionChange: (value: string) => void;

  /**
   * Whether the entire group is disabled.
   * When `true`, all child buttons should be non-interactive.
   *
   * @default false
   */
  isDisabled: boolean;

  /**
   * Tailwind class for the inner (adjacent) corner radius in the connected variant.
   * Applied to all four corners of every button in a connected group.
   *
   * @example 'rounded-sm' // for extra-small/small/medium sizes
   * @example 'rounded-lg' // for large size
   */
  connectedInnerRadius: string;

  /**
   * Tailwind class for the outer (exposed) corner radius in the connected variant.
   * Applied to the start-side of the first button and end-side of the last button.
   *
   * @example 'rounded-full' // for round shape
   * @example 'rounded-sm'   // for square shape + extra-small/small/medium sizes
   */
  connectedOuterRadius: string;

  /**
   * Whether child buttons should enforce a minimum width of `min-w-12` (48dp).
   * `true` only for `connected` variant at `extra-small` or `small` size — required by MD3
   * to preserve the 48dp touch target at smaller sizes.
   *
   * @default false
   */
  enforceMinWidth: boolean;
}

/**
 * Props for the `ButtonGroup` and `ButtonGroupHeadless` components.
 *
 * Material Design 3 Button Group — an invisible container that:
 * - Controls the gap between child buttons
 * - Optionally manages selection state across child toggle buttons
 * - Passes shape/variant information to children via React Context
 *
 * @example
 * ```tsx
 * // Standard icon-button group (no selection)
 * <ButtonGroup variant="standard" size="medium">
 *   <IconButton aria-label="Bluetooth"><BluetoothIcon /></IconButton>
 *   <IconButton aria-label="Alarm"><AlarmIcon /></IconButton>
 * </ButtonGroup>
 *
 * // Connected size-picker (single selection required)
 * <ButtonGroup variant="connected" selectionMode="required" defaultValue="8oz">
 *   <Button value="8oz">8 oz</Button>
 *   <Button value="12oz">12 oz</Button>
 *   <Button value="16oz">16 oz</Button>
 * </ButtonGroup>
 *
 * // Multi-select connected group (controlled)
 * <ButtonGroup
 *   variant="connected"
 *   selectionMode="multi"
 *   selectedValues={selected}
 *   onSelectionChange={setSelected}
 * >
 *   <Button value="bold">Bold</Button>
 *   <Button value="italic">Italic</Button>
 * </ButtonGroup>
 * ```
 */
export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Layout variant.
   *
   * - `standard`: floating buttons with larger gap; shape transitions on press
   * - `connected`: joined buttons with 2dp gap; only pressed button changes shape
   *
   * @default 'standard'
   */
  variant?: ButtonGroupVariant;

  /**
   * Size tier shared across all child buttons.
   * Controls inner gap values per MD3 spec.
   *
   * @default 'medium'
   */
  size?: ButtonGroupSize;

  /**
   * Corner shape for child buttons.
   *
   * - `round`: pill outer corners, smaller inner corners (connected variant)
   * - `square`: uniform corner radius matching the size tier
   *
   * @default 'round'
   */
  shape?: ButtonGroupShape;

  /**
   * Selection mode. When omitted, the group is action-only (no toggle behaviour).
   *
   * - `single`: at most one selection, deselectable
   * - `required`: exactly one must always be selected
   * - `multi`: any number selected simultaneously
   *
   * @default undefined
   */
  selectionMode?: ButtonGroupSelectionMode | undefined;

  /**
   * Controlled set of currently selected values.
   * Each child button should have a matching `value` prop.
   * Use together with `onSelectionChange` for controlled behaviour.
   *
   * @example
   * ```tsx
   * const [sel, setSel] = useState(new Set(['8oz']));
   * <ButtonGroup selectedValues={sel} onSelectionChange={(v) => setSel(v)} />
   * ```
   */
  selectedValues?: Set<string> | undefined;

  /**
   * Callback fired when the selection changes.
   * Receives the **new full Set** of selected values after the change.
   *
   * @example
   * ```tsx
   * <ButtonGroup onSelectionChange={(values) => console.log([...values])} />
   * ```
   */
  onSelectionChange?: ((values: Set<string>) => void) | undefined;

  /**
   * Default selected values for uncontrolled usage.
   * Ignored when `selectedValues` is provided.
   *
   * @default new Set()
   */
  defaultValue?: string | string[] | undefined;

  /**
   * Whether the entire group and all child buttons are disabled.
   * When `true`, the group container receives `data-disabled` and
   * all children inherit the disabled state via context.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Child buttons (Button, IconButton, or any element with a `value` prop).
   */
  children: React.ReactNode;

  /**
   * Additional Tailwind CSS classes applied to the container element.
   */
  className?: string;
}
