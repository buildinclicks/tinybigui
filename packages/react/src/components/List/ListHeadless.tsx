"use client";

import { Children, createContext, forwardRef, isValidElement, useContext, useRef } from "react";
import type React from "react";
import { useListBox, useOption } from "react-aria";
import { Item, useListState } from "react-stately";
import type { ListState } from "react-stately";
import type { ListHeadlessProps, ListItemProps } from "./List.types";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ListContextValue {
  isInteractive: true;
  state: ListState<object>;
}

const ListContext = createContext<ListContextValue | null>(null);

function useListContext(): ListContextValue | null {
  return useContext(ListContext);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts ListItemHeadless props from children so we can build the
 * React Aria `Item` collection required by `useListState`.
 */
function extractItemProps(children: React.ReactNode): ListItemProps[] {
  const items: ListItemProps[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<ListItemProps>(child)) {
      items.push(child.props);
    }
  });
  return items;
}

// ─── ListHeadless ─────────────────────────────────────────────────────────────

/**
 * Headless List container (Layer 2).
 *
 * Renders an accessible list with two operating modes:
 *
 * | Condition | Element | ARIA role |
 * |---|---|---|
 * | `selectionMode === 'none'` AND no `onAction` | `<ul>` | `list` |
 * | `selectionMode` is `'single'`/`'multiple'`, OR `onAction` given | `<ul>` | `listbox` (via `useListBox`) |
 *
 * @example
 * ```tsx
 * // Static
 * <ListHeadless aria-label="Settings">
 *   <ListItemHeadless value="wifi" headline="Wi-Fi" />
 * </ListHeadless>
 *
 * // Interactive
 * <ListHeadless aria-label="Alignment" selectionMode="single">
 *   <ListItemHeadless value="left" headline="Left" />
 * </ListHeadless>
 * ```
 */
export const ListHeadless = forwardRef<HTMLUListElement, ListHeadlessProps>(function ListHeadless(
  {
    selectionMode = "none",
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    onAction,
    className,
    children,
    ...rest
  },
  forwardedRef
) {
  const isInteractive = selectionMode !== "none" || onAction !== undefined;

  if (isInteractive) {
    return (
      <InteractiveList
        ref={forwardedRef}
        selectionMode={selectionMode}
        {...(selectedKeys !== undefined ? { selectedKeys } : {})}
        {...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {})}
        {...(onSelectionChange ? { onSelectionChange } : {})}
        {...(onAction ? { onAction } : {})}
        {...(className !== undefined ? { className } : {})}
        {...(rest["aria-label"] !== undefined ? { "aria-label": rest["aria-label"] } : {})}
        {...(rest["aria-labelledby"] !== undefined
          ? { "aria-labelledby": rest["aria-labelledby"] }
          : {})}
      >
        {children}
      </InteractiveList>
    );
  }

  return (
    <ul
      ref={forwardedRef}
      role="list"
      className={className}
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-labelledby"]}
    >
      {children}
    </ul>
  );
});

ListHeadless.displayName = "ListHeadless";

// ─── InteractiveList (internal) ───────────────────────────────────────────────

/**
 * Separated into its own component so React Aria hooks (`useListState`,
 * `useListBox`) are always called unconditionally (Rules of Hooks).
 */
const InteractiveList = forwardRef<HTMLUListElement, ListHeadlessProps>(function InteractiveList(
  {
    selectionMode = "none",
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    onAction,
    className,
    children,
    ...rest
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLUListElement>(null);
  const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLUListElement>;

  const itemProps = extractItemProps(children);

  const disabledKeys = itemProps.filter((item) => item.isDisabled).map((item) => item.value);

  const collectionChildren = itemProps.map((item) => (
    <Item key={item.value} textValue={item.headline}>
      {item.headline}
    </Item>
  ));

  const resolvedMode = selectionMode === "none" ? undefined : selectionMode;

  const state = useListState({
    children: collectionChildren,
    ...(resolvedMode !== undefined ? { selectionMode: resolvedMode } : {}),
    ...(selectedKeys !== undefined ? { selectedKeys } : {}),
    ...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {}),
    ...(onSelectionChange ? { onSelectionChange } : {}),
    ...(onAction ? { onAction } : {}),
    disabledKeys,
  });

  const ariaLabel = rest["aria-label"];
  const ariaLabelledby = rest["aria-labelledby"];

  const { listBoxProps } = useListBox(
    {
      ...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {}),
      ...(ariaLabelledby !== undefined ? { "aria-labelledby": ariaLabelledby } : {}),
      ...(resolvedMode !== undefined ? { selectionMode: resolvedMode } : {}),
      ...(selectedKeys !== undefined ? { selectedKeys } : {}),
      ...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {}),
      ...(onSelectionChange ? { onSelectionChange } : {}),
      ...(onAction ? { onAction } : {}),
      disabledKeys,
    },
    state,
    ref
  );

  return (
    <ListContext.Provider value={{ isInteractive: true, state }}>
      <ul {...listBoxProps} ref={ref} className={className}>
        {Children.map(children, (child) => {
          if (isValidElement<ListItemProps>(child)) {
            return child;
          }
          return null;
        })}
      </ul>
    </ListContext.Provider>
  );
});

InteractiveList.displayName = "InteractiveList";

// ─── ListItemHeadless ─────────────────────────────────────────────────────────

/**
 * Headless List Item (Layer 2).
 *
 * Renders an accessible list item:
 * - **Static mode**: `<li role="listitem">`, not focusable
 * - **Interactive mode**: `<li>` with `useOption` providing `role="option"`,
 *   `aria-selected`, `aria-disabled`, and keyboard interaction
 *
 * @example
 * ```tsx
 * <ListItemHeadless value="wifi" headline="Wi-Fi" supportingText="Connected" />
 * ```
 */
export const ListItemHeadless = forwardRef<HTMLLIElement, ListItemProps>(function ListItemHeadless(
  { value, headline, supportingText, overline, className },
  forwardedRef
) {
  const ctx = useListContext();

  if (ctx) {
    return (
      <InteractiveListItem
        ref={forwardedRef}
        value={value}
        headline={headline}
        {...(supportingText !== undefined ? { supportingText } : {})}
        {...(overline !== undefined ? { overline } : {})}
        {...(className !== undefined ? { className } : {})}
        state={ctx.state}
      />
    );
  }

  return (
    <li ref={forwardedRef} role="listitem" className={className}>
      {overline && <span>{overline}</span>}
      <span>{headline}</span>
      {supportingText && <span>{supportingText}</span>}
    </li>
  );
});

ListItemHeadless.displayName = "ListItemHeadless";

// ─── InteractiveListItem (internal) ───────────────────────────────────────────

interface InteractiveListItemInternalProps {
  value: string | number;
  headline: string;
  supportingText?: string;
  overline?: string;
  className?: string;
  state: ListState<object>;
}

const InteractiveListItem = forwardRef<HTMLLIElement, InteractiveListItemInternalProps>(
  function InteractiveListItem(
    { value, headline, supportingText, overline, className, state },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLLIElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLLIElement>;

    const { optionProps, isSelected, isDisabled } = useOption({ key: value }, state, ref);

    return (
      <li
        {...optionProps}
        ref={ref}
        className={className}
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
      >
        {overline && <span>{overline}</span>}
        <span>{headline}</span>
        {supportingText && <span>{supportingText}</span>}
      </li>
    );
  }
);

InteractiveListItem.displayName = "InteractiveListItem";
