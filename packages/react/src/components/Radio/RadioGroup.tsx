"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { RadioGroupHeadless } from "./RadioGroupHeadless";
import { radioGroupVariants, radioGroupLabelVariants } from "./Radio.variants";
import type { RadioGroupProps } from "./Radio.types";

/**
 * Material Design 3 RadioGroup Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Uses CVA for type-safe variant management.
 * Styled with Tailwind CSS using MD3 design tokens.
 *
 * Features:
 * - ✅ Single-selection behavior
 * - ✅ Horizontal and vertical orientation
 * - ✅ Error/invalid state support
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 * - ✅ Form integration (name, value props)
 *
 * MD3 Specifications:
 * - Radio icon: 20x20dp (within 40x40dp touch target)
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 38% opacity
 * - Radio spacing: 16px gap
 *
 * @example
 * ```tsx
 * // Basic usage (vertical)
 * <RadioGroup label="Favorite color">
 *   <Radio value="red">Red</Radio>
 *   <Radio value="blue">Blue</Radio>
 * </RadioGroup>
 *
 * // Horizontal orientation
 * <RadioGroup label="Size" orientation="horizontal">
 *   <Radio value="s">Small</Radio>
 *   <Radio value="m">Medium</Radio>
 *   <Radio value="l">Large</Radio>
 * </RadioGroup>
 *
 * // Controlled
 * <RadioGroup label="Choice" value={selected} onChange={setSelected}>
 *   <Radio value="a">Option A</Radio>
 *   <Radio value="b">Option B</Radio>
 * </RadioGroup>
 *
 * // Error state
 * <RadioGroup label="Required" isInvalid>
 *   <Radio value="yes">Yes</Radio>
 *   <Radio value="no">No</Radio>
 * </RadioGroup>
 *
 * // Disabled
 * <RadioGroup label="Options" isDisabled>
 *   <Radio value="a">Option A</Radio>
 *   <Radio value="b">Option B</Radio>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      // Content props
      children,

      // State props
      orientation = "vertical",
      isInvalid = false,
      isDisabled = false,

      // Styling
      className,

      // Other props
      ...props
    },
    ref
  ) => {
    // Extract data-testid and other HTML attributes
    const htmlAttrs = props as Record<string, unknown>;
    const dataTestId = htmlAttrs["data-testid"] as string | undefined;

    // Remove HTML attributes from props for React Aria
    const { "data-testid": _dataTestId, ...restPropsWithoutHtmlAttrs } = props as Record<
      string,
      unknown
    >;

    // Development warnings
    if (process.env.NODE_ENV === "development") {
      const ariaProps = restPropsWithoutHtmlAttrs as {
        label?: string;
        "aria-label"?: string;
        "aria-labelledby"?: string;
      };
      if (!ariaProps.label && !ariaProps["aria-label"] && !ariaProps["aria-labelledby"]) {
        console.warn(
          "[RadioGroup] RadioGroup should have a label or aria-label for accessibility."
        );
      }
    }

    return (
      <RadioGroupHeadless
        {...restPropsWithoutHtmlAttrs}
        isDisabled={isDisabled}
        ref={ref}
        className={cn("flex flex-col", className)}
        data-testid={dataTestId}
        renderLabel={(labelProps) => (
          <div
            {...labelProps}
            className={cn(
              radioGroupLabelVariants({
                disabled: isDisabled,
              })
            )}
          >
            {props.label}
          </div>
        )}
      >
        {/* Radio buttons container */}
        <div
          className={cn(
            radioGroupVariants({
              orientation,
              disabled: isDisabled,
            })
          )}
        >
          {children}
        </div>
      </RadioGroupHeadless>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
