"use client";

import { forwardRef } from "react";
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
 * <ButtonGroup variant="standard" size="md" aria-label="Quick settings">
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
      size = "md",
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
    // Development warnings
    if (process.env.NODE_ENV === "development") {
      // Scan children for disallowed variants
      const childArray = Array.isArray(children) ? children : [children];

      for (const child of childArray) {
        if (!child || typeof child !== "object" || !("props" in (child as object))) continue;

        const childEl = child as React.ReactElement<{
          "data-variant"?: string;
        }>;

        const dataVariant = childEl.props["data-variant"];
        if (dataVariant === "text" || dataVariant === "icon") {
          console.warn(
            "[ButtonGroup] text or icon variant buttons are not recommended inside a ButtonGroup.",
            `Found child with data-variant="${dataVariant}". Use filled, tonal, or outlined buttons instead.`
          );
        }
      }
    }

    return (
      <ButtonGroupHeadless
        {...htmlProps}
        ref={ref}
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
