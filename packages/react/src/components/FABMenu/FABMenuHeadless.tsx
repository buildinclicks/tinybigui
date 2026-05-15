"use client";

import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useButton } from "react-aria";
import { mergeProps } from "@react-aria/utils";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import type { FABMenuContextValue, FABMenuHeadlessProps } from "./FABMenu.types";

/**
 * Context for FABMenu — provides open state, direction, and reduced motion
 * preference to child `FABMenuItem` components.
 */
export const FABMenuContext = createContext<FABMenuContextValue>({
  isOpen: false,
  isExiting: false,
  direction: "up",
  reducedMotion: false,
  itemCount: 0,
});

/**
 * Hook to consume FABMenuContext from within a FABMenuItem or custom child.
 *
 * @example
 * ```tsx
 * const { isOpen, direction, reducedMotion } = useFABMenuContext();
 * ```
 */
export function useFABMenuContext(): FABMenuContextValue {
  return useContext(FABMenuContext);
}

const DIRECTION_CLASSES: Record<string, string> = {
  up: "flex-col-reverse",
  down: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

/**
 * FABMenuHeadless — Layer 2 headless primitive for the MD3 FAB Menu.
 *
 * Manages open/close state, keyboard interactions, and ARIA attributes
 * without opinionated styling. Uses `useButton` from React Aria for the
 * trigger element and controlled/uncontrolled state management.
 *
 * Features:
 * - Controlled and uncontrolled open state
 * - `useReducedMotion` animation guard
 * - Keyboard: Escape closes, trigger toggles via Enter/Space (via useButton)
 * - ARIA: `aria-expanded` on trigger, `aria-label` on trigger
 * - Context provider for child FABMenuItem components
 * - `forwardRef` to root element
 *
 * @example
 * ```tsx
 * <FABMenuHeadless aria-label="Quick actions" direction="up">
 *   <FABMenuItem icon={<IconEdit />} aria-label="Edit" />
 *   <FABMenuItem icon={<IconShare />} aria-label="Share" />
 * </FABMenuHeadless>
 * ```
 */
export const FABMenuHeadless = forwardRef<HTMLDivElement, FABMenuHeadlessProps>(
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

    const itemCount = Children.count(children);

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

    const { buttonProps } = useButton(
      {
        onPress: toggle,
        "aria-label": ariaLabel,
        "aria-expanded": isOpen,
      },
      triggerRef
    );

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
      isExiting: false,
      direction,
      reducedMotion,
      itemCount,
    };

    const triggerProps = mergeProps(buttonProps, {
      type: "button" as const,
    });

    return (
      <FABMenuContext.Provider value={contextValue}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={rootRef}
          className={cn("inline-flex items-center gap-2", DIRECTION_CLASSES[direction], className)}
          onKeyDown={handleKeyDown}
        >
          {isOpen && (
            <div
              className={cn("inline-flex items-center gap-2", DIRECTION_CLASSES[direction])}
              role="group"
              aria-label={`${ariaLabel} actions`}
            >
              {children}
            </div>
          )}
          {/* eslint-disable-next-line react/button-has-type -- type is set via mergeProps */}
          <button {...triggerProps} ref={triggerRef} />
        </div>
      </FABMenuContext.Provider>
    );
  }
);

FABMenuHeadless.displayName = "FABMenuHeadless";
