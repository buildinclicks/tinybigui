"use client";

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import type React from "react";

import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { FABMenuContext } from "./FABMenuHeadless";
import { FAB } from "../FAB/FAB";
import { fabMenuVariants } from "./FABMenu.variants";
import type { FABMenuProps, FABMenuContextValue } from "./FABMenu.types";

/**
 * FABMenu — Material Design 3 styled FAB Menu (Layer 3).
 *
 * Renders a trigger FAB that expands a list of mini FAB action items
 * in the specified direction. Manages stagger animation-delay on children,
 * elevation changes on the trigger, and icon rotation.
 *
 * Built on top of FABMenuContext for state sharing with FABMenuItem children.
 * Uses the existing `FAB` component as the trigger button.
 *
 * @example
 * ```tsx
 * <FABMenu aria-label="Quick actions" direction="up">
 *   <FABMenuItem icon={<IconEdit />} label="Edit" aria-label="Edit" />
 *   <FABMenuItem icon={<IconShare />} label="Share" aria-label="Share" />
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

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape" && isOpen) {
          e.stopPropagation();
          close();
          triggerRef.current?.focus();
        }
      },
      [isOpen, close]
    );

    const contextValue: FABMenuContextValue = {
      isOpen,
      direction,
      reducedMotion,
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
        <div
          ref={rootRef}
          className={cn(fabMenuVariants({ direction }), className)}
          onKeyDown={handleKeyDown}
        >
          {isOpen && (
            <div
              className={cn(
                "inline-flex items-center gap-3",
                direction === "up" && "flex-col-reverse",
                direction === "down" && "flex-col",
                direction === "left" && "flex-row-reverse",
                direction === "right" && "flex-row"
              )}
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
                  "duration-short4 ease-standard h-6 w-6 transition-transform",
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
