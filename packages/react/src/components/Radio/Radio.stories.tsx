import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio, RadioGroup } from "./index";

/**
 * Material Design 3 Radio Button Component
 *
 * Radio buttons allow users to select a single option from a set of options.
 * They are typically used in forms where only one choice can be selected at a time.
 *
 * ## Features
 * - ✅ Material Design 3 styling
 * - ✅ Full keyboard accessibility (Arrow keys, Tab, Space)
 * - ✅ Screen reader support
 * - ✅ Horizontal and vertical orientation
 * - ✅ Disabled state support
 * - ✅ Error/invalid state
 * - ✅ Ripple effect (Material Design)
 * - ✅ Form integration
 *
 * ## Usage
 *
 * Radio buttons must be used within a RadioGroup for proper functionality.
 * Only one radio can be selected at a time within a group.
 *
 * @see [Material Design 3 - Radio Button](https://m3.material.io/components/radio-button)
 * @see [React Aria - useRadioGroup](https://react-spectrum.adobe.com/react-aria/useRadioGroup.html)
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Radio buttons let people select one option from a set of options. Built with React Aria for world-class accessibility.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label for the radio group",
      table: {
        type: { summary: "string" },
      },
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Layout orientation of the radio group",
      table: {
        type: { summary: "vertical | horizontal" },
        defaultValue: { summary: "vertical" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the radio group is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isInvalid: {
      control: "boolean",
      description: "Whether the radio group is in an error/invalid state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isRequired: {
      control: "boolean",
      description: "Whether the radio group is required",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/**
 * Default vertical radio group with three options
 */
export const Default: Story = {
  render: () => (
    <RadioGroup label="Favorite color">
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
      <Radio value="green">Green</Radio>
    </RadioGroup>
  ),
};

/**
 * Vertical orientation (default layout)
 */
export const Vertical: Story = {
  render: () => (
    <RadioGroup label="Choose your size" orientation="vertical">
      <Radio value="small">Small</Radio>
      <Radio value="medium">Medium</Radio>
      <Radio value="large">Large</Radio>
      <Radio value="xlarge">Extra Large</Radio>
    </RadioGroup>
  ),
};

/**
 * Horizontal orientation for compact layouts
 */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup label="Select a rating" orientation="horizontal">
      <Radio value="1">1 star</Radio>
      <Radio value="2">2 stars</Radio>
      <Radio value="3">3 stars</Radio>
      <Radio value="4">4 stars</Radio>
      <Radio value="5">5 stars</Radio>
    </RadioGroup>
  ),
};

/**
 * Radio group with a default selected value
 */
export const DefaultSelected: Story = {
  render: () => (
    <RadioGroup label="Shipping method" defaultValue="standard">
      <Radio value="express">Express (2-3 days)</Radio>
      <Radio value="standard">Standard (5-7 days)</Radio>
      <Radio value="economy">Economy (10-14 days)</Radio>
    </RadioGroup>
  ),
};

/**
 * Disabled radio group - all radios are disabled
 */
export const DisabledGroup: Story = {
  render: () => (
    <RadioGroup label="Unavailable options" isDisabled defaultValue="option2">
      <Radio value="option1">Option 1 (Disabled)</Radio>
      <Radio value="option2">Option 2 (Disabled, Selected)</Radio>
      <Radio value="option3">Option 3 (Disabled)</Radio>
    </RadioGroup>
  ),
};

/**
 * Individual disabled radios within an enabled group
 */
export const IndividualDisabled: Story = {
  render: () => (
    <RadioGroup label="Product options">
      <Radio value="basic">Basic</Radio>
      <Radio value="premium" isDisabled>
        Premium (Out of stock)
      </Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </RadioGroup>
  ),
};

/**
 * Error/invalid state for validation feedback
 */
export const ErrorState: Story = {
  render: () => (
    <div className="space-y-2">
      <RadioGroup label="Terms and conditions (Required)" isInvalid isRequired>
        <Radio value="accept">I accept the terms</Radio>
        <Radio value="decline">I decline</Radio>
      </RadioGroup>
      <p className="text-error text-sm">Please accept the terms to continue</p>
    </div>
  ),
};

/**
 * Required radio group with validation
 */
export const Required: Story = {
  render: () => (
    <RadioGroup label="Gender (Required)" isRequired>
      <Radio value="male">Male</Radio>
      <Radio value="female">Female</Radio>
      <Radio value="other">Other</Radio>
      <Radio value="prefer-not-to-say">Prefer not to say</Radio>
    </RadioGroup>
  ),
};

/**
 * All orientations side by side
 */
export const AllOrientations: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <RadioGroup label="Vertical (Default)" orientation="vertical">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>

      <RadioGroup label="Horizontal" orientation="horizontal">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>
    </div>
  ),
};

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
  render: function InteractiveExample() {
    const [selectedColor, setSelectedColor] = useState("blue");
    const [selectedSize, setSelectedSize] = useState("medium");

    return (
      <div className="flex min-w-[300px] flex-col gap-8">
        <RadioGroup
          label="Choose your favorite color"
          value={selectedColor}
          onChange={setSelectedColor}
        >
          <Radio value="red">Red</Radio>
          <Radio value="blue">Blue</Radio>
          <Radio value="green">Green</Radio>
          <Radio value="yellow">Yellow</Radio>
        </RadioGroup>

        <RadioGroup
          label="Select size"
          orientation="horizontal"
          value={selectedSize}
          onChange={setSelectedSize}
        >
          <Radio value="small">S</Radio>
          <Radio value="medium">M</Radio>
          <Radio value="large">L</Radio>
          <Radio value="xlarge">XL</Radio>
        </RadioGroup>

        <div className="bg-surface-container-low mt-4 rounded-lg p-4">
          <p className="text-on-surface text-sm font-medium">Selection:</p>
          <p className="text-on-surface-variant text-sm">
            Color: <strong>{selectedColor}</strong>
          </p>
          <p className="text-on-surface-variant text-sm">
            Size: <strong>{selectedSize}</strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Form integration example with submission
 */
export const FormIntegration: Story = {
  render: function FormExample() {
    const [submittedData, setSubmittedData] = useState<Record<string, string> | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries()) as Record<string, string>;
      setSubmittedData(data);
    };

    return (
      <form onSubmit={handleSubmit} className="flex min-w-[400px] flex-col gap-6">
        <RadioGroup label="Delivery method" name="delivery" defaultValue="pickup" isRequired>
          <Radio value="delivery">Home delivery ($5.99)</Radio>
          <Radio value="pickup">Store pickup (Free)</Radio>
          <Radio value="express">Express delivery ($12.99)</Radio>
        </RadioGroup>

        <RadioGroup label="Payment method" name="payment" isRequired>
          <Radio value="credit">Credit card</Radio>
          <Radio value="debit">Debit card</Radio>
          <Radio value="paypal">PayPal</Radio>
          <Radio value="cash">Cash on delivery</Radio>
        </RadioGroup>

        <button
          type="submit"
          className="bg-primary text-on-primary hover:bg-primary/90 rounded-full px-6 py-3 font-medium transition-colors"
        >
          Submit Order
        </button>

        {submittedData && (
          <div className="bg-surface-container-low mt-4 rounded-lg p-4">
            <p className="text-on-surface mb-2 text-sm font-medium">Submitted Data:</p>
            <pre className="text-on-surface-variant text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </form>
    );
  },
};

/**
 * Accessibility demonstration with keyboard navigation
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex min-w-[500px] flex-col gap-6">
      <div className="bg-surface-container-low rounded-lg p-4">
        <h3 className="text-on-surface mb-2 text-sm font-medium">Keyboard Navigation:</h3>
        <ul className="text-on-surface-variant space-y-1 text-sm">
          <li>
            <kbd className="bg-surface-container rounded px-2 py-1 text-xs">Tab</kbd> - Navigate to
            the radio group
          </li>
          <li>
            <kbd className="bg-surface-container rounded px-2 py-1 text-xs">Arrow Keys</kbd> -
            Navigate between radios and select
          </li>
          <li>
            <kbd className="bg-surface-container rounded px-2 py-1 text-xs">Space</kbd> - Select
            focused radio
          </li>
        </ul>
      </div>

      <RadioGroup
        label="Try keyboard navigation"
        aria-describedby="radio-help"
        defaultValue="option2"
      >
        <Radio value="option1">First option</Radio>
        <Radio value="option2">Second option (Pre-selected)</Radio>
        <Radio value="option3">Third option</Radio>
        <Radio value="option4" isDisabled>
          Fourth option (Disabled)
        </Radio>
      </RadioGroup>

      <p id="radio-help" className="text-on-surface-variant text-sm">
        This radio group demonstrates full keyboard accessibility and ARIA support for screen
        readers.
      </p>
    </div>
  ),
};

/**
 * Radio buttons without labels (icon-only) - requires aria-label
 */
export const WithoutLabels: Story = {
  render: () => (
    <RadioGroup label="Alignment" orientation="horizontal">
      <Radio value="left" aria-label="Align left">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M2 3h14v2H2V3zm0 4h10v2H2V7zm0 4h14v2H2v-2zm0 4h10v2H2v-2z" />
        </svg>
      </Radio>
      <Radio value="center" aria-label="Align center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M2 3h14v2H2V3zm2 4h10v2H4V7zm-2 4h14v2H2v-2zm2 4h10v2H4v-2z" />
        </svg>
      </Radio>
      <Radio value="right" aria-label="Align right">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M2 3h14v2H2V3zm4 4h10v2H6V7zm-4 4h14v2H2v-2zm4 4h10v2H6v-2z" />
        </svg>
      </Radio>
    </RadioGroup>
  ),
};

/**
 * Complex real-world example
 */
export const ComplexExample: Story = {
  render: function ComplexExample() {
    const [plan, setPlan] = useState("pro");

    const plans = [
      {
        value: "free",
        name: "Free",
        price: "$0/month",
        features: ["1 project", "5 team members", "Basic support"],
      },
      {
        value: "pro",
        name: "Pro",
        price: "$29/month",
        features: ["Unlimited projects", "20 team members", "Priority support"],
      },
      {
        value: "enterprise",
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited everything", "Advanced security", "24/7 support"],
      },
    ];

    return (
      <div className="min-w-[500px]">
        <RadioGroup label="Choose your plan" value={plan} onChange={setPlan}>
          {plans.map((planItem) => (
            <Radio key={planItem.value} value={planItem.value}>
              <div className="flex items-start gap-2">
                <div>
                  <div className="text-on-surface font-medium">{planItem.name}</div>
                  <div className="text-primary text-sm font-semibold">{planItem.price}</div>
                  <ul className="text-on-surface-variant mt-1 space-y-1 text-sm">
                    {planItem.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    );
  },
};

/**
 * Playground for interactive testing
 */
export const Playground: Story = {
  args: {
    label: "Choose an option",
    orientation: "vertical",
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
};
