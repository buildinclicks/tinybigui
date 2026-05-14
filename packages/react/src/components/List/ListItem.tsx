"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useOption } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import type { ListState } from "react-stately";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { Divider } from "../Divider";
import { listItemVariants } from "./List.variants";
import { ListItemLeading } from "./ListItemLeading";
import { ListItemTrailing } from "./ListItemTrailing";
import { ListItemText } from "./ListItemText";
import { useListContext } from "./ListHeadless";
import type { ListDensity, ListItemProps } from "./List.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDensity(overline?: string, supportingText?: string): ListDensity {
  if (overline) return "three-line";
  if (supportingText) return "two-line";
  return "one-line";
}

// ─── ListItem (Layer 3: Styled) ───────────────────────────────────────────────

/**
 * Material Design 3 List Item (Layer 3: Styled)
 *
 * Renders an accessible list item with MD3 visual treatment:
 * state layer, ripple, density-driven height, and slot-based layout.
 *
 * - **Interactive mode** (inside a `List` with `selectionMode` or `onAction`):
 *   uses `useOption` for ARIA semantics, renders state layer + ripple.
 * - **Static mode**: renders `<li role="listitem">` without interactive
 *   affordances.
 *
 * Density is auto-derived from content:
 * - one-line (56dp) — headline only
 * - two-line (72dp) — headline + supportingText
 * - three-line (88dp) — overline present
 */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  {
    value,
    headline,
    supportingText,
    overline,
    leadingSlot,
    leadingType,
    trailingSlot,
    trailingType,
    isDisabled = false,
    insetDivider = false,
    className,
  },
  forwardedRef
) {
  const ctx = useListContext();
  const density = getDensity(overline, supportingText);

  if (ctx) {
    return (
      <InteractiveStyledListItem
        ref={forwardedRef}
        value={value}
        headline={headline}
        {...(supportingText !== undefined ? { supportingText } : {})}
        {...(overline !== undefined ? { overline } : {})}
        {...(leadingSlot !== undefined ? { leadingSlot } : {})}
        {...(leadingType !== undefined ? { leadingType } : {})}
        {...(trailingSlot !== undefined ? { trailingSlot } : {})}
        {...(trailingType !== undefined ? { trailingType } : {})}
        density={density}
        insetDivider={insetDivider}
        {...(className !== undefined ? { className } : {})}
        state={ctx.state}
      />
    );
  }

  return (
    <li
      ref={forwardedRef}
      role="listitem"
      className={cn(
        listItemVariants({
          density,
          isSelected: false,
          isDisabled,
          isInteractive: false,
        }),
        className
      )}
    >
      {leadingSlot && <ListItemLeading type={leadingType ?? "icon"}>{leadingSlot}</ListItemLeading>}
      <ListItemText
        headline={headline}
        {...(supportingText !== undefined ? { supportingText } : {})}
        {...(overline !== undefined ? { overline } : {})}
      />
      {trailingSlot && (
        <ListItemTrailing type={trailingType ?? "icon"}>{trailingSlot}</ListItemTrailing>
      )}
      {insetDivider && (
        <Divider
          orientation="horizontal"
          inset="start"
          className="absolute right-0 bottom-0 left-0"
        />
      )}
    </li>
  );
});

ListItem.displayName = "ListItem";

// ─── InteractiveStyledListItem (internal) ─────────────────────────────────────

interface InteractiveStyledListItemInternalProps {
  value: string | number;
  headline: string;
  supportingText?: string;
  overline?: string;
  leadingSlot?: React.ReactNode;
  leadingType?: ListItemProps["leadingType"];
  trailingSlot?: React.ReactNode;
  trailingType?: ListItemProps["trailingType"];
  density: ListDensity;
  insetDivider: boolean;
  className?: string;
  state: ListState<object>;
}

/**
 * Internal interactive list item — separated so `useOption` is always
 * called unconditionally (Rules of Hooks).
 */
const InteractiveStyledListItem = forwardRef<HTMLLIElement, InteractiveStyledListItemInternalProps>(
  function InteractiveStyledListItem(
    {
      value,
      headline,
      supportingText,
      overline,
      leadingSlot,
      leadingType,
      trailingSlot,
      trailingType,
      density,
      insetDivider,
      className,
      state,
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLLIElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLLIElement>;

    const { optionProps, isSelected, isDisabled } = useOption({ key: value }, state, ref);

    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled,
    });

    const mergedProps = mergeProps(optionProps, { onMouseDown: handleRipple });

    return (
      <li
        {...mergedProps}
        ref={ref}
        className={cn(
          listItemVariants({
            density,
            isSelected,
            isDisabled,
            isInteractive: true,
          }),
          className
        )}
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
      >
        <div
          aria-hidden="true"
          className="bg-on-surface pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-8"
        />
        {ripples}

        {leadingSlot && (
          <ListItemLeading type={leadingType ?? "icon"}>{leadingSlot}</ListItemLeading>
        )}
        <ListItemText
          headline={headline}
          {...(supportingText !== undefined ? { supportingText } : {})}
          {...(overline !== undefined ? { overline } : {})}
        />
        {trailingSlot && (
          <ListItemTrailing type={trailingType ?? "icon"}>{trailingSlot}</ListItemTrailing>
        )}
        {insetDivider && (
          <Divider
            orientation="horizontal"
            inset="start"
            className="absolute right-0 bottom-0 left-0"
          />
        )}
      </li>
    );
  }
);

InteractiveStyledListItem.displayName = "InteractiveStyledListItem";
