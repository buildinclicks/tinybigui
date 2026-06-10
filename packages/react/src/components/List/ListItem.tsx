"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useOption, useHover } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import type { ListState } from "react-stately";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { Divider } from "../Divider";
import {
  listItemVariants,
  listItemStateLayerVariants,
  listItemFocusRingVariants,
} from "./List.variants";
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
 * Architecture: Variants-vs-States
 * - Design-time variant: `density` (auto-derived from content).
 * - All interaction/selection states are expressed as data-* attributes on the root <li>
 *   via `getInteractionDataAttributes`, consumed by each slot via group-data-[x]/list-item.
 * - Content flags (`data-with-leading`, `data-with-trailing`) describe structure, set explicitly.
 *
 * Two operating modes:
 * - **Interactive** (inside a `List` with `selectionMode` or `onAction`):
 *   uses `useOption` for ARIA semantics, renders state layer + focus ring + ripple.
 * - **Static**: renders `<li role="listitem">`, no interactive affordances.
 *
 * Density is auto-derived from content:
 * - one-line (56dp)   — headline only
 * - two-line (72dp)   — headline + supportingText
 * - three-line (88dp) — overline present
 *
 * @example
 * ```tsx
 * // Static
 * <List aria-label="Settings">
 *   <ListItem value="wifi" headline="Wi-Fi" supportingText="Connected" leadingType="icon" leadingSlot={<IconWifi />} />
 * </List>
 *
 * // Interactive single-select
 * <List aria-label="Alignment" selectionMode="single">
 *   <ListItem value="left" headline="Left" />
 *   <ListItem value="center" headline="Center" />
 * </List>
 * ```
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
    <StaticStyledListItem
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
      isDisabled={isDisabled}
      insetDivider={insetDivider}
      {...(className !== undefined ? { className } : {})}
    />
  );
});

ListItem.displayName = "ListItem";

// ─── StaticStyledListItem (internal) ─────────────────────────────────────────

interface StaticStyledListItemInternalProps {
  value: string | number;
  headline: string;
  supportingText?: string;
  overline?: string;
  leadingSlot?: React.ReactNode;
  leadingType?: ListItemProps["leadingType"];
  trailingSlot?: React.ReactNode;
  trailingType?: ListItemProps["trailingType"];
  density: ListDensity;
  isDisabled: boolean;
  insetDivider: boolean;
  className?: string;
}

/**
 * Static list item — non-interactive; no state layer, focus ring, or ripple.
 * Still propagates data-disabled so slot color tokens respond correctly.
 */
const StaticStyledListItem = forwardRef<HTMLLIElement, StaticStyledListItemInternalProps>(
  function StaticStyledListItem(
    {
      headline,
      supportingText,
      overline,
      leadingSlot,
      leadingType,
      trailingSlot,
      trailingType,
      density,
      isDisabled,
      insetDivider,
      className,
    },
    ref
  ) {
    return (
      <li
        ref={ref}
        role="listitem"
        className={cn(listItemVariants({ density }), "group/list-item", className)}
        {...getInteractionDataAttributes({ isDisabled })}
      >
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

StaticStyledListItem.displayName = "StaticStyledListItem";

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
 *
 * Emits `group/list-item` on the root so all slot CVAs can consume
 * `group-data-[x]/list-item:` selectors without style leakage to sibling groups.
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

    // React Aria: provides ARIA semantics + isSelected, isDisabled, isPressed, isFocusVisible
    const { optionProps, isSelected, isDisabled, isPressed, isFocusVisible } = useOption(
      { key: value },
      state,
      ref
    );

    // Hover state for state-layer (useOption does not provide isHovered)
    const { isHovered, hoverProps } = useHover({ isDisabled });

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({ disabled: isDisabled });

    const mergedProps = mergeProps(optionProps, hoverProps, { onMouseDown: handleRipple });

    const hasLeading = !!leadingSlot;
    const hasTrailing = !!trailingSlot;

    return (
      <li
        {...mergedProps}
        ref={ref}
        className={cn(listItemVariants({ density }), "group/list-item", className)}
        // ── Interaction data attributes (from React Aria state) ──────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isSelected,
          isDisabled,
        })}
        // ── Structural flags (describe content, NOT interaction state) ───
        data-interactive=""
        data-with-leading={hasLeading ? "" : undefined}
        data-with-trailing={hasTrailing ? "" : undefined}
      >
        {/* Ripple */}
        {ripples}

        {/* State layer — hover/focus/pressed opacity ring */}
        <span aria-hidden="true" className={cn(listItemStateLayerVariants())} />

        {/* Focus ring — keyboard focus indicator */}
        <span aria-hidden="true" className={cn(listItemFocusRingVariants())} />

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
