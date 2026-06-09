"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type React from "react";

import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { FABMenuContext } from "./FABMenuHeadless";
import { FAB } from "../FAB/FAB";
import { fabMenuVariants, fabMenuListVariants } from "./FABMenu.variants";
import type { FABMenuProps, FABMenuContextValue } from "./FABMenu.types";

/**
 * FABMenu — Material Design 3 Expressive FAB Menu (Layer 3).
 *
 * Renders a trigger FAB that expands a list of MD3 Expressive pill menu items
 * in the specified direction. Manages stagger animation-delay on children,
 * elevation changes on the trigger, and icon rotation (+ → ×).
 *
 * The trigger FAB icon morphs using expressive spring spatial tokens to convey
 * the energetic, high-emphasis nature of the interaction.
 *
 * Built on top of FABMenuContext for state sharing with FABMenuItem children.
 * Uses the existing `FAB` component as the trigger button.
 *
 * @example
 * ```tsx
 * <FABMenu aria-label="Quick actions" direction="up">
 *   <FABMenuItem icon={<IconEdit />} label="Edit" />
 *   <FABMenuItem icon={<IconShare />} label="Share" />
 * </FABMenu>
 * ```
 */
export const FABMenu = forwardRef<HTMLDivElement, FABMenuProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      direction = "up",
      "aria-label": ariaLabel,
      className,
      children,
    },
    forwardedRef
  ) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const internalRootRef = useRef<HTMLDivElement>(null);
    const rootRef = (forwardedRef ?? internalRootRef) as React.RefObject<HTMLDivElement>;

    const reducedMotion = useReducedMotion();

    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const [isExiting, setIsExiting] = useState(false);
    const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const itemCountRef = useRef(0);

    const itemCount = Children.count(children);
    itemCountRef.current = itemCount;

    const setIsOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setInternalOpen(next);
        }
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const toggle = useCallback(() => {
      setIsOpen(!isOpen);
    }, [setIsOpen, isOpen]);

    const close = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    // Manage exit animation: keep items mounted while scale-out plays, then unmount.
    // useLayoutEffect (not useEffect) is intentional: it fires synchronously after React
    // commits but before the browser paints. Without this, the browser would paint a
    // single frame with isOpen=false AND isExiting=false — items gone — before
    // setIsExiting(true) re-mounts them for the scale-out animation, causing the blink.
    const prevIsOpenRef = useRef<boolean | undefined>(undefined);
    useLayoutEffect(() => {
      if (prevIsOpenRef.current === undefined) {
        prevIsOpenRef.current = isOpen;
        return;
      }
      const wasOpen = prevIsOpenRef.current;
      prevIsOpenRef.current = isOpen;

      if (wasOpen && !isOpen) {
        setIsExiting(true);
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        const maxDelay = Math.max(0, itemCountRef.current - 1) * 30;
        exitTimerRef.current = setTimeout(() => {
          setIsExiting(false);
        }, maxDelay + 250);
      } else if (isOpen) {
        setIsExiting(false);
        if (exitTimerRef.current) {
          clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
      }
    }, [isOpen]);

    useEffect(() => {
      return () => {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      };
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape" && isOpen) {
          e.stopPropagation();
          close();
          triggerRef.current?.focus();
          return;
        }
        if (isOpen && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
          e.preventDefault();
          const group = rootRef.current?.querySelector<HTMLElement>('[role="group"]');
          if (!group) return;
          const items = Array.from(
            group.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
          );
          if (items.length === 0) return;
          const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
          const nextIndex =
            e.key === "ArrowUp"
              ? currentIndex <= 0
                ? items.length - 1
                : currentIndex - 1
              : currentIndex >= items.length - 1
                ? 0
                : currentIndex + 1;
          items[nextIndex]?.focus();
        }
      },
      [isOpen, close, rootRef]
    );

    const contextValue: FABMenuContextValue = {
      isOpen,
      isExiting,
      direction,
      reducedMotion,
      itemCount,
    };

    const indexedChildren = Children.map(children, (child, index) => {
      if (isValidElement<{ index?: number }>(child)) {
        return cloneElement(child, { index });
      }
      return child;
    });

    return (
      <FABMenuContext.Provider value={contextValue}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div ref={rootRef} className={cn(fabMenuVariants(), className)} onKeyDown={handleKeyDown}>
          {(isOpen || isExiting) && (
            <div
              className={cn(fabMenuListVariants({ direction }))}
              role="group"
              aria-label={`${ariaLabel} actions`}
            >
              {indexedChildren}
            </div>
          )}

          <FAB
            ref={triggerRef}
            onPress={toggle}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={cn(
                  // Expressive fast-spatial: FAB icon is small, high-emphasis — matches FAB enter motion
                  "h-6 w-6 transition-transform",
                  reducedMotion
                    ? ""
                    : "duration-expressive-fast-spatial ease-expressive-fast-spatial",
                  isOpen && "rotate-45"
                )}
                aria-hidden="true"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            }
            className={cn(isOpen && "shadow-elevation-4")}
          />
        </div>
      </FABMenuContext.Provider>
    );
  }
);

FABMenu.displayName = "FABMenu";
