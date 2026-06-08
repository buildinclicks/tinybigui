"use client";

import { forwardRef, useCallback, useEffect, useRef, useMemo } from "react";
import type React from "react";
import { ButtonGroupHeadless } from "./ButtonGroupHeadless";
import { buttonGroupRootVariants } from "./ButtonGroup.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import type { ButtonGroupProps } from "./ButtonGroup.types";

/**
 * Material Design 3 ButtonGroup Component (Layer 3: Styled)
 *
 * Built on the Variants-vs-States architecture: interaction/selection states
 * are expressed as data-* attributes on the root and consumed by child slots
 * via group-data-[x]/button-group Tailwind selectors.
 *
 * An invisible container that:
 * - Applies MD3-spec gap between child buttons with spatial spring transitions
 * - Manages selection state (single / multi / required) across toggle buttons
 * - Passes shape, size, variant, and disabled metadata to children via React Context
 * - Emits container-level state attributes for CSS targeting
 *
 * Container data attributes:
 * - `data-connected`      — variant is "connected"
 * - `data-has-selection`  — at least one child button is selected
 * - `data-selection-mode` — "single" | "required" | "multi"
 * - `data-disabled`       — group is non-interactive (via getInteractionDataAttributes)
 *
 * Variants:
 * - `standard`: Buttons float independently. Gap is larger for xs/sm to preserve
 *   48dp touch targets. Shape morphs transiently on press/select.
 * - `connected`: Buttons are visually joined with a 2dp gap. Only the pressed
 *   button's shape changes; adjacent buttons are unaffected.
 *
 * Selection modes:
 * - `single`: At most one button selected; deselectable.
 * - `required`: Exactly one always selected; pressing the active button is a no-op.
 * - `multi`: Any number of buttons selected simultaneously.
 *
 * Motion:
 * - Gap transitions use spring-standard-fast-spatial (350ms) for smooth layout changes
 * - Border-radius morphing on child buttons uses expressive-fast-spatial (350ms, overshoot)
 * - Color/opacity effects on children use spring-standard-fast-effects (150ms, no overshoot)
 *
 * @example
 * ```tsx
 * // Standard icon-button group (no selection management)
 * <ButtonGroup variant="standard" size="medium" aria-label="Quick settings">
 *   <IconButton aria-label="Bluetooth"><BluetoothIcon /></IconButton>
 *   <IconButton aria-label="Alarm"><AlarmIcon /></IconButton>
 * </ButtonGroup>
 *
 * // Connected size-picker — required single selection
 * <ButtonGroup
 *   variant="connected"
 *   selectionMode="required"
 *   defaultValue="8oz"
 *   aria-label="Drink size"
 * >
 *   <Button value="8oz">8 oz</Button>
 *   <Button value="12oz">12 oz</Button>
 *   <Button value="16oz">16 oz</Button>
 * </ButtonGroup>
 *
 * // Disabled group
 * <ButtonGroup variant="connected" isDisabled aria-label="Unavailable options">
 *   <Button value="a">A</Button>
 *   <Button value="b">B</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      variant = "standard",
      size = "medium",
      shape = "round",
      selectionMode,
      selectedValues,
      onSelectionChange,
      defaultValue,
      isDisabled = false,
      children,
      className,
      ...htmlProps
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleRef = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref !== null) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Compute whether the group has any active selection
    const hasSelection = useMemo(() => {
      if (selectedValues) return selectedValues.size > 0;
      if (defaultValue) {
        return Array.isArray(defaultValue) ? defaultValue.length > 0 : true;
      }
      return false;
    }, [selectedValues, defaultValue]);

    // Development warnings — synchronous child-prop scan
    if (process.env.NODE_ENV === "development") {
      const childArray = Array.isArray(children) ? children : [children];

      for (const child of childArray) {
        if (!child || typeof child !== "object" || !("props" in (child as object))) continue;

        const childEl = child as React.ReactElement<{
          "data-variant"?: string;
        }>;

        const dataVariant = childEl.props["data-variant"];
        if (dataVariant === "text" || dataVariant === "icon" || dataVariant === "standard") {
          console.warn(
            "[ButtonGroup] text, icon, or standard variant buttons are not recommended inside a ButtonGroup.",
            `Found child with data-variant="${dataVariant}". Use filled, tonal, or outlined buttons instead.`
          );
        }
      }
    }

    // Development warnings — DOM inspection after mount (async, needs rendered DOM)
    useEffect(() => {
      if (process.env.NODE_ENV !== "development") return;
      if (variant !== "connected" || !containerRef.current) return;

      const toggleButtons = containerRef.current.querySelectorAll("[aria-pressed]");
      if (toggleButtons.length === 0) {
        console.warn(
          "[ButtonGroup] The `connected` variant is designed for toggle button groups.",
          'None of the child buttons have `aria-pressed`. Use `selectionMode` on the group and ensure children expose `aria-pressed`, or switch to `variant="standard"` for action-only groups.'
        );
      }

      const colorValues = new Set<string>();
      containerRef.current.querySelectorAll("[data-color]").forEach((el) => {
        const c = el.getAttribute("data-color");
        if (c) colorValues.add(c);
      });
      if (colorValues.size > 1) {
        console.warn(
          "[ButtonGroup] Mixing color styles inside a `connected` group is not recommended.",
          `Found buttons with different data-color values: ${[...colorValues].join(", ")}. Use the same color style for all buttons in a connected group.`
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <ButtonGroupHeadless
        {...htmlProps}
        ref={handleRef}
        variant={variant}
        size={size}
        shape={shape}
        selectionMode={selectionMode}
        selectedValues={selectedValues}
        onSelectionChange={onSelectionChange}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        className={cn(buttonGroupRootVariants({ variant, size }), "group/button-group", className)}
        // ── Interaction data attributes (from component state) ─────────────
        {...getInteractionDataAttributes({ isDisabled })}
        // ── Container state attributes (describe group-level state) ────────
        data-connected={variant === "connected" ? "" : undefined}
        data-has-selection={hasSelection ? "" : undefined}
        data-selection-mode={selectionMode ?? undefined}
      >
        {children}
      </ButtonGroupHeadless>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";
