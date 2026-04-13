import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Checkbox component with checked, unchecked, and indeterminate states. Supports full accessibility and form integration.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isSelected: {
      control: "boolean",
      description: "Controlled checked state",
    },
    defaultSelected: {
      control: "boolean",
      description: "Default checked state (uncontrolled)",
    },
    isIndeterminate: {
      control: "boolean",
      description: "Indeterminate state (partial selection)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the checkbox",
    },
    isInvalid: {
      control: "boolean",
      description: "Error/invalid state",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable ripple effect",
    },
    children: {
      control: "text",
      description: "Label text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Default Story
export const Default: Story = {
  args: {
    children: "Accept terms and conditions",
  },
};

// Unchecked State
export const Unchecked: Story = {
  args: {
    children: "Unchecked checkbox",
    isSelected: false,
  },
};

// Checked State
export const Checked: Story = {
  args: {
    children: "Checked checkbox",
    isSelected: true,
  },
};

// Indeterminate State
export const Indeterminate: Story = {
  args: {
    children: "Select all items",
    isIndeterminate: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Indeterminate state represents partial selection, commonly used for 'select all' checkboxes when some but not all items are selected.",
      },
    },
  },
};

// Error State
export const Error: Story = {
  args: {
    children: "You must accept the terms",
    isInvalid: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Error state indicates validation failure or required field not checked.",
      },
    },
  },
};

// Disabled States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox isDisabled>Disabled unchecked</Checkbox>
      <Checkbox isDisabled isSelected>
        Disabled checked
      </Checkbox>
      <Checkbox isDisabled isIndeterminate>
        Disabled indeterminate
      </Checkbox>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Disabled checkboxes cannot be interacted with and have reduced opacity.",
      },
    },
  },
};

// Without Label (Icon Only)
export const WithoutLabel: Story = {
  args: {
    "aria-label": "Accept terms",
  },
  parameters: {
    docs: {
      description: {
        story: "Checkboxes without visible labels must have an aria-label for accessibility.",
      },
    },
  },
};

// Controlled Example
export const Controlled: Story = {
  render: function ControlledRender() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Checkbox isSelected={checked} onChange={setChecked}>
          Controlled checkbox
        </Checkbox>
        <p className="text-on-surface-variant text-sm">
          Status: {checked ? "Checked" : "Unchecked"}
        </p>
        <button
          type="button"
          className="bg-primary text-on-primary rounded px-4 py-2 text-sm"
          onClick={() => setChecked(!checked)}
        >
          Toggle from outside
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Controlled checkbox with external state management. The checkbox state can be changed programmatically.",
      },
    },
  },
};

// Uncontrolled Example
export const Uncontrolled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox defaultSelected>Default checked</Checkbox>
      <Checkbox>Default unchecked</Checkbox>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Uncontrolled checkbox manages its own state. Use defaultSelected to set initial state.",
      },
    },
  },
};

// Form Integration
export const FormIntegration: Story = {
  render: function FormIntegrationRender() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData);
      alert(`Form submitted:\n${JSON.stringify(values, null, 2)}`);
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Checkbox name="newsletter" value="subscribe" defaultSelected>
          Subscribe to newsletter
        </Checkbox>
        <Checkbox name="terms" value="accepted">
          Accept terms and conditions
        </Checkbox>
        <Checkbox name="privacy" value="accepted">
          Accept privacy policy
        </Checkbox>
        <button type="submit" className="bg-primary text-on-primary rounded px-4 py-2 text-sm">
          Submit
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Checkboxes integrate seamlessly with HTML forms using name and value props.",
      },
    },
  },
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-on-surface text-sm font-medium">Normal</h3>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox isSelected>Checked</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-on-surface text-sm font-medium">Error</h3>
        <Checkbox isInvalid>Unchecked error</Checkbox>
        <Checkbox isInvalid isSelected>
          Checked error
        </Checkbox>
        <Checkbox isInvalid isIndeterminate>
          Indeterminate error
        </Checkbox>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-on-surface text-sm font-medium">Disabled</h3>
        <Checkbox isDisabled>Unchecked disabled</Checkbox>
        <Checkbox isDisabled isSelected>
          Checked disabled
        </Checkbox>
        <Checkbox isDisabled isIndeterminate>
          Indeterminate disabled
        </Checkbox>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-on-surface text-sm font-medium">No Ripple</h3>
        <Checkbox disableRipple>No ripple</Checkbox>
        <Checkbox disableRipple isSelected>
          No ripple checked
        </Checkbox>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comprehensive showcase of all checkbox states and variations.",
      },
    },
  },
};

// Indeterminate Parent Example
export const IndeterminateParent: Story = {
  render: function IndeterminateParentRender() {
    const [checkedItems, setCheckedItems] = useState([false, false, false]);

    const allChecked = checkedItems.every(Boolean);
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    const handleParentChange = (value: boolean): void => {
      setCheckedItems([value, value, value]);
    };

    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          isSelected={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={handleParentChange}
        >
          Select all
        </Checkbox>
        <div className="border-outline ml-6 flex flex-col gap-2 border-l-2 pl-4">
          <Checkbox
            isSelected={checkedItems[0] ?? false}
            onChange={(value): void => {
              const newItems = [...checkedItems];
              newItems[0] = value;
              setCheckedItems(newItems);
            }}
          >
            Option 1
          </Checkbox>
          <Checkbox
            isSelected={checkedItems[1] ?? false}
            onChange={(value): void => {
              const newItems = [...checkedItems];
              newItems[1] = value;
              setCheckedItems(newItems);
            }}
          >
            Option 2
          </Checkbox>
          <Checkbox
            isSelected={checkedItems[2] ?? false}
            onChange={(value): void => {
              const newItems = [...checkedItems];
              newItems[2] = value;
              setCheckedItems(newItems);
            }}
          >
            Option 3
          </Checkbox>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Real-world example of parent checkbox with indeterminate state when some children are selected.",
      },
    },
  },
};

// Checkbox List
export const CheckboxList: Story = {
  render: function CheckboxListRender() {
    const [selected, setSelected] = useState<string[]>(["option2"]);

    const handleChange = (option: string, checked: boolean): void => {
      setSelected((prev) => (checked ? [...prev, option] : prev.filter((item) => item !== option)));
    };

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-on-surface text-sm font-medium">Select features</h3>
        <Checkbox
          isSelected={selected.includes("option1")}
          onChange={(checked): void => handleChange("option1", checked)}
        >
          Email notifications
        </Checkbox>
        <Checkbox
          isSelected={selected.includes("option2")}
          onChange={(checked): void => handleChange("option2", checked)}
        >
          SMS notifications
        </Checkbox>
        <Checkbox
          isSelected={selected.includes("option3")}
          onChange={(checked): void => handleChange("option3", checked)}
        >
          Push notifications
        </Checkbox>
        <Checkbox
          isSelected={selected.includes("option4")}
          onChange={(checked): void => handleChange("option4", checked)}
        >
          Weekly digest
        </Checkbox>
        <p className="text-on-surface-variant mt-2 text-xs">
          Selected: {selected.length} option(s)
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Multiple checkboxes for selecting multiple options from a list.",
      },
    },
  },
};

// Accessibility Example
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox aria-label="Checkbox with aria-label only">Icon only checkbox</Checkbox>
      <Checkbox aria-describedby="help-text">
        Checkbox with description
        <span id="help-text" className="text-on-surface-variant ml-2 text-xs">
          (Optional helper text)
        </span>
      </Checkbox>
      <div>
        <Checkbox aria-labelledby="custom-label">Custom label</Checkbox>
        <label id="custom-label" className="text-on-surface-variant ml-8 text-sm">
          This is a custom label element
        </label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates various accessibility features including aria-label, aria-describedby, and aria-labelledby.",
      },
    },
  },
};

// Playground
export const Playground: Story = {
  args: {
    children: "Playground checkbox",
    isSelected: false,
    isIndeterminate: false,
    isDisabled: false,
    isInvalid: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive playground to test all checkbox props and combinations.",
      },
    },
  },
};
