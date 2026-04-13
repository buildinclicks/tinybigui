import type React from "react";
import type { AriaRadioProps, AriaRadioGroupProps } from "react-aria";

/**
 * Material Design 3 RadioGroup Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Groups radio buttons together for single-selection behavior.
 * Implementation uses CVA + Tailwind CSS classes mapped to MD3 tokens.
 *
 * @example
 * ```tsx
 * // Vertical group (default)
 * <RadioGroup label="Favorite color">
 *   <Radio value="red">Red</Radio>
 *   <Radio value="blue">Blue</Radio>
 *   <Radio value="green">Green</Radio>
 * </RadioGroup>
 *
 * // Horizontal group
 * <RadioGroup label="Size" orientation="horizontal">
 *   <Radio value="small">Small</Radio>
 *   <Radio value="medium">Medium</Radio>
 *   <Radio value="large">Large</Radio>
 * </RadioGroup>
 *
 * // Controlled
 * <RadioGroup label="Choice" value={selected} onChange={setSelected}>
 *   <Radio value="option1">Option 1</Radio>
 *   <Radio value="option2">Option 2</Radio>
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
export interface RadioGroupProps
  extends
    AriaRadioGroupProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, keyof AriaRadioGroupProps | "children"> {
  /**
   * Radio buttons to display in the group
   */
  children: React.ReactNode;

  /**
   * Layout orientation of the radio group
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Error/invalid state
   * Shows error styling (typically red)
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Additional CSS classes (Tailwind)
   */
  className?: string;
}

/**
 * Material Design 3 Radio Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Must be used within a RadioGroup for proper functionality.
 * Implementation uses CVA + Tailwind CSS classes mapped to MD3 tokens.
 *
 * @example
 * ```tsx
 * // Basic usage within RadioGroup
 * <RadioGroup label="Options">
 *   <Radio value="option1">Option 1</Radio>
 *   <Radio value="option2">Option 2</Radio>
 * </RadioGroup>
 *
 * // Without label (icon-only) - needs aria-label
 * <RadioGroup label="Options">
 *   <Radio value="a" aria-label="Option A" />
 *   <Radio value="b" aria-label="Option B" />
 * </RadioGroup>
 *
 * // Disabled individual radio
 * <RadioGroup label="Options">
 *   <Radio value="enabled">Enabled</Radio>
 *   <Radio value="disabled" isDisabled>Disabled</Radio>
 * </RadioGroup>
 *
 * // Custom styling
 * <Radio value="custom" className="my-custom-class">
 *   Custom
 * </Radio>
 * ```
 */
export interface RadioProps
  extends
    AriaRadioProps,
    Omit<React.HTMLAttributes<HTMLLabelElement>, keyof AriaRadioProps | "children"> {
  /**
   * Radio label content
   */
  children?: React.ReactNode;

  /**
   * Disable ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional CSS classes (Tailwind)
   */
  className?: string;
}

/**
 * Props for the headless RadioGroup component
 * Extends AriaRadioGroupProps for accessibility
 */
export interface RadioGroupHeadlessProps extends AriaRadioGroupProps {
  /**
   * Additional CSS classes for the group wrapper
   */
  className?: string;

  /**
   * Radio buttons to display in the group
   */
  children: React.ReactNode;

  /**
   * Render slot for the group label.
   * Receives React Aria's `labelProps` (contains the generated `id` for
   * `aria-labelledby` association) so the consumer can render a styled
   * label element while preserving correct ARIA semantics.
   *
   * When provided, the default `<span {...labelProps}>` is suppressed and
   * this callback is responsible for rendering the label.
   *
   * @example
   * ```tsx
   * <RadioGroupHeadless
   *   label="Pick one"
   *   renderLabel={(labelProps) => (
   *     <div {...labelProps} className="my-label-style">Pick one</div>
   *   )}
   * >
   *   ...
   * </RadioGroupHeadless>
   * ```
   */
  renderLabel?: (labelProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
}

/**
 * Props for the headless Radio component
 * Extends AriaRadioProps for accessibility
 */
export interface RadioHeadlessProps extends AriaRadioProps {
  /**
   * Additional CSS classes for the label wrapper
   */
  className?: string;

  /**
   * Radio label content
   */
  children?: React.ReactNode;

  /**
   * Render prop for custom radio visual
   * Receives state information
   */
  renderRadio?: (state: {
    isSelected: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
    isPressed: boolean;
  }) => React.ReactNode;
}
