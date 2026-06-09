"use client";

import { forwardRef, useRef } from "react";
import { useButton, useToggleButton } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import { useToggleState } from "react-stately";
import type { ChipHeadlessProps } from "./Chip.types";

// ---------------------------------------------------------------------------
// Internal sub-implementations
//
// Each chip type has distinct React Aria hook requirements. Hooks cannot be
// called conditionally, so we use separate forwardRef components per type and
// select the correct one in the public ChipHeadless switcher below.
//
// The styled layer (Chip.tsx) injects interaction data attributes and event
// handlers via `bodyPassthrough` (and `removePassthrough` for input chips).
// These are spread onto the DOM element after React Aria's props so they do
// not get stripped by the React Aria hooks' internal prop filtering.
// ---------------------------------------------------------------------------

/**
 * Strip React Aria-specific props that must not reach the DOM.
 * Returns only HTML-safe passthrough properties.
 */
function stripAriaProps(handlers: Record<string, unknown>): Record<string, unknown> {
  const {
    isDisabled: _isDisabled,
    onPress: _onPress,
    onPressStart: _onPressStart,
    onPressEnd: _onPressEnd,
    onPressChange: _onPressChange,
    onPressUp: _onPressUp,
    ...html
  } = handlers;
  return html;
}

/**
 * Build press lifecycle callbacks for useButton/useToggleButton.
 * Uses conditional spreading to satisfy exactOptionalPropertyTypes: true —
 * React Aria's onPressStart/onPressEnd must be a function, not undefined.
 */
function buildPressCallbacks(
  onPressStart?: () => void,
  onPressEnd?: () => void
): {
  onPressStart?: () => void;
  onPressEnd?: () => void;
} {
  return {
    ...(onPressStart !== undefined && { onPressStart }),
    ...(onPressEnd !== undefined && { onPressEnd }),
  };
}

/**
 * Assist chip implementation — uses `useButton` (Enter/Space → onPress).
 */
const AssistChipImpl = forwardRef<HTMLButtonElement, ChipHeadlessProps>(
  (
    { label, onPress, isDisabled, className, onMouseDown, children, bodyPassthrough },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    const { buttonProps } = useButton(
      {
        ...(onPress !== undefined && { onPress }),
        ...(isDisabled !== undefined && { isDisabled }),
        ...buildPressCallbacks(bodyPassthrough?.onPressStart, bodyPassthrough?.onPressEnd),
      },
      ref
    );

    const htmlPassthrough = stripAriaProps(bodyPassthrough?.eventHandlers ?? {});

    const mergedProps = mergeProps(
      buttonProps,
      { onMouseDown },
      bodyPassthrough?.dataAttributes ?? {},
      htmlPassthrough
    );

    return (
      <button {...mergedProps} type="button" ref={ref} className={className}>
        {children ?? label}
      </button>
    );
  }
);
AssistChipImpl.displayName = "AssistChipImpl";

/**
 * Filter chip implementation — uses `useToggleButton` + `useToggleState`.
 * Provides `aria-pressed` for toggle semantics.
 */
const FilterChipImpl = forwardRef<HTMLButtonElement, ChipHeadlessProps>(
  (
    {
      label,
      selected,
      defaultSelected,
      onSelectionChange,
      isDisabled,
      className,
      onMouseDown,
      children,
      bodyPassthrough,
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    const toggleProps = {
      ...(selected !== undefined && { isSelected: selected }),
      ...(defaultSelected !== undefined && { defaultSelected }),
      ...(onSelectionChange !== undefined && { onChange: onSelectionChange }),
      ...(isDisabled !== undefined && { isDisabled }),
      ...buildPressCallbacks(bodyPassthrough?.onPressStart, bodyPassthrough?.onPressEnd),
    };

    const state = useToggleState(toggleProps);
    const { buttonProps } = useToggleButton(toggleProps, state, ref);

    const htmlPassthrough = stripAriaProps(bodyPassthrough?.eventHandlers ?? {});

    const mergedProps = mergeProps(
      buttonProps,
      { onMouseDown },
      bodyPassthrough?.dataAttributes ?? {},
      htmlPassthrough
    );

    return (
      <button {...mergedProps} type="button" ref={ref} className={className}>
        {children ?? label}
      </button>
    );
  }
);
FilterChipImpl.displayName = "FilterChipImpl";

/**
 * Input chip implementation — chip body uses `useButton` with Backspace/Delete
 * handling for keyboard removal. The remove button is a separate `useButton`
 * instance inside the same layout wrapper.
 *
 * The forwarded ref attaches to the chip body button (the primary interactive
 * element), not the outer `<span>` wrapper.
 */
const InputChipImpl = forwardRef<HTMLButtonElement, ChipHeadlessProps>(
  (
    {
      label,
      onRemove,
      isDisabled,
      className,
      onMouseDown,
      removeIcon,
      removeButtonClassName,
      children,
      bodyPassthrough,
      removePassthrough,
    },
    forwardedRef
  ) => {
    const chipRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? chipRef) as React.RefObject<HTMLButtonElement>;
    const removeRef = useRef<HTMLButtonElement>(null);

    const { buttonProps: chipButtonProps } = useButton(
      {
        "aria-label": label,
        ...(isDisabled !== undefined && { isDisabled }),
        ...buildPressCallbacks(bodyPassthrough?.onPressStart, bodyPassthrough?.onPressEnd),
      },
      ref
    );

    const { buttonProps: removeButtonProps } = useButton(
      {
        "aria-label": `Remove ${label}`,
        onPress: () => onRemove?.(),
        ...(isDisabled !== undefined && { isDisabled }),
        ...buildPressCallbacks(removePassthrough?.onPressStart, removePassthrough?.onPressEnd),
      },
      removeRef
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        onRemove?.();
      }
    };

    const htmlBodyPassthrough = stripAriaProps(bodyPassthrough?.eventHandlers ?? {});
    const htmlRemovePassthrough = stripAriaProps(removePassthrough?.eventHandlers ?? {});

    const mergedChipProps = mergeProps(
      chipButtonProps,
      { onKeyDown: handleKeyDown, onMouseDown },
      bodyPassthrough?.dataAttributes ?? {},
      htmlBodyPassthrough
    );

    const mergedRemoveProps = mergeProps(
      removeButtonProps,
      removePassthrough?.dataAttributes ?? {},
      htmlRemovePassthrough
    );

    return (
      <span className={className}>
        <button {...mergedChipProps} type="button" ref={ref}>
          {children ?? label}
        </button>
        <button
          {...mergedRemoveProps}
          type="button"
          ref={removeRef}
          className={removeButtonClassName}
        >
          {removeIcon}
        </button>
      </span>
    );
  }
);
InputChipImpl.displayName = "InputChipImpl";

/**
 * Suggestion chip implementation — uses `useButton` (identical to Assist).
 */
const SuggestionChipImpl = forwardRef<HTMLButtonElement, ChipHeadlessProps>(
  (
    { label, onPress, isDisabled, className, onMouseDown, children, bodyPassthrough },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    const { buttonProps } = useButton(
      {
        ...(onPress !== undefined && { onPress }),
        ...(isDisabled !== undefined && { isDisabled }),
        ...buildPressCallbacks(bodyPassthrough?.onPressStart, bodyPassthrough?.onPressEnd),
      },
      ref
    );

    const htmlPassthrough = stripAriaProps(bodyPassthrough?.eventHandlers ?? {});

    const mergedProps = mergeProps(
      buttonProps,
      { onMouseDown },
      bodyPassthrough?.dataAttributes ?? {},
      htmlPassthrough
    );

    return (
      <button {...mergedProps} type="button" ref={ref} className={className}>
        {children ?? label}
      </button>
    );
  }
);
SuggestionChipImpl.displayName = "SuggestionChipImpl";

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

/**
 * Headless Chip Component (Layer 2)
 *
 * Unstyled chip primitive covering all four MD3 chip types. Delegates to the
 * correct React Aria hook per `type` — bring your own styles.
 *
 * The styled layer (Chip.tsx) passes `bodyPassthrough` to inject data-* interaction
 * attributes and merged hover/focus handlers onto the body button, enabling the
 * group-data-[x]/chip slot selectors defined in Chip.variants.ts.
 *
 * | type         | Hook                                    | Key behaviour                    |
 * |------------- |-----------------------------------------|----------------------------------|
 * | `assist`     | `useButton`                             | Enter/Space → `onPress`          |
 * | `filter`     | `useToggleButton` + `useToggleState`    | Toggle `aria-pressed`            |
 * | `input`      | `useButton` + remove `useButton`        | Backspace/Delete → `onRemove`    |
 * | `suggestion` | `useButton`                             | Enter/Space → `onPress`          |
 *
 * @example
 * ```tsx
 * // Assist
 * <ChipHeadless type="assist" label="Set alarm" onPress={handlePress} />
 *
 * // Filter (uncontrolled)
 * <ChipHeadless type="filter" label="Vegetarian" onSelectionChange={console.log} />
 *
 * // Input
 * <ChipHeadless type="input" label="React" onRemove={() => remove('React')} />
 *
 * // Suggestion
 * <ChipHeadless type="suggestion" label="See photos" onPress={handlePress} />
 * ```
 */
export const ChipHeadless = forwardRef<HTMLButtonElement, ChipHeadlessProps>((props, ref) => {
  switch (props.type) {
    case "filter":
      return <FilterChipImpl {...props} ref={ref} />;
    case "input":
      return <InputChipImpl {...props} ref={ref} />;
    case "suggestion":
      return <SuggestionChipImpl {...props} ref={ref} />;
    default:
      return <AssistChipImpl {...props} ref={ref} />;
  }
});

ChipHeadless.displayName = "ChipHeadless";
