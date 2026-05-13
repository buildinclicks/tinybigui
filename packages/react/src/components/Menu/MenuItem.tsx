"use client";

import { forwardRef, type JSX } from "react";
import type { MenuItemRenderProps } from "react-aria-components";
import { useMenuContext } from "./MenuHeadless";
import { HeadlessMenuItem } from "./MenuHeadless";
import {
  menuItemVariants,
  menuItemTrailingTextVariants,
  menuItemDescriptionVariants,
} from "./Menu.variants";
import { useRipple } from "../../hooks/useRipple";
import { cn } from "../../utils/cn";
import type { MenuItemProps } from "./Menu.types";

// ─── CheckIcon ───────────────────────────────────────────────────────────────

function CheckIcon(): JSX.Element {
  return (
    <svg
      data-testid="check-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

// ─── ChevronRightIcon ─────────────────────────────────────────────────────────

export function ChevronRightIcon(): JSX.Element {
  return (
    <svg
      data-testid="chevron-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

// ─── Density height map ────────────────────────────────────────────────────────

const DENSITY_HEIGHT: Record<0 | -1 | -2 | -3, string> = {
  0: "h-12",
  [-1]: "h-11",
  [-2]: "h-10",
  [-3]: "h-9",
};

// ─── MenuItem ─────────────────────────────────────────────────────────────────

/**
 * MD3 styled MenuItem component (Layer 3).
 *
 * All MD3 styles (selection colors, typography, density height) are applied
 * directly to the `<li role="menuitem">` element via RAC's render-prop className,
 * ensuring tests and assistive technologies see the correct classes on the
 * semantically meaningful element.
 *
 * @example
 * ```tsx
 * <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
 *   Copy
 * </MenuItem>
 * ```
 */
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  {
    children,
    leadingIcon,
    trailingIcon,
    trailingText,
    description,
    badge,
    className,
    disableRipple: itemDisableRipple,
    ...props
  },
  ref
) {
  const ctx = useMenuContext();
  const disableRipple = itemDisableRipple ?? ctx?.disableRipple ?? false;
  const colorScheme = ctx?.colorScheme ?? "standard";
  const menuStyle = ctx?.menuStyle ?? "baseline";
  const density = ctx?.density ?? 0;
  const selectionMode = ctx?.selectionMode;

  const heightClass = DENSITY_HEIGHT[density];
  const isSelectionMenu = selectionMode != null;

  const { ripples, onMouseDown } = useRipple({ disabled: disableRipple });

  // className rendered on the <li role="menuitem"> via RAC's render-prop form
  const computeClassName = ({ isDisabled, isSelected }: MenuItemRenderProps): string =>
    cn(
      menuItemVariants({
        isDisabled,
        isSelected: isSelected ?? false,
        colorScheme,
        menuStyle,
      }),
      // Height: auto when description is present (multi-line), otherwise density
      description ? "min-h-12 py-2 h-auto items-start" : heightClass,
      className
    );

  return (
    <HeadlessMenuItem
      {...props}
      ref={ref}
      // Apply all MD3 classes directly to the <li role="menuitem"> element
      className={computeClassName}
      // onMouseDown triggers the ripple effect on mouse presses
      onMouseDown={onMouseDown as unknown as React.MouseEventHandler<Element>}
    >
      {({ isSelected }: MenuItemRenderProps) => (
        <>
          {/* Ripple container */}
          {!disableRipple && (
            <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
              {ripples}
            </span>
          )}

          {/* ── Leading icon or checkmark slot ────────────────────────── */}
          {(leadingIcon != null || isSelectionMenu) && (
            <span
              className="text-on-surface-variant relative z-10 flex h-6 w-6 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              {isSelectionMenu && leadingIcon == null ? (
                isSelected ? (
                  <CheckIcon />
                ) : null
              ) : (
                leadingIcon
              )}
            </span>
          )}

          {/* ── Text content area ─────────────────────────────────────── */}
          {description != null ? (
            <span className="relative z-10 flex min-w-0 flex-1 flex-col">
              <span className="text-body-large">{children}</span>
              <span className={menuItemDescriptionVariants()}>{description}</span>
            </span>
          ) : (
            <span className="text-body-large relative z-10 min-w-0 flex-1">{children}</span>
          )}

          {/* ── Badge slot ────────────────────────────────────────────── */}
          {badge != null && <span className="relative z-10 shrink-0">{badge}</span>}

          {/* ── Trailing icon ─────────────────────────────────────────── */}
          {trailingIcon != null && trailingText == null && (
            <span
              className="text-on-surface-variant relative z-10 ml-auto flex h-6 w-6 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              {trailingIcon}
            </span>
          )}

          {/* ── Trailing text (keyboard shortcut) ─────────────────────── */}
          {trailingText != null && trailingIcon == null && (
            <span
              className={cn(menuItemTrailingTextVariants(), "relative z-10")}
              aria-keyshortcuts={trailingText}
            >
              {trailingText}
            </span>
          )}
        </>
      )}
    </HeadlessMenuItem>
  );
});
