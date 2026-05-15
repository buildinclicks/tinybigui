"use client";

import { forwardRef, useRef, useCallback, useEffect, type MouseEvent } from "react";
import { useButton } from "react-aria";
import { useMenuTriggerState } from "react-stately";
import {
  splitButtonContainerVariants,
  splitButtonPrimaryVariants,
  splitButtonDropdownVariants,
} from "./SplitButton.variants";
import { useRipple } from "../../hooks/useRipple";
import { cn } from "../../utils/cn";
import type { SplitButtonProps, SplitButtonMenuItem } from "./SplitButton.types";

/**
 * Chevron-down SVG icon for the dropdown trigger.
 * Rotates 180° when the menu is open.
 */
const ChevronIcon = ({ isOpen }: { isOpen: boolean }): React.ReactElement => (
  <svg
    aria-hidden="true"
    data-testid="split-button-chevron"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("duration-short4 ease-standard transition-transform", isOpen && "rotate-180")}
  >
    <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
  </svg>
);

/**
 * Material Design 3 Split Button Component (Layer 3: Styled)
 *
 * Combines a primary action button with a dropdown trigger that reveals
 * secondary actions in a menu. Both segments include MD3 state layers and
 * ripple effects.
 *
 * Features:
 * - 3 MD3 variants: filled, tonal, outlined
 * - Per-segment state layers (hover 8%, focus/pressed 12%)
 * - Ripple effect on both segments
 * - Chevron rotation animation on menu open
 * - Visual divider between segments per MD3 spec
 * - Full keyboard accessibility via React Aria
 *
 * @example
 * ```tsx
 * <SplitButton
 *   variant="filled"
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
      size = "medium",
      primaryLabel,
      onPrimaryAction,
      items,
      isDisabled = false,
      "aria-label": ariaLabel,
      className,
    },
    forwardedRef
  ) => {
    const primaryRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const menuState = useMenuTriggerState({});

    const { buttonProps: primaryButtonProps } = useButton(
      {
        isDisabled,
        onPress: onPrimaryAction,
        elementType: "button",
      },
      primaryRef
    );

    const handleDropdownPress = useCallback(() => {
      if (menuState.isOpen) {
        menuState.close();
      } else {
        menuState.open();
      }
    }, [menuState]);

    const { buttonProps: dropdownButtonProps } = useButton(
      {
        isDisabled,
        onPress: handleDropdownPress,
        elementType: "button",
      },
      dropdownRef
    );

    const handleMenuItemSelect = useCallback(
      (item: SplitButtonMenuItem) => {
        if (!item.isDisabled) {
          item.onAction();
          menuState.close();
        }
      },
      [menuState]
    );

    useEffect(() => {
      if (!menuState.isOpen) return;

      const handleGlobalKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          menuState.close();
          dropdownRef.current?.focus();
        }
      };

      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => {
        document.removeEventListener("keydown", handleGlobalKeyDown);
      };
    }, [menuState, menuState.isOpen]);

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
            dropdownRef.current?.focus();
            break;
          }
          default:
            break;
        }
      },
      [menuState]
    );

    // Auto-focus the first enabled menu item when the menu opens so keyboard
    // users can navigate immediately without an extra Tab press.
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

    const { onMouseDown: handlePrimaryRipple, ripples: primaryRipples } = useRipple({
      disabled: isDisabled,
    });

    const { onMouseDown: handleDropdownRipple, ripples: dropdownRipples } = useRipple({
      disabled: isDisabled,
    });

    const onPrimaryMouseDown = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        const ariaHandler = primaryButtonProps.onMouseDown as
          | ((e: MouseEvent<HTMLElement>) => void)
          | undefined;
        ariaHandler?.(e);
        handlePrimaryRipple(e);
      },
      [primaryButtonProps, handlePrimaryRipple]
    );

    const onDropdownMouseDown = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        const ariaHandler = dropdownButtonProps.onMouseDown as
          | ((e: MouseEvent<HTMLElement>) => void)
          | undefined;
        ariaHandler?.(e);
        handleDropdownRipple(e);
      },
      [dropdownButtonProps, handleDropdownRipple]
    );

    return (
      <div className="relative inline-flex">
        <div
          ref={forwardedRef}
          role="group"
          aria-label={ariaLabel ?? `${primaryLabel} split button`}
          className={cn(splitButtonContainerVariants({ variant, size, isDisabled }), className)}
        >
          {/* Primary action segment */}
          <button
            {...primaryButtonProps}
            ref={primaryRef}
            type="button"
            tabIndex={isDisabled ? -1 : 0}
            onMouseDown={onPrimaryMouseDown}
            className={splitButtonPrimaryVariants({ variant, size })}
          >
            <span
              data-testid="primary-state-layer"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 bg-current opacity-0",
                "duration-spring-standard-fast-effects ease-spring-standard-fast-effects transition-opacity",
                "group-hover/primary:opacity-8"
              )}
            />
            {primaryRipples}
            <span className="relative z-10">{primaryLabel}</span>
          </button>

          {/* Visual divider — rendered via border-l on the dropdown segment */}
          <span data-testid="split-button-divider" aria-hidden="true" />

          {/* Dropdown trigger segment */}
          <button
            {...dropdownButtonProps}
            ref={dropdownRef}
            type="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-haspopup="menu"
            aria-expanded={menuState.isOpen}
            aria-label={`${primaryLabel} options, expand`}
            onMouseDown={onDropdownMouseDown}
            className={splitButtonDropdownVariants({ variant, size })}
          >
            <span
              data-testid="dropdown-state-layer"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 bg-current opacity-0",
                "duration-spring-standard-fast-effects ease-spring-standard-fast-effects transition-opacity",
                "group-hover/dropdown:opacity-8"
              )}
            />
            {dropdownRipples}
            <span className="relative z-10">
              <ChevronIcon isOpen={menuState.isOpen} />
            </span>
          </button>
        </div>

        {/* Dropdown menu — sibling to the group container so it is NOT clipped
            by `overflow-hidden`; positioned relative to the outer wrapper. */}
        {menuState.isOpen && (
          <ul
            ref={menuRef}
            role="menu"
            aria-label={`${primaryLabel} options`}
            onKeyDown={handleMenuKeyDown}
            className={cn(
              "bg-surface-container absolute top-full right-0 z-50 mt-1 min-w-40 rounded-md py-2",
              "shadow-elevation-2"
            )}
          >
            {items.map((item) => (
              <li
                key={item.label}
                role="menuitem"
                tabIndex={item.isDisabled ? -1 : 0}
                aria-disabled={item.isDisabled ?? undefined}
                onClick={() => handleMenuItemSelect(item)}
                onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
                className={cn(
                  "text-body-large text-on-surface cursor-pointer px-4 py-2",
                  "hover:bg-on-surface/8",
                  item.isDisabled && "text-on-surface/38 pointer-events-none"
                )}
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
