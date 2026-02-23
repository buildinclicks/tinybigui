import type React from "react";
import type { AriaSwitchProps } from "react-aria";

/**
 * Material Design 3 Switch Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Represents on/off states (not selection like checkbox).
 * Implementation uses CVA + Tailwind CSS classes mapped to MD3 tokens.
 *
 * @example
 * ```tsx
 * // Controlled switch
 * <Switch isSelected={isOn} onChange={setIsOn}>
 *   Low power mode
 * </Switch>
 *
 * // Uncontrolled with default value
 * <Switch defaultSelected>
 *   Enable notifications
 * </Switch>
 *
 * // With icons
 * <Switch icon={<IconClose />} selectedIcon={<IconCheck />}>
 *   Airplane mode
 * </Switch>
 *
 * // Disabled
 * <Switch isDisabled>
 *   Disabled option
 * </Switch>
 *
 * // Headless version (custom styling)
 * <SwitchHeadless className="my-custom-styles">
 *   Custom switch
 * </SwitchHeadless>
 * ```
 */
export interface SwitchProps
  extends
    AriaSwitchProps,
    Omit<React.HTMLAttributes<HTMLLabelElement>, keyof AriaSwitchProps | "children"> {
  /**
   * Switch label content
   */
  children?: React.ReactNode;

  /**
   * Icon to display inside handle when switch is OFF
   * @default undefined
   */
  icon?: React.ReactNode;

  /**
   * Icon to display inside handle when switch is ON
   * @default undefined
   */
  selectedIcon?: React.ReactNode;

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
 * Props for the headless Switch component
 * Extends AriaSwitchProps for accessibility
 */
export interface SwitchHeadlessProps extends AriaSwitchProps {
  /**
   * Additional CSS classes for the label wrapper
   */
  className?: string;

  /**
   * Switch label content
   */
  children?: React.ReactNode;

  /**
   * Render prop for custom switch visual
   * Receives state information
   */
  renderSwitch?: (state: {
    isSelected: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
    isPressed: boolean;
    isReadOnly: boolean;
  }) => React.ReactNode;
}
