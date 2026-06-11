"use client";

import { forwardRef, type JSX } from "react";
import type { MenuItemRenderProps } from "react-aria-components";
import { useMenuContext } from "./MenuHeadless";
import { HeadlessMenuItem } from "./MenuHeadless";
import {
  menuItemVariants,
  menuItemStateLayerVariants,
  menuItemHighlightVariants,
  menuItemFocusRingVariants,
  menuItemIconVariants,
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

// ─── Density height maps ───────────────────────────────────────────────────────

/**
 * Baseline item heights per MD3 density spec.
 * density 0 = 48dp, -1 = 44dp, -2 = 40dp, -3 = 36dp.
 */
const BASELINE_DENSITY_HEIGHT: Record<0 | -1 | -2 | -3, string> = {
  0: "h-12",
  [-1]: "h-11",
  [-2]: "h-10",
  [-3]: "h-9",
};

/**
 * Vertical (Expressive) item heights per MD3 Expressive measurement spec.
 * Matched to baseline heights (48/44/40/36dp) per the measurement reference.
 */
const VERTICAL_DENSITY_HEIGHT: Record<0 | -1 | -2 | -3, string> = {
  0: "h-12",
  [-1]: "h-11",
  [-2]: "h-10",
  [-3]: "h-9",
};

// ─── MenuItem ─────────────────────────────────────────────────────────────────

/**
 * MD3 styled MenuItem component (Layer 3).
 *
 * Slot architecture (mirrors Button/Switch):
 *   root (group/menuitem)        — layout, cursor, color, density height
 *   highlight (z-0)              — selected/active background fill
 *   stateLayer (z-[1])           — hover/press opacity overlay
 *   focusRing (z-[2])            — keyboard focus outline (inset, not on state-layer)
 *   ripple (z-[3])               — press ripple feedback
 *   content (z-10)               — icon, label, trailing text/icon, description
 *
 * All interaction/selection styles are driven by data-* attributes that RAC
 * MenuItem emits natively (data-hovered, data-pressed, data-focus-visible,
 * data-selected, data-disabled, data-open) consumed via group-data selectors.
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

  const heightClass =
    menuStyle === "vertical" ? VERTICAL_DENSITY_HEIGHT[density] : BASELINE_DENSITY_HEIGHT[density];
  const isSelectionMenu = selectionMode != null;

  const { ripples, onMouseDown } = useRipple({ disabled: disableRipple });

  // className rendered on the <li role="menuitem"> via RAC's render-prop form.
  const computeClassName = ({ isSelected }: MenuItemRenderProps): string =>
    cn(
      menuItemVariants({ colorScheme, menuStyle }),
      // group/menuitem scope: all slot children read state via group-data-[x]/menuitem
      "group/menuitem",
      // Height: auto when description is present (multi-line), otherwise density
      description ? "min-h-12 py-2 h-auto items-start" : heightClass,
      className,
      // Silence the isSelected lint — value consumed in render-prop below
      isSelected ? "" : ""
    );

  return (
    <HeadlessMenuItem
      {...props}
      ref={ref}
      className={computeClassName}
      onMouseDown={onMouseDown as unknown as React.MouseEventHandler<Element>}
    >
      {({ isSelected }: MenuItemRenderProps) => (
        <>
          {/* ── Highlight layer (selected/active background) ───────────────── */}
          {/* z-0, full-bleed inset-0 rounded-[inherit] so it respects the
              item's current segment corner radius (inner 4dp or outer 16dp). */}
          <span
            aria-hidden="true"
            data-testid="menuitem-highlight"
            className={menuItemHighlightVariants({ colorScheme, menuStyle })}
          />

          {/* ── State layer slot ──────────────────────────────────────────── */}
          {/* z-[1]: above highlight, below focus ring and content.
              Covers hover (8%) and press (10%) but NOT focus-visible
              — focus is expressed via the dedicated focus-ring slot below. */}
          <span
            aria-hidden="true"
            className={menuItemStateLayerVariants({ colorScheme, menuStyle })}
          />

          {/* ── Focus ring slot ───────────────────────────────────────────── */}
          {/* z-[2]: above state layer. Keyboard-focus outline, inset 2dp,
              inherits item corner radius. Opacity 0→100 on focus-visible. */}
          <span
            aria-hidden="true"
            data-testid="menuitem-focus-ring"
            className={menuItemFocusRingVariants()}
          />

          {/* ── Ripple container ──────────────────────────────────────────── */}
          {/* z-[3]: above focus ring. Full-bleed, inherits item corners so
              the ripple clips to the segment card shape. */}
          {!disableRipple && (
            <span
              className={cn(
                "pointer-events-none absolute inset-0 z-[3] overflow-hidden rounded-[inherit]"
              )}
            >
              {ripples}
            </span>
          )}

          {/* ── Leading icon or checkmark slot ────────────────────────────── */}
          {(leadingIcon != null || isSelectionMenu) && (
            <span className={menuItemIconVariants({ colorScheme, menuStyle })} aria-hidden="true">
              {isSelectionMenu && leadingIcon == null ? (
                isSelected ? (
                  <CheckIcon />
                ) : null
              ) : (
                leadingIcon
              )}
            </span>
          )}

          {/* ── Text content area ─────────────────────────────────────────── */}
          {description != null ? (
            <span className="relative z-10 flex min-w-0 flex-1 flex-col">
              <span className="text-label-large group-data-[disabled]/menuitem:text-on-surface/38">
                {children}
              </span>
              <span className={menuItemDescriptionVariants({ colorScheme, menuStyle })}>
                {description}
              </span>
            </span>
          ) : (
            <span className="text-label-large group-data-[disabled]/menuitem:text-on-surface/38 relative z-10 min-w-0 flex-1">
              {children}
            </span>
          )}

          {/* ── Badge slot ────────────────────────────────────────────────── */}
          {badge != null && <span className="relative z-10 shrink-0">{badge}</span>}

          {/* ── Trailing icon ─────────────────────────────────────────────── */}
          {trailingIcon != null && trailingText == null && (
            <span
              className={cn(menuItemIconVariants({ colorScheme, menuStyle }), "ml-auto")}
              aria-hidden="true"
            >
              {trailingIcon}
            </span>
          )}

          {/* ── Trailing text (keyboard shortcut) ─────────────────────────── */}
          {trailingText != null && trailingIcon == null && (
            <span
              className={cn(
                menuItemTrailingTextVariants({ colorScheme, menuStyle }),
                "relative z-10"
              )}
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
