"use client";

import { forwardRef, useRef, useCallback, useEffect } from "react";
import { useButton } from "react-aria";
import { useMenuTriggerState } from "react-stately";
import type { SplitButtonHeadlessProps, SplitButtonMenuItem } from "./SplitButton.types";

/**
 * Headless Split Button Component (Layer 2)
 *
 * Unstyled two-segment button primitive using React Aria for accessibility.
 * Provides behavior only — bring your own styles.
 *
 * Structure:
 * - Leading segment: triggers the main action
 * - Trailing segment: opens/closes the dropdown menu
 *   (separated by a 2dp gap in the styled layer; no divider element here)
 *
 * Both segments are independently focusable via Tab navigation.
 * The trailing trigger manages `aria-haspopup` and `aria-expanded`.
 *
 * @example
 * ```tsx
 * <SplitButtonHeadless
 *   primaryLabel="Save"
 *   onPrimaryAction={() => save()}
 *   items={[
 *     { label: 'Save as PDF', onAction: () => savePDF() },
 *     { label: 'Save as PNG', onAction: () => savePNG() },
 *   ]}
 * />
 * ```
 */
export const SplitButtonHeadless = forwardRef<HTMLDivElement, SplitButtonHeadlessProps>(
  (
    {
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

    const menuState = useMenuTriggerState({});

    const { buttonProps: leadingButtonProps } = useButton(
      {
        isDisabled,
        onPress: onPrimaryAction,
        elementType: "button",
      },
      leadingRef
    );

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
        elementType: "button",
      },
      trailingRef
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
          trailingRef.current?.focus();
        }
      };

      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => document.removeEventListener("keydown", handleGlobalKeyDown);
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
            trailingRef.current?.focus();
            break;
          }
          default:
            break;
        }
      },
      [menuState]
    );

    // Auto-focus first enabled menu item when the menu opens
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
      <div
        ref={forwardedRef}
        role="group"
        aria-label={ariaLabel ?? `${primaryLabel} split button`}
        className={className}
      >
        {/* Leading action segment */}
        <button
          {...leadingButtonProps}
          ref={leadingRef}
          type="button"
          tabIndex={isDisabled ? -1 : 0}
        >
          {primaryLabel}
        </button>

        {/* Trailing dropdown trigger segment — no divider element; gap comes from parent layout */}
        <button
          {...trailingButtonProps}
          ref={trailingRef}
          type="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-haspopup="menu"
          aria-expanded={menuState.isOpen}
          aria-label={`${primaryLabel} options, expand`}
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {menuState.isOpen && (
          <ul
            ref={menuRef}
            role="menu"
            aria-label={`${primaryLabel} options`}
            onKeyDown={handleMenuKeyDown}
          >
            {items.map((item) => (
              <li
                key={item.label}
                role="menuitem"
                tabIndex={item.isDisabled ? -1 : 0}
                aria-disabled={item.isDisabled ?? undefined}
                onClick={() => handleMenuItemSelect(item)}
                onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
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

SplitButtonHeadless.displayName = "SplitButtonHeadless";

export { type SplitButtonHeadlessProps };
