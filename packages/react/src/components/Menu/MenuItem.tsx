"use client";

import { forwardRef, type JSX } from "react";
import type { MenuItemRenderProps } from "react-aria-components";
import { useMenuContext } from "./MenuHeadless";
import { HeadlessMenuItem } from "./MenuHeadless";
import {
  menuItemVariants,
  menuItemStateLayerVariants,
  menuItemHighlightVariants,
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

const BASELINE_DENSITY_HEIGHT: Record<0 | -1 | -2 | -3, string> = {
  0: "h-12",
  [-1]: "h-11",
  [-2]: "h-10",
  [-3]: "h-9",
};

// MD3 Expressive vertical: Item = 44dp at density 0
const VERTICAL_DENSITY_HEIGHT: Record<0 | -1 | -2 | -3, string> = {
  0: "h-11",
  [-1]: "h-10",
  [-2]: "h-9",
  [-3]: "h-8",
};

// ─── MenuItem ─────────────────────────────────────────────────────────────────

/**
 * MD3 styled MenuItem component (Layer 3).
 *
 * All MD3 styles are applied directly to the `<li role="menuitem">` element via
 * RAC's render-prop className. React Aria automatically sets data-hovered,
 * data-pressed, data-focus-visible, data-selected, and data-disabled on the
 * element — these are consumed by group-data-[x]/menuitem selectors in the
 * slot variants (state-layer, icon, label, trailing text, description).
 *
 * The root carries `group/menuitem` so all child slots can read the item's
 * interaction state without prop drilling.
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
  // We only need the render-prop to read isSelected for the checkmark slot —
  // all state-driven styling is handled by data-* attributes + group-data selectors.
  const computeClassName = ({ isSelected }: MenuItemRenderProps): string =>
    cn(
      menuItemVariants({ colorScheme, menuStyle }),
      // group/menuitem scope: all slot children read state via group-data-[x]/menuitem
      "group/menuitem",
      // Height: auto when description is present (multi-line), otherwise density
      description ? "min-h-12 py-2 h-auto items-start" : heightClass,
      // Store isSelected on dataset so the render-prop return value is used for
      // the checkmark slot below — actual selection styling comes from RAC's
      // own data-selected attribute that it emits automatically.
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
          {/* ── Highlight layer (selected background) ─────────────────── */}
          {/* Sits at z-0, below state layer and content. Geometry is
              menuStyle-aware: baseline=full-bleed, vertical=inset-1 rounded-lg */}
          <span
            aria-hidden="true"
            data-testid="menuitem-highlight"
            className={menuItemHighlightVariants({ colorScheme, menuStyle })}
          />

          {/* ── State layer slot ──────────────────────────────────────── */}
          {/* z-[1]: above highlight, below content. Opacity driven by
              group-data-[hovered/pressed/focus-visible]/menuitem. */}
          <span
            aria-hidden="true"
            className={menuItemStateLayerVariants({ colorScheme, menuStyle })}
          />

          {/* ── Ripple container ──────────────────────────────────────── */}
          {!disableRipple && (
            <span
              className={cn(
                "pointer-events-none absolute z-[2] overflow-hidden",
                menuStyle === "vertical"
                  ? "inset-x-1 inset-y-0 rounded-md"
                  : "inset-0 rounded-[inherit]"
              )}
            >
              {ripples}
            </span>
          )}

          {/* ── Leading icon or checkmark slot ────────────────────────── */}
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

          {/* ── Text content area ─────────────────────────────────────── */}
          {description != null ? (
            <span className="relative z-10 flex min-w-0 flex-1 flex-col">
              <span className="text-label-large group-data-[disabled]/menuitem:text-on-surface/38">
                {children}
              </span>
              <span className={menuItemDescriptionVariants()}>{description}</span>
            </span>
          ) : (
            <span className="text-label-large group-data-[disabled]/menuitem:text-on-surface/38 relative z-10 min-w-0 flex-1">
              {children}
            </span>
          )}

          {/* ── Badge slot ────────────────────────────────────────────── */}
          {badge != null && <span className="relative z-10 shrink-0">{badge}</span>}

          {/* ── Trailing icon ─────────────────────────────────────────── */}
          {trailingIcon != null && trailingText == null && (
            <span
              className={cn(menuItemIconVariants({ colorScheme, menuStyle }), "ml-auto")}
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
