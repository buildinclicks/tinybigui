/**
 * Interaction States Utility
 *
 * Shared helper for converting React Aria interaction/selection state booleans
 * into presence-based `data-*` attributes for `group-data-[x]/<name>` Tailwind
 * CSS selectors.
 *
 * This covers **interaction and selection states only**. Content flags such as
 * `data-with-icon` or `data-with-label` describe structural composition and
 * must be set explicitly by the component — never via this helper.
 *
 * @example
 * ```tsx
 * const { isHovered, hoverProps } = useHover({ isDisabled })
 * const { isFocusVisible, focusProps } = useFocusRing()
 *
 * <label
 *   className="group/switch"
 *   {...mergeProps(labelProps, hoverProps, focusProps)}
 *   {...getInteractionDataAttributes({ isHovered, isFocusVisible, isSelected, isDisabled })}
 *   data-with-icon={(!!icon) ? "" : undefined}
 * />
 * ```
 */

/**
 * Subset of React Aria interaction states that map to `data-*` attributes.
 * All fields are optional — omit states not relevant to a given component.
 */
export interface InteractionStates {
  /**
   * Pointer is hovering over the component.
   * Source: `useHover` → `isHovered`
   */
  isHovered?: boolean;
  /**
   * Keyboard or programmatic focus is visible (not pointer-initiated).
   * Source: `useFocusRing` → `isFocusVisible`
   */
  isFocusVisible?: boolean;
  /**
   * Component is actively being pressed.
   * Source: React Aria interaction → `isPressed`
   */
  isPressed?: boolean;
  /**
   * Component is in the ON / checked / active selection state.
   * Source: toggle/select state → `isSelected`
   */
  isSelected?: boolean;
  /**
   * Component is non-interactive.
   * Source: `isDisabled` prop
   */
  isDisabled?: boolean;
  /**
   * Component value cannot be changed.
   * Source: `isReadOnly` prop
   */
  isReadOnly?: boolean;
  /**
   * Component value fails validation.
   * Source: `isInvalid` prop
   */
  isInvalid?: boolean;
  /**
   * Component is partially selected (checkbox indeterminate state).
   * Source: `isIndeterminate` prop
   */
  isIndeterminate?: boolean;
}

/**
 * Converts interaction/selection states into presence-based `data-*` attributes.
 *
 * Attributes are set to `""` (present) when true and `undefined` (absent) when
 * false/undefined, so Tailwind `data-[x]` and `group-data-[x]/<name>` selectors
 * match purely on attribute presence — no value comparison needed.
 *
 * Uses explicit ternaries (`s.isHovered ? "" : undefined`) rather than
 * `s.isHovered || undefined` to avoid incorrect attribute removal on falsy
 * non-boolean values.
 *
 * @param s - The component's current interaction/selection state
 * @returns A record of `data-*` attribute names to `""` or `undefined`
 *
 * @example
 * ```tsx
 * <label
 *   className="group/switch"
 *   {...getInteractionDataAttributes({ isHovered, isFocusVisible, isSelected, isDisabled })}
 * />
 * ```
 */
export function getInteractionDataAttributes(s: InteractionStates): Record<string, "" | undefined> {
  return {
    "data-hovered": s.isHovered ? "" : undefined,
    "data-focus-visible": s.isFocusVisible ? "" : undefined,
    "data-pressed": s.isPressed ? "" : undefined,
    "data-selected": s.isSelected ? "" : undefined,
    "data-disabled": s.isDisabled ? "" : undefined,
    "data-readonly": s.isReadOnly ? "" : undefined,
    "data-invalid": s.isInvalid ? "" : undefined,
    "data-indeterminate": s.isIndeterminate ? "" : undefined,
  };
}
