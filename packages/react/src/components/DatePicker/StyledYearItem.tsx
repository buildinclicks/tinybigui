"use client";

import { useRef } from "react";
import { useHover, useFocusRing, usePress, mergeProps } from "react-aria";

import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import {
  yearItemVariants,
  yearItemStateLayerVariants,
  yearItemFocusRingVariants,
} from "./DatePicker.variants";

import type { YearItemComponentProps } from "./CalendarCore";

/**
 * StyledYearItem (Layer 3 slot)
 *
 * MD3-styled year selection item.
 * 88×52dp pill, body-large, on-surface-variant/on-primary for selected,
 * with state layer + focus ring.
 *
 * Architecture:
 * - `yearItemVariants`           — pill shape, body-large, data-[selected] bg-primary,
 *                                  carries `group/year-item`
 * - `yearItemStateLayerVariants` — absolute opacity overlay; switches color on selected
 * - `yearItemFocusRingVariants`  — keyboard-only outline ring
 *
 * @internal — passed to CalendarCore via `slots.YearItemComponent`
 */
export function StyledYearItem({
  year,
  isSelected,
  onSelect,
}: YearItemComponentProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});
  const { pressProps, isPressed } = usePress({});

  return (
    <button
      {...mergeProps(focusProps, hoverProps, pressProps)}
      ref={ref}
      type="button"
      role="gridcell"
      aria-selected={isSelected}
      className={cn(yearItemVariants())}
      onClick={() => onSelect(year)}
      {...getInteractionDataAttributes({
        isHovered,
        isFocusVisible,
        isPressed,
        isSelected,
      })}
    >
      {/* State layer */}
      <span className={cn(yearItemStateLayerVariants())} aria-hidden="true" />
      {/* Focus ring */}
      <span className={cn(yearItemFocusRingVariants())} aria-hidden="true" />
      {/* Label */}
      <span className="pointer-events-none relative z-10">{year}</span>
    </button>
  );
}

StyledYearItem.displayName = "StyledYearItem";
