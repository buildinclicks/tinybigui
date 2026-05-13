"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
import type React from "react";
import { ButtonGroupHeadless } from "./ButtonGroupHeadless";
import { buttonGroupVariants } from "./ButtonGroup.variants";
import { cn } from "../../utils/cn";
import type { ButtonGroupProps } from "./ButtonGroup.types";

/**
 * Material Design 3 ButtonGroup Component (Layer 3: Styled)
 *
 * An invisible container that:
 * - Applies MD3-spec gap between child buttons
 * - Manages selection state (single / multi / required) across toggle buttons
 * - Passes shape, size, and variant metadata to children via React Context
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
 * // Controlled multi-select
 * <ButtonGroup
 *   variant="connected"
 *   selectionMode="multi"
 *   selectedValues={selected}
 *   onSelectionChange={setSelected}
 *   aria-label="Text formatting"
 * >
 *   <Button value="bold">Bold</Button>
 *   <Button value="italic">Italic</Button>
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
      children,
      className,
      ...htmlProps
    },
    ref
  ) => {
    // Internal ref used by dev-mode DOM inspection — separate from the forwarded ref
    const containerRef = useRef<HTMLDivElement>(null);

    // Combine the internal ref with the consumer's forwarded ref
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

      // Warning: connected group with no toggle buttons
      const toggleButtons = containerRef.current.querySelectorAll("[aria-pressed]");
      if (toggleButtons.length === 0) {
        console.warn(
          "[ButtonGroup] The `connected` variant is designed for toggle button groups.",
          'None of the child buttons have `aria-pressed`. Use `selectionMode` on the group and ensure children expose `aria-pressed`, or switch to `variant="standard"` for action-only groups.'
        );
      }

      // Warning: connected group with mixed child color styles
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
    }, []); // Run once after mount

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
        className={cn(buttonGroupVariants({ variant, size }), className)}
      >
        {children}
      </ButtonGroupHeadless>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";
