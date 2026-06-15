"use client";

import { forwardRef, useCallback, useState } from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { HeadlessDrawerItem } from "./DrawerHeadless";
import {
  drawerItemVariants,
  drawerItemActiveIndicatorVariants,
  drawerItemStateLayerVariants,
  drawerItemFocusRingVariants,
  drawerItemIconVariants,
  drawerItemLabelVariants,
  drawerItemBadgeVariants,
} from "./Drawer.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import type { DrawerItemProps } from "./Drawer.types";

/**
 * Material Design 3 Navigation Drawer Item (Layer 3: Styled).
 *
 * Architecture: Variants vs States (component-variants.mdc)
 * - Root is `group/draweritem` host; all slots read state via
 *   `group-data-[x]/draweritem:` selectors.
 * - Interaction states tracked in this styled layer via React Aria hooks
 *   and emitted as `data-*` attributes on the root via `getInteractionDataAttributes`.
 * - `data-active` is a content flag set explicitly (not via the shared helper).
 *
 * Slot z-order:
 *   activeIndicator  z-0    — `bg-secondary-container` pill
 *   stateLayer       z-[1]  — hover (8%) / press (10%) opacity overlay
 *   focusRing        z-[2]  — keyboard focus outline (inset, `-outline-offset-2`)
 *   ripple           z-[3]  — press ripple feedback
 *   icon             z-10   — leading icon (24dp)
 *   label            z-10   — label text
 *   badge            z-10   — trailing badge text
 *
 * Renders as `<a>` when `href` is provided, `<button>` otherwise.
 *
 * @example
 * ```tsx
 * // Active item with icon
 * <DrawerItem icon={<HomeIcon />} label="Home" isActive onPress={() => navigate('/')} />
 *
 * // Item with badge count
 * <DrawerItem label="Inbox" badge={24} />
 *
 * // Disabled
 * <DrawerItem label="Disabled Feature" isDisabled />
 * ```
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const DrawerItem = forwardRef<HTMLElement, DrawerItemProps>(
  (
    {
      href,
      icon,
      label,
      badge,
      isActive = false,
      isDisabled = false,
      disableRipple = false,
      className,
      // All remaining props (onPress, onPressStart, onPressEnd, etc.) stay in
      // restProps and are passed into mergeProps — mirrors the Button pattern.
      ...restProps
    },
    ref
  ) => {
    // ── Interaction state tracking ─────────────────────────────────────────
    const [isPressed, setIsPressed] = useState(false);
    const handlePressStart = useCallback(() => setIsPressed(true), []);
    const handlePressEnd = useCallback(() => setIsPressed(false), []);

    const { isHovered, hoverProps } = useHover({ isDisabled });
    const { isFocusVisible, focusProps } = useFocusRing();

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    // All event handlers merged in one call — mergeProps chains handlers so both
    // the internal state-tracking callbacks and the caller's handlers fire.
    // restProps is passed as the last argument so caller handlers run after ours.
    const mergedInteractionProps = mergeProps(
      hoverProps,
      focusProps,
      { onPressStart: handlePressStart, onPressEnd: handlePressEnd },
      restProps
    );

    return (
      <HeadlessDrawerItem
        {...mergedInteractionProps}
        ref={ref}
        {...(href !== undefined ? { href } : {})}
        isActive={isActive}
        {...(isDisabled !== undefined ? { isDisabled } : {})}
        onMouseDown={handleRipple}
        // ── Interaction data attributes ──────────────────────────────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isDisabled,
        })}
        // ── Content flag: active is structural, not an interaction state ─
        data-active={isActive ? "" : undefined}
        className={cn(
          drawerItemVariants(),
          // group/draweritem: enables group-data-[x]/draweritem selectors in all slots
          "group/draweritem",
          className
        )}
      >
        {/* ── Active indicator (z-0) ──────────────────────────────────────── */}
        {/* secondary-container pill; opacity 0→1 driven by data-active on root */}
        <span aria-hidden="true" className={drawerItemActiveIndicatorVariants()} />

        {/* ── State layer (z-[1]) ─────────────────────────────────────────── */}
        {/* Hover 8% / press 10%; color switches on data-active */}
        <span aria-hidden="true" className={drawerItemStateLayerVariants()} />

        {/* ── Focus ring (z-[2]) ──────────────────────────────────────────── */}
        {/* Inset outline; opacity 0→100 on focus-visible */}
        <span aria-hidden="true" className={drawerItemFocusRingVariants()} />

        {/* ── Ripple container (z-[3]) ────────────────────────────────────── */}
        <span
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden rounded-[inherit]"
          aria-hidden="true"
        >
          {ripples}
        </span>

        {/* ── Leading icon (z-10) ─────────────────────────────────────────── */}
        {icon && (
          <span aria-hidden="true" className={drawerItemIconVariants()}>
            {icon}
          </span>
        )}

        {/* ── Label (z-10) ────────────────────────────────────────────────── */}
        <span className={drawerItemLabelVariants()}>{label}</span>

        {/* ── Trailing badge text (z-10) ──────────────────────────────────── */}
        {badge !== undefined && badge !== null && (
          <span
            role="status"
            aria-label={typeof badge === "number" ? `${badge} notifications` : String(badge)}
            className={drawerItemBadgeVariants()}
          >
            {badge}
          </span>
        )}
      </HeadlessDrawerItem>
    );
  }
);

DrawerItem.displayName = "DrawerItem";
