"use client";

import { forwardRef, useRef, useCallback, useEffect, useState, type MouseEvent } from "react";
import { useButton, useHover, useFocusRing, mergeProps } from "react-aria";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMenuTriggerState } from "react-stately";
import {
  splitButtonContainerVariants,
  splitButtonLeadingVariants,
  splitButtonTrailingVariants,
  splitButtonStateLayerVariants,
  splitButtonFocusRingVariants,
  splitButtonLabelVariants,
  splitButtonIconVariants,
  splitButtonMenuVariants,
  splitButtonMenuItemVariants,
} from "./SplitButton.variants";
import { useRipple } from "../../hooks/useRipple";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { cn } from "../../utils/cn";
import type { SplitButtonProps, SplitButtonMenuItem } from "./SplitButton.types";

/**
 * Chevron-down icon for the trailing dropdown trigger.
 * Rotates 180° when the menu is open, using the MD3 spatial spring token.
 * When reduced motion is preferred the rotation is instant (no transition).
 */
const ChevronIcon = ({
  isOpen,
  reducedMotion,
}: {
  isOpen: boolean;
  reducedMotion: boolean;
}): React.ReactElement => (
  <svg
    aria-hidden="true"
    data-testid="split-button-chevron"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "size-full",
      !reducedMotion &&
        "duration-expressive-fast-spatial ease-expressive-fast-spatial transition-transform",
      isOpen && "rotate-180"
    )}
  >
    <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
  </svg>
);

/**
 * Material Design 3 Expressive Split Button Component (Layer 3: Styled)
 *
 * Combines a leading action button with a trailing dropdown trigger that reveals
 * secondary actions in a menu. Both segments have full MD3 Expressive state layers,
 * per-segment focus rings, and inner-corner shape morphing.
 *
 * Implements the Variants-vs-States architecture: all interaction states are
 * expressed as data-* attributes on each segment root and consumed by child
 * slots via group-data-[x]/sb-leading and group-data-[x]/sb-trailing selectors.
 *
 * Features:
 * - 4 MD3 variants: elevated, filled, tonal, outlined
 * - 5 MD3 Expressive sizes: xs, sm, md, lg, xl
 * - Per-segment React Aria interaction tracking (hover, focus, press)
 * - Per-segment MD3 state layers (hover 8%, focus 10%, pressed 10%)
 * - Per-segment focus rings (extends outside overflow-hidden)
 * - Ripple effect on both segments
 * - Inner-corner shape morphing on interaction (MD3 Expressive signature)
 * - 2dp gap between segments per MD3 spec
 * - Chevron rotation animation on menu open
 * - useReducedMotion guard on all JS-driven transitions
 * - Full keyboard accessibility via React Aria
 *
 * @example
 * ```tsx
 * <SplitButton
 *   variant="filled"
 *   size="sm"
 *   primaryLabel="Save"
 *   onPrimaryAction={() => console.log('saved')}
 *   items={[
 *     { label: 'Save as draft', onAction: () => {} },
 *     { label: 'Save and close', onAction: () => {} }
 *   ]}
 * />
 * ```
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      variant = "filled",
      size = "sm",
      primaryLabel,
      onPrimaryAction,
      items,
      isDisabled = false,
      "aria-label": ariaLabel,
      className,
    },
    forwardedRef
  ) => {
    const leadingRef = useRef<HTMLButtonElement>(null);
    const trailingRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const reducedMotion = useReducedMotion();

    const menuState = useMenuTriggerState({});

    // ── Leading segment interaction state ────────────────────────────────────
    const [isLeadingPressed, setIsLeadingPressed] = useState(false);
    const handleLeadingPressStart = useCallback(() => setIsLeadingPressed(true), []);
    const handleLeadingPressEnd = useCallback(() => setIsLeadingPressed(false), []);

    const { isHovered: isLeadingHovered, hoverProps: leadingHoverProps } = useHover({
      isDisabled,
    });
    const { isFocusVisible: isLeadingFocusVisible, focusProps: leadingFocusProps } = useFocusRing();

    const { buttonProps: leadingButtonProps } = useButton(
      {
        isDisabled,
        onPress: onPrimaryAction,
        onPressStart: handleLeadingPressStart,
        onPressEnd: handleLeadingPressEnd,
        elementType: "button",
      },
      leadingRef
    );

    // ── Trailing segment interaction state ────────────────────────────────────
    const [isTrailingPressed, setIsTrailingPressed] = useState(false);
    const handleTrailingPressStart = useCallback(() => setIsTrailingPressed(true), []);
    const handleTrailingPressEnd = useCallback(() => setIsTrailingPressed(false), []);

    const { isHovered: isTrailingHovered, hoverProps: trailingHoverProps } = useHover({
      isDisabled,
    });
    const { isFocusVisible: isTrailingFocusVisible, focusProps: trailingFocusProps } =
      useFocusRing();

    const handleTrailingPress = useCallback(() => {
      if (menuState.isOpen) {
        menuState.close();
      } else {
        menuState.open();
      }
    }, [menuState]);

    const { buttonProps: trailingButtonProps } = useButton(
      {
        isDisabled,
        onPress: handleTrailingPress,
        onPressStart: handleTrailingPressStart,
        onPressEnd: handleTrailingPressEnd,
        elementType: "button",
      },
      trailingRef
    );

    // ── Ripple effects ────────────────────────────────────────────────────────
    const { onMouseDown: handleLeadingRipple, ripples: leadingRipples } = useRipple({
      disabled: isDisabled,
    });
    const { onMouseDown: handleTrailingRipple, ripples: trailingRipples } = useRipple({
      disabled: isDisabled,
    });

    const onLeadingMouseDown = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        const ariaHandler = leadingButtonProps.onMouseDown as
          | ((e: MouseEvent<HTMLElement>) => void)
          | undefined;
        ariaHandler?.(e);
        handleLeadingRipple(e);
      },
      [leadingButtonProps, handleLeadingRipple]
    );

    const onTrailingMouseDown = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        const ariaHandler = trailingButtonProps.onMouseDown as
          | ((e: MouseEvent<HTMLElement>) => void)
          | undefined;
        ariaHandler?.(e);
        handleTrailingRipple(e);
      },
      [trailingButtonProps, handleTrailingRipple]
    );

    // ── Menu item handling ────────────────────────────────────────────────────
    const handleMenuItemSelect = useCallback(
      (item: SplitButtonMenuItem) => {
        if (!item.isDisabled) {
          item.onAction();
          menuState.close();
        }
      },
      [menuState]
    );

    // Global Escape closes menu
    useEffect(() => {
      if (!menuState.isOpen) return;

      const handleGlobalKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          menuState.close();
          trailingRef.current?.focus();
        }
      };

      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }, [menuState, menuState.isOpen]);

    // Arrow / Home / End keyboard navigation within the open menu
    const handleMenuKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLUListElement>) => {
        const menuItems = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([aria-disabled="true"])'
          )
        );
        const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            menuItems[(currentIndex + 1) % menuItems.length]?.focus();
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length]?.focus();
            break;
          }
          case "Home": {
            e.preventDefault();
            menuItems[0]?.focus();
            break;
          }
          case "End": {
            e.preventDefault();
            menuItems[menuItems.length - 1]?.focus();
            break;
          }
          case "Escape": {
            menuState.close();
            trailingRef.current?.focus();
            break;
          }
          default:
            break;
        }
      },
      [menuState]
    );

    // Auto-focus first enabled item when menu opens
    useEffect(() => {
      if (menuState.isOpen && menuRef.current) {
        const firstItem = menuRef.current.querySelector<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])'
        );
        firstItem?.focus();
      }
    }, [menuState.isOpen]);

    const handleMenuItemKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLLIElement>, item: SplitButtonMenuItem) => {
        if ((e.key === "Enter" || e.key === " ") && !item.isDisabled) {
          e.preventDefault();
          item.onAction();
          menuState.close();
        }
      },
      [menuState]
    );

    return (
      <div className="relative inline-flex">
        <div
          ref={forwardedRef}
          role="group"
          aria-label={ariaLabel ?? `${primaryLabel} split button`}
          className={cn(splitButtonContainerVariants(), className)}
        >
          {/* ── Leading (primary action) segment ──────────────────────────── */}
          <button
            {...mergeProps(leadingButtonProps, leadingHoverProps, leadingFocusProps)}
            ref={leadingRef}
            type="button"
            tabIndex={isDisabled ? -1 : 0}
            onMouseDown={onLeadingMouseDown}
            // Interaction data attributes drive all state-layer and elevation styling
            {...getInteractionDataAttributes({
              isHovered: isLeadingHovered,
              isFocusVisible: isLeadingFocusVisible,
              isPressed: isLeadingPressed,
              isDisabled,
            })}
            className={splitButtonLeadingVariants({ variant, size })}
          >
            {/* State layer — overflow-hidden here, not on the root */}
            <span
              data-testid="primary-state-layer"
              aria-hidden="true"
              className={splitButtonStateLayerVariants({ variant, groupScope: "leading" })}
            />

            {/* Ripple */}
            {leadingRipples}

            {/* Focus ring — outside overflow-hidden, extends 3px past boundary */}
            <span
              aria-hidden="true"
              className={splitButtonFocusRingVariants({ groupScope: "leading" })}
            />

            {/* Label */}
            <span className={splitButtonLabelVariants()}>{primaryLabel}</span>
          </button>

          {/* ── Trailing (dropdown trigger) segment ───────────────────────── */}
          <button
            {...mergeProps(trailingButtonProps, trailingHoverProps, trailingFocusProps)}
            ref={trailingRef}
            type="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-haspopup="menu"
            aria-expanded={menuState.isOpen}
            aria-label={`${primaryLabel} options, expand`}
            onMouseDown={onTrailingMouseDown}
            // data-selected when menu is open — MD3 trailing icon centering
            {...getInteractionDataAttributes({
              isHovered: isTrailingHovered,
              isFocusVisible: isTrailingFocusVisible,
              isPressed: isTrailingPressed,
              isSelected: menuState.isOpen,
              isDisabled,
            })}
            className={splitButtonTrailingVariants({ variant, size })}
          >
            {/* State layer */}
            <span
              data-testid="dropdown-state-layer"
              aria-hidden="true"
              className={splitButtonStateLayerVariants({ variant, groupScope: "trailing" })}
            />

            {/* Ripple */}
            {trailingRipples}

            {/* Focus ring */}
            <span
              aria-hidden="true"
              className={splitButtonFocusRingVariants({ groupScope: "trailing" })}
            />

            {/* Chevron icon — rotates when menu is open */}
            <span className={splitButtonIconVariants({ size })}>
              <ChevronIcon isOpen={menuState.isOpen} reducedMotion={reducedMotion} />
            </span>
          </button>
        </div>

        {/* ── Dropdown menu — sibling to the group so it is NOT clipped ─────── */}
        {menuState.isOpen && (
          <ul
            ref={menuRef}
            role="menu"
            aria-label={`${primaryLabel} options`}
            onKeyDown={handleMenuKeyDown}
            className={splitButtonMenuVariants()}
          >
            {items.map((item) => (
              <li
                key={item.label}
                role="menuitem"
                tabIndex={item.isDisabled ? -1 : 0}
                aria-disabled={item.isDisabled ?? undefined}
                onClick={() => handleMenuItemSelect(item)}
                onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
                className={splitButtonMenuItemVariants({ isDisabled: item.isDisabled ?? false })}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

SplitButton.displayName = "SplitButton";
