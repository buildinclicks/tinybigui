/**
 * TextField Component Stories
 *
 * Storybook stories for the Material Design 3 Expressive TextField component.
 * Demonstrates filled and outlined variants, all interaction states, icons,
 * prefix/suffix affixes, multiline, and character counter.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "./TextField";

// ── Icon helpers ──────────────────────────────────────────────────────────────

const IconEmail = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconSearch = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const IconPerson = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const IconVisibility = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconClear = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const IconAttachMoney = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Expressive TextField — single 56dp height, filled and outlined variants, state layer, active indicator, notched outline, floating label, prefix/suffix, icons, and supporting text + counter row. All interaction states are data-* attribute driven (no state in CVA).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined"],
      description: "MD3 visual variant",
    },
    label: {
      control: "text",
      description: "Label text (floats on focus/value)",
    },
    description: {
      control: "text",
      description: "Supporting text below the field",
    },
    errorMessage: {
      control: "text",
      description: "Error message when invalid",
    },
    prefix: {
      control: "text",
      description: "Inline prefix text (visible when label is floated)",
    },
    suffix: {
      control: "text",
      description: "Inline suffix text (visible when label is floated)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the input",
    },
    isRequired: {
      control: "boolean",
      description: "Mark as required field",
    },
    isInvalid: {
      control: "boolean",
      description: "Show error state",
    },
    fullWidth: {
      control: "boolean",
      description: "Expand to fill container",
    },
    multiline: {
      control: "boolean",
      description: "Enable multiline (textarea)",
    },
    characterCount: {
      control: "boolean",
      description: "Show character counter (requires maxLength)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "email@example.com",
    variant: "filled",
  },
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Filled: Story = {
  args: {
    label: "Email",
    variant: "filled",
    placeholder: "email@example.com",
  },
};

export const Outlined: Story = {
  args: {
    label: "Email",
    variant: "outlined",
    placeholder: "email@example.com",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField label="Filled (default)" variant="filled" placeholder="Enter text" />
      <TextField label="Outlined" variant="outlined" placeholder="Enter text" />
    </div>
  ),
};

// ── States side-by-side ───────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6" style={{ width: 680 }}>
      <p className="text-label-large text-on-surface-variant col-span-2">Filled</p>
      <TextField label="Default" variant="filled" />
      <TextField label="With value" variant="filled" defaultValue="Hello world" />
      <TextField label="With description" variant="filled" description="Supporting text" />
      <TextField
        label="Error state"
        variant="filled"
        isInvalid
        errorMessage="This field is required"
      />
      <TextField label="Disabled" variant="filled" isDisabled defaultValue="Disabled" />
      <TextField label="Read-only" variant="filled" isReadOnly defaultValue="Read only" />

      <p className="text-label-large text-on-surface-variant col-span-2 mt-4">Outlined</p>
      <TextField label="Default" variant="outlined" />
      <TextField label="With value" variant="outlined" defaultValue="Hello world" />
      <TextField label="With description" variant="outlined" description="Supporting text" />
      <TextField
        label="Error state"
        variant="outlined"
        isInvalid
        errorMessage="This field is required"
      />
      <TextField label="Disabled" variant="outlined" isDisabled defaultValue="Disabled" />
      <TextField label="Read-only" variant="outlined" isReadOnly defaultValue="Read only" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All six states for both variants rendered side by side.",
      },
    },
  },
};

// ── Helper text & errors ──────────────────────────────────────────────────────

export const WithHelperText: Story = {
  args: {
    label: "Email",
    description: "We'll never share your email with anyone else",
    placeholder: "email@example.com",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    errorMessage: "Please enter a valid email address",
    isInvalid: true,
    defaultValue: "invalid-email",
  },
};

export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField
        label="Required field"
        errorMessage="This field is required"
        isInvalid
        variant="filled"
      />
      <TextField
        label="Invalid email"
        errorMessage="Please enter a valid email address"
        isInvalid
        variant="outlined"
        defaultValue="invalid@"
      />
    </div>
  ),
};

// ── Icons ─────────────────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  args: {
    label: "Email",
    leadingIcon: <IconEmail />,
    placeholder: "email@example.com",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: "Password",
    trailingIcon: <IconVisibility />,
    type: "password",
    placeholder: "Enter password",
  },
};

export const WithBothIcons: Story = {
  args: {
    label: "Search",
    leadingIcon: <IconSearch />,
    trailingIcon: <IconClear />,
    placeholder: "Search...",
  },
};

export const IconExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField label="Email" leadingIcon={<IconEmail />} placeholder="email@example.com" />
      <TextField label="Username" leadingIcon={<IconPerson />} placeholder="username" />
      <TextField
        label="Search"
        leadingIcon={<IconSearch />}
        trailingIcon={<IconClear />}
        placeholder="Type to search..."
      />
      <TextField
        label="Outlined with icon"
        variant="outlined"
        leadingIcon={<IconEmail />}
        placeholder="email@example.com"
      />
    </div>
  ),
};

// ── Prefix & Suffix ───────────────────────────────────────────────────────────

export const WithPrefix: Story = {
  args: {
    label: "Price",
    prefix: "$",
    placeholder: "0.00",
  },
};

export const WithSuffix: Story = {
  args: {
    label: "Weight",
    suffix: "kg",
    placeholder: "0",
  },
};

export const PrefixSuffixExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField
        label="Price"
        prefix="$"
        suffix="USD"
        leadingIcon={<IconAttachMoney />}
        placeholder="0.00"
        variant="filled"
      />
      <TextField
        label="Website"
        prefix="https://"
        suffix=".com"
        placeholder="example"
        variant="outlined"
      />
      <TextField label="Rate" suffix="%" placeholder="0" type="number" variant="filled" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Prefix and suffix text are only visible when the label has floated (on focus, with a value, placeholder, or a prefix). Prefix also automatically triggers float.",
      },
    },
  },
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField
        label="Disabled filled"
        variant="filled"
        isDisabled
        defaultValue="Disabled value"
      />
      <TextField
        label="Disabled outlined"
        variant="outlined"
        isDisabled
        defaultValue="Disabled value"
      />
      <TextField
        label="Disabled with icon"
        leadingIcon={<IconEmail />}
        isDisabled
        placeholder="Disabled"
      />
    </div>
  ),
};

// ── Required ──────────────────────────────────────────────────────────────────

export const RequiredField: Story = {
  args: {
    label: "Email",
    isRequired: true,
    description: "This field is required",
    placeholder: "email@example.com",
  },
};

// ── Full width ────────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  args: {
    label: "Full width input",
    fullWidth: true,
    placeholder: "This input spans the full width",
  },
  parameters: {
    layout: "padded",
  },
};

// ── Multiline ─────────────────────────────────────────────────────────────────

export const Multiline: Story = {
  args: {
    label: "Message",
    multiline: true,
    rows: 4,
    placeholder: "Enter your message...",
  },
};

export const MultilineExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField label="Short message" multiline rows={3} placeholder="Enter text..." />
      <TextField label="Long message" multiline rows={6} placeholder="Enter longer text..." />
      <TextField
        label="With description"
        multiline
        rows={4}
        description="Maximum 500 characters"
        placeholder="Enter your bio..."
        variant="outlined"
      />
    </div>
  ),
};

// ── Character counter ─────────────────────────────────────────────────────────

export const WithCharacterCounter: Story = {
  args: {
    label: "Bio",
    description: "Tell us about yourself",
    characterCount: true,
    maxLength: 100,
    placeholder: "Enter your bio...",
  },
};

export const CharacterCounterExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField
        label="Short text"
        characterCount
        maxLength={50}
        description="Supporting text + counter on one row"
        placeholder="Max 50 characters"
      />
      <TextField
        label="Counter only (no description)"
        characterCount
        maxLength={50}
        placeholder="Max 50 characters"
      />
      <TextField
        label="Bio"
        multiline
        rows={4}
        characterCount
        maxLength={200}
        description="Tell us about yourself"
        placeholder="Max 200 characters"
        variant="outlined"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Supporting text and the character counter live on the same flex row below the field, per MD3 spec. The counter turns error-colored when the limit is exceeded.",
      },
    },
  },
};

// ── Interactive ───────────────────────────────────────────────────────────────

const InteractiveExample = (): React.ReactElement => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleChange = (newValue: string): void => {
    setValue(newValue);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(newValue) || newValue === "");
  };

  return (
    <div className="flex flex-col items-center gap-4" style={{ width: 320 }}>
      <TextField
        label="Email"
        value={value}
        onChange={handleChange}
        isInvalid={!isValid}
        {...(!isValid && { errorMessage: "Please enter a valid email" })}
        leadingIcon={<IconEmail />}
        placeholder="email@example.com"
        description="Enter your email address"
        fullWidth
      />
      <div className="text-on-surface-variant text-body-small">
        Value: <code>{value || "(empty)"}</code>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
  parameters: {
    docs: {
      description: {
        story: "Live validation — watch the label float, error state, and state layer respond.",
      },
    },
  },
};

// ── Accessibility showcase ────────────────────────────────────────────────────

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField
        label="With visible label"
        description="Screen readers announce the label"
        placeholder="Type here..."
      />
      <TextField
        aria-label="Search products"
        placeholder="Search..."
        leadingIcon={<IconSearch />}
      />
      <TextField
        label="Required field"
        isRequired
        description="Required fields are announced to screen readers"
      />
      <TextField
        label="Invalid field"
        isInvalid
        errorMessage="Error messages are linked via aria-describedby"
        defaultValue="invalid"
      />
      <TextField
        label="Outlined with notch"
        variant="outlined"
        description="The fieldset/legend notch is aria-hidden — only the visible label is announced"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All inputs have proper ARIA attributes from React Aria. The outlined fieldset/legend notch is aria-hidden so it does not interfere with screen readers.",
      },
    },
  },
};

// ── Form integration ──────────────────────────────────────────────────────────

const FormExample = (): React.ReactElement => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    bio: "",
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        leadingIcon={<IconEmail />}
        isRequired
        description="We'll never share your email"
      />
      <TextField
        label="Username"
        value={formData.username}
        onChange={(value) => setFormData({ ...formData, username: value })}
        leadingIcon={<IconPerson />}
        isRequired
        description="Choose a unique username"
      />
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(value) => setFormData({ ...formData, password: value })}
        trailingIcon={<IconVisibility />}
        isRequired
        description="At least 8 characters"
        variant="outlined"
      />
      <TextField
        label="Bio"
        multiline
        rows={4}
        value={formData.bio}
        onChange={(value) => setFormData({ ...formData, bio: value })}
        characterCount
        maxLength={200}
        description="Tell us about yourself"
        variant="outlined"
      />
      <button type="submit" className="bg-primary text-on-primary rounded-full px-6 py-3">
        Submit
      </button>
    </form>
  );
};

export const FormIntegration: Story = {
  render: () => <FormExample />,
  parameters: {
    docs: {
      description: {
        story: "Complete form mixing filled and outlined variants with validation.",
      },
    },
  },
};

// ── Input types ───────────────────────────────────────────────────────────────

export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField label="Email" type="email" placeholder="email@example.com" />
      <TextField label="Password" type="password" placeholder="Password" />
      <TextField label="Number" type="number" prefix="#" placeholder="0" />
      <TextField label="Telephone" type="tel" placeholder="(555) 123-4567" />
      <TextField
        label="URL"
        type="url"
        prefix="https://"
        placeholder="example.com"
        variant="outlined"
      />
    </div>
  ),
};

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: "Playground",
    variant: "filled",
    placeholder: "Try changing the props...",
    description: "This is helper text",
    prefix: "",
    suffix: "",
    isRequired: false,
    isDisabled: false,
    isInvalid: false,
    fullWidth: false,
    multiline: false,
    characterCount: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Play with all props to see how the MD3 TextField behaves.",
      },
    },
  },
};
