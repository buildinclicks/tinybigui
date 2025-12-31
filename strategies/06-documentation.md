# Documentation & Storybook Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

This document outlines our documentation strategy, including Storybook setup, component documentation standards, and knowledge sharing.

---

## 📚 Documentation Layers

### 1. Storybook (Component Playground)

**Primary Purpose**: Interactive component development and testing

**Target Audience**:

- Developers using the library
- Contributors developing components
- Designers reviewing implementations

**URL**: `https://tinybigui-storybook.vercel.app` (or similar)

**Build Setup**: Vite-based (using `@storybook/react-vite`)

### 2. README.md (Quick Start)

**Primary Purpose**: Get users started in <5 minutes

**Contents**:

- Installation instructions
- Basic usage example (Next.js App Router as primary, Vite as secondary)
- Link to full documentation
- Link to Storybook

**Framework Focus**:

- **Primary ("golden path")**: **Next.js (App Router)** — Most common RSC environment, best for production apps
- **Secondary**: **Vite (React)** — Fast development, ideal for demos and non-Next.js setups
- **Other frameworks**: Brief mention with link to Tailwind v4 setup guides

### 3. API Documentation (In-code)

**Primary Purpose**: TypeScript IntelliSense and reference

**Implementation**: JSDoc comments for all public APIs

---

## 📖 Storybook Setup

### Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials", // Docs, controls, actions, etc.
    "@storybook/addon-a11y", // Accessibility testing
    "@storybook/addon-interactions", // Interaction testing
    "@storybook/addon-links", // Link between stories
    "@storybook/addon-themes", // Theme switcher
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true, // Privacy-first
  },
  docs: {
    autodocs: "tag", // Auto-generate docs
  },
};

export default config;
```

### Theme Configuration

```typescript
// .storybook/preview.tsx
import { Preview } from "@storybook/react";
import { ThemeProvider } from "../src";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1c1b1f" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultMode="light">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
```

---

## 📝 Story Template

Every component follows this story structure:

```typescript
// button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "text", "elevated", "tonal"],
      description: "The visual style of the button",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "filled" },
      },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: {
      control: "boolean",
    },
    onPress: { action: "pressed" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: "Button",
    variant: "filled",
  },
};

// All variants
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="filled">Filled</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="tonal">Tonal</Button>
    </div>
  ),
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>Default</Button>
      <Button isDisabled>Disabled</Button>
    </div>
  ),
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button startIcon={<PlusIcon />}>Add</Button>
      <Button endIcon={<ArrowIcon />}>Next</Button>
    </div>
  ),
};

// Accessibility
export const Accessibility: Story = {
  render: () => (
    <Button aria-label="Close dialog">
      <CloseIcon />
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: "Icon-only buttons must have an accessible label",
      },
    },
  },
};

// Interactions (for testing)
export const Interactive: Story = {
  args: {
    children: "Click me",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};
```

---

## 📄 Component Documentation Standard

### Documentation Template

Every component's story should include:

#### 1. Description

```typescript
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
Buttons help users take actions and make choices with a single tap.

Material Design 3 provides 5 button types:
- **Filled**: High emphasis, primary actions
- **Outlined**: Medium emphasis, important but not primary
- **Text**: Low emphasis, optional actions
- **Elevated**: Medium emphasis with elevation
- **Tonal**: Medium emphasis between filled and outlined
        `,
      },
    },
  },
};
```

#### 2. Props Table

Auto-generated from TypeScript types + JSDoc:

```typescript
interface ButtonProps {
  /**
   * The visual style of the button
   * @default 'filled'
   */
  variant?: "filled" | "outlined" | "text" | "elevated" | "tonal";

  /**
   * The size of the button
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Handler called when the button is pressed
   */
  onPress?: () => void;
}
```

#### 3. Accessibility Section

```markdown
## Accessibility

### Keyboard Support

| Key   | Action               |
| ----- | -------------------- |
| Enter | Activates the button |
| Space | Activates the button |

### ARIA Attributes

- `role="button"` - Identifies element as button
- `aria-disabled` - Indicates disabled state
- `aria-pressed` - For toggle buttons (optional)

### Screen Reader

Announced as "Button name, button" with state information.

### Focus

Visible focus ring with 3:1 contrast ratio against background.
```

#### 4. Usage Examples

```typescript
// Basic usage
export const BasicUsage: Story = {
  render: () => <Button>Click me</Button>,
  parameters: {
    docs: {
      source: {
        code: `<Button>Click me</Button>`,
      },
    },
  },
};

// Advanced usage
export const FormSubmit: Story = {
  render: () => (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField label="Email" type="email" />
      <Button type="submit">Submit</Button>
    </form>
  ),
};
```

#### 5. Do's and Don'ts

```markdown
## Best Practices

### ✅ Do

- Use filled buttons for the primary action
- Provide accessible labels for icon-only buttons
- Limit to 1-2 buttons per section

### ❌ Don't

- Use multiple filled buttons in the same view
- Make buttons smaller than 48px touch target
- Remove focus indicators
```

---

## 🎨 Visual Design Documentation

### Component Anatomy

Use Storybook's MDX for visual diagrams:

```mdx
<!-- button.stories.mdx -->

import { Canvas, Meta } from "@storybook/blocks";
import { Button } from "./button";

<Meta title="Components/Button/Anatomy" />

# Button Anatomy

<Canvas>
  <div style={{ position: 'relative' }}>
    <Button>Button Text</Button>
    <!-- Add annotations -->
  </div>
</Canvas>

## Parts

1. **Container**: The button's background
2. **Label**: Button text (required)
3. **Icon**: Optional leading or trailing icon
4. **State layer**: Visual feedback for interactions
5. **Focus ring**: Keyboard focus indicator
```

### Design Tokens

Document which tokens each component uses:

```markdown
## Design Tokens

### Colors

- Background: `--md-sys-color-primary`
- Text: `--md-sys-color-on-primary`
- Outline: `--md-sys-color-outline`

### Typography

- Font: `--md-sys-typescale-label-large`

### Shape

- Border radius: `--md-sys-shape-corner-full`

### Elevation

- Elevated variant: `--md-sys-elevation-level1`
```

---

## 🧪 Testing Documentation

### Interaction Tests in Storybook

```typescript
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test keyboard navigation
    const button = canvas.getByRole("button");
    await userEvent.tab();
    await expect(button).toHaveFocus();

    // Test activation
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveBeenCalled();
  },
};
```

### Accessibility Testing

Storybook A11y addon shows:

- ARIA violations
- Color contrast issues
- Keyboard navigation problems

---

## 📱 Responsive Documentation

Show components at different breakpoints:

```typescript
export const Responsive: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "667px" } },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
  },
};
```

---

## 🎯 Storybook Organization

### Story Hierarchy

```
Components/
├── Buttons/
│   ├── Button
│   ├── Icon Button
│   ├── FAB
│   └── Segmented Button
├── Inputs/
│   ├── Text Field
│   ├── Checkbox
│   ├── Radio
│   ├── Switch
│   └── Slider
├── Selection/
│   ├── Chip
│   ├── Menu
│   └── Select
└── Feedback/
    ├── Progress
    ├── Snackbar
    ├── Badge
    └── Tooltip

Foundations/
├── Colors
├── Typography
├── Elevation
├── Shape
└── Motion

Guides/
├── Installation/
│   ├── Next.js (App Router) — Primary
│   ├── Vite — Secondary
│   └── Other Frameworks — Brief guidance
├── Theming
├── Accessibility
└── Migration
```

---

## 🚀 Deployment

### Hosting

**Decision**: **Vercel** (free tier for open-source) + **Chromatic** (free tier for visual regression)

- **Storybook hosting**: Vercel (unlimited for open-source projects)
- **Visual regression testing**: Chromatic (5,000 snapshots/month free for open-source)

**URL**: `https://tinybigui-storybook.vercel.app` (or similar)

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "deploy-storybook": "storybook build && vercel --prod",
    "chromatic": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"
  }
}
```

### Automatic Deployments

```yaml
# .github/workflows/storybook.yml
name: Deploy Storybook

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build-storybook
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📊 Documentation Metrics

Track documentation quality:

- [ ] 100% component coverage in Storybook
- [ ] Every component has accessibility section
- [ ] Every component has interaction tests
- [ ] All props documented with JSDoc
- [ ] Usage examples for common scenarios

### Framework-Specific Examples

Provide framework-specific setup guides in this priority order:

1. **Next.js (App Router)** — Primary golden path
   - Installation with App Router
   - Importing styles in `app/layout.tsx`
   - Using components in Server + Client components
   - RSC considerations

2. **Vite (React)** — Secondary path
   - Installation with Vite
   - Importing styles in entry point
   - Standard React usage

3. **Other Frameworks** — Brief mention
   - Remix, Astro, Gatsby
   - Link to Tailwind v4 + React setup guides
   - Note: "Any React 18+ environment with Tailwind v4 support"

---

## ✅ Documentation Checklist

Before releasing a component:

### Storybook Stories

- [ ] Default story
- [ ] All variants demonstrated
- [ ] States (hover, focus, disabled)
- [ ] Sizes (if applicable)
- [ ] With icons (if applicable)
- [ ] Responsive behavior
- [ ] Accessibility story
- [ ] Interaction tests

### Documentation

- [ ] Component description
- [ ] Props table with descriptions
- [ ] Accessibility section
- [ ] Keyboard support table
- [ ] Usage examples
- [ ] Do's and don'ts
- [ ] Design token reference

### Code Quality

- [ ] TypeScript types exported
- [ ] JSDoc comments on all public APIs
- [ ] Examples in JSDoc
- [ ] Links to MD3 spec

---

## 🔗 References

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf)
- [Storybook Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction#best-practices)
- [MDX in Storybook](https://storybook.js.org/docs/react/writing-docs/mdx)
