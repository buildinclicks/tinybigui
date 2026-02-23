/**
 * TextField Component Stories
 *
 * Storybook stories for the Material Design 3 TextField component.
 * Demonstrates all variants, states, and usage patterns.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "./TextField";

// Sample icons for stories
const IconEmail = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconSearch = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const IconPerson = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const IconVisibility = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconClear = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 TextField component with filled and outlined variants, full accessibility support, and comprehensive input features.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "TextField size",
    },
    label: {
      control: "text",
      description: "Label text for the input",
    },
    description: {
      control: "text",
      description: "Helper text displayed below the input",
    },
    errorMessage: {
      control: "text",
      description: "Error message when invalid",
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
      description: "Make input full width",
    },
    multiline: {
      control: "boolean",
      description: "Enable multiline mode (textarea)",
    },
    characterCount: {
      control: "boolean",
      description: "Show character counter",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

// Default Story
export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "email@example.com",
    variant: "filled",
    size: "medium",
  },
};

// Variants
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

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField label="Small" size="small" placeholder="Small input" />
      <TextField label="Medium (default)" size="medium" placeholder="Medium input" />
      <TextField label="Large" size="large" placeholder="Large input" />
    </div>
  ),
};

// With Label
export const WithLabel: Story = {
  args: {
    label: "Email address",
    placeholder: "email@example.com",
  },
};

export const WithoutLabel: Story = {
  args: {
    "aria-label": "Search",
    placeholder: "Search...",
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: "Email",
    description: "We'll never share your email with anyone else",
    placeholder: "email@example.com",
  },
};

// With Error
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

// With Icons
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
    </div>
  ),
};

// Disabled State
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

// Required Field
export const RequiredField: Story = {
  args: {
    label: "Email",
    isRequired: true,
    description: "This field is required",
    placeholder: "email@example.com",
  },
};

// Full Width
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

// Multiline (Textarea)
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
      />
    </div>
  ),
};

// Character Counter
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
      <TextField label="Short text" characterCount maxLength={50} placeholder="Max 50 characters" />
      <TextField
        label="Bio"
        multiline
        rows={4}
        characterCount
        maxLength={200}
        placeholder="Max 200 characters"
      />
    </div>
  ),
};

// Interactive Example
const InteractiveExample = (): React.ReactElement => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setValue(newValue);
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(newValue) || newValue === "");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <TextField
        label="Email"
        value={value}
        onChange={handleChange}
        isInvalid={!isValid}
        errorMessage={!isValid ? "Please enter a valid email" : undefined}
        leadingIcon={<IconEmail />}
        placeholder="email@example.com"
        description="Enter your email address"
      />
      <div className="text-on-surface-variant text-sm">
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
        story: "Interactive example with live validation and state management.",
      },
    },
  },
};

// Accessibility
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
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All inputs have proper ARIA attributes, labels, and descriptions for screen readers. Focus indicators are visible for keyboard navigation.",
      },
    },
  },
};

// Form Example
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, email: e.target.value })
        }
        leadingIcon={<IconEmail />}
        isRequired
        description="We'll never share your email"
      />
      <TextField
        label="Username"
        value={formData.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, username: e.target.value })
        }
        leadingIcon={<IconPerson />}
        isRequired
        description="Choose a unique username"
      />
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, password: e.target.value })
        }
        trailingIcon={<IconVisibility />}
        isRequired
        description="At least 8 characters"
      />
      <TextField
        label="Bio"
        multiline
        rows={4}
        value={formData.bio}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData({ ...formData, bio: e.target.value })
        }
        characterCount
        maxLength={200}
        description="Tell us about yourself"
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
        story: "Example of TextField used in a complete form with validation.",
      },
    },
  },
};

// Input Types
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: 320 }}>
      <TextField label="Email" type="email" placeholder="email@example.com" />
      <TextField label="Password" type="password" placeholder="Password" />
      <TextField label="Number" type="number" placeholder="123" />
      <TextField label="Telephone" type="tel" placeholder="(555) 123-4567" />
      <TextField label="URL" type="url" placeholder="https://example.com" />
      <TextField label="Date" type="date" />
      <TextField label="Time" type="time" />
    </div>
  ),
};

// Playground
export const Playground: Story = {
  args: {
    label: "Playground",
    variant: "filled",
    size: "medium",
    placeholder: "Try changing the props...",
    description: "This is a helper text",
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
        story: "Play around with all the component props to see how the TextField behaves.",
      },
    },
  },
};
