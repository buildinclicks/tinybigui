# Task 8.1: Storybook Main Configuration

**Task ID:** 8.1  
**Category:** Phase 0 - Part I (Storybook Setup)  
**Status:** ✅ Complete  
**Date:** 2025-12-31

---

## 📋 Task Overview

**Objective:** Install and configure Storybook 10.1.11 for React + Vite + TypeScript with MD3-specific settings.

**Why This Task Matters:**
- **Component Development** - Develop components in isolation
- **Documentation** - Auto-generate component docs
- **Visual Testing** - See all component states at once
- **Accessibility Testing** - Built-in a11y addon
- **Theme Testing** - Easy light/dark mode switching

---

## 🎯 What Was Done

### 1. Installed Storybook 10.1.11 ✅

**Method:** Used Storybook CLI for automatic setup

```bash
npx storybook@latest init --builder vite --type react --yes
```

**What This Did:**
- Detected React + Vite framework automatically
- Installed all necessary packages
- Created `.storybook/` configuration directory
- Added scripts to `package.json`
- Created example stories (which we then deleted)

---

### 2. Packages Installed ✅

#### **Core Packages:**
- `storybook@^10.1.11` - Main CLI and core
- `@storybook/react-vite@^10.1.11` - React + Vite framework integration

#### **Addons:**
- `@chromatic-com/storybook@^4.1.3` - Visual testing integration
- `@storybook/addon-vitest@^10.1.11` - Vitest integration for component testing
- `@storybook/addon-a11y@^10.1.11` - Accessibility testing (WCAG)
- `@storybook/addon-docs@^10.1.11` - Auto-generate documentation

#### **Testing Tools:**
- `playwright@^1.57.0` - Browser automation
- `@vitest/browser-playwright@^4.0.16` - Vitest browser mode
- `@vitest/coverage-v8@^4.0.16` - Coverage reports (updated from existing)
- `eslint-plugin-storybook@^10.1.11` - ESLint rules for Storybook

#### **Total Packages Added:** 10 packages

---

### 3. Configuration Files Created ✅

#### **`.storybook/main.ts`** (27 lines)

**Purpose:** Main Storybook configuration

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: undefined, // Use default Vite config
      },
    },
  },
  docs: {
    autodocs: "tag", // Auto-generate docs for components with "autodocs" tag
  },
  typescript: {
    check: false, // Disable type checking (we do it separately)
    reactDocgen: "react-docgen-typescript", // Generate prop types from TypeScript
  },
};

export default config;
```

**Key Configurations:**
- **Stories glob:** Finds all `.stories.tsx` files in `src/`
- **Addons:** Essential addons for MD3 development
- **Framework:** React + Vite integration
- **Docs:** Auto-docs enabled with "autodocs" tag
- **TypeScript:** React prop types auto-generated

---

#### **`.storybook/preview.ts`** (107 lines)

**Purpose:** Global decorators, parameters, and theme configuration

**Key Configurations:**

**1. Controls:**
```typescript
controls: {
  matchers: {
    color: /(background|color)$/i,
    date: /Date$/i,
  },
  expanded: true, // Expand controls by default
  sort: 'requiredFirst', // Show required props first
},
```

**2. Actions:**
```typescript
actions: {
  argTypesRegex: '^on[A-Z].*', // Auto-detect event handlers
},
```

**3. Backgrounds (MD3 Colors):**
```typescript
backgrounds: {
  default: 'light',
  values: [
    { name: 'light', value: '#fef7ff' }, // MD3 surface light
    { name: 'dark', value: '#1c1b1f' },  // MD3 surface dark
  ],
},
```

**4. Viewport Presets:**
```typescript
viewport: {
  viewports: {
    mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
    tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
    desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
  },
},
```

**5. Accessibility (WCAG AA):**
```typescript
a11y: {
  test: 'todo', // Show violations in UI (don't fail CI yet)
  config: {
    rules: [
      { id: 'color-contrast', enabled: true },  // WCAG contrast
      { id: 'heading-order', enabled: true },   // Proper headings
      { id: 'image-alt', enabled: true },       // Alt text
    ],
  },
},
```

**6. Docs Configuration:**
```typescript
docs: {
  toc: true, // Show table of contents
  source: { state: 'open' }, // Show source code by default
},
```

**7. Global Theme Toolbar:**
```typescript
globalTypes: {
  theme: {
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      icon: 'circlehollow',
      items: ['light', 'dark'],
      dynamicTitle: true,
    },
  },
},
```

---

#### **`.storybook/vitest.setup.ts`** (Auto-generated)

**Purpose:** Vitest integration setup for component testing in Storybook

This file was auto-generated by Storybook and integrates Vitest with Storybook's browser environment.

---

### 4. Scripts Added to `package.json` ✅

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

**Usage:**
- `pnpm storybook` - Start Storybook dev server at http://localhost:6006
- `pnpm build-storybook` - Build static Storybook site for deployment

---

### 5. Cleaned Up Example Stories ✅

**Deleted:**
- `src/stories/` directory (entire folder with example Button, Header, Page components)

**Why:**
We'll create our own Material Design 3 components instead of using generic examples.

---

### 6. Removed Unnecessary Addon ✅

**Removed:**
- `@storybook/addon-onboarding` - Tutorial addon not needed for library development

---

## 📊 Storybook 10.x vs My Training Data (April 2024)

### **What I Knew (Storybook 7.x):**
- Basic addon system
- Manual configuration required
- Separate testing setup

### **What's New in Storybook 10.x:**
Based on installation experience:

1. **Better Vitest Integration** ✨
   - `@storybook/addon-vitest` - Native Vitest support
   - Run component tests directly in Storybook
   - Browser mode with Playwright

2. **Simplified Package Structure**
   - Main `storybook` package handles CLI
   - Framework packages (e.g., `@storybook/react-vite`) are separate
   - Addon packages use consistent versioning

3. **Auto-configuration**
   - Framework detection
   - Automatic addon setup
   - Smart defaults

4. **Enhanced TypeScript Support**
   - `react-docgen-typescript` built-in
   - Better type inference
   - Auto-generated prop tables

5. **Built-in Playwright**
   - Included for browser testing
   - Integration with Vitest
   - Visual regression capabilities

---

## 💡 How to Use Storybook

### **Creating Your First Story**

When we build components in Phase 1, stories will look like this:

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'], // Auto-generate docs
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant
export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'Button',
  },
};

// Outlined variant
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Button',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    variant: 'filled',
    children: 'Button',
    disabled: true,
  },
};
```

---

### **Running Storybook**

```bash
# Start dev server
pnpm storybook

# Runs on http://localhost:6006
```

**What You'll See:**
- Component library in left sidebar
- Component preview in center
- Controls panel below (adjust props live)
- Accessibility tab (WCAG violations)
- Docs tab (auto-generated documentation)

---

### **Testing in Storybook**

With Vitest integration, you can test stories:

```bash
# Run Storybook tests
npx vitest --project=storybook
```

This runs all stories as tests, checking:
- Components render without errors
- Accessibility violations
- Visual regression (with Chromatic)

---

## 🎨 MD3-Specific Configuration

### **1. Light/Dark Mode Testing**

The background switcher uses actual MD3 colors:
- **Light:** `#fef7ff` (surface-light)
- **Dark:** `#1c1b1f` (surface-dark)

### **2. Accessibility Focus**

WCAG AA compliance is enabled by default:
- **Color contrast:** 4.5:1 minimum for normal text
- **Heading order:** Proper semantic structure
- **Image alt text:** Required for all images

### **3. Viewport Testing**

Test responsive behavior at standard breakpoints:
- **Mobile:** 375px (iPhone SE)
- **Tablet:** 768px (iPad)
- **Desktop:** 1440px (Laptop)

### **4. MD3 Tokens Imported**

```typescript
import '../src/styles.css'; // MD3 tokens + Tailwind
```

All components in Storybook have access to:
- MD3 color tokens
- MD3 typography tokens
- MD3 elevation, shape, motion tokens
- Tailwind utilities

---

## 📂 Files Created/Modified

### Created Files

1. **`.storybook/main.ts`** (27 lines)
   - Main configuration
   - Stories glob pattern
   - Addons configuration
   - Framework setup
   - TypeScript config

2. **`.storybook/preview.ts`** (107 lines)
   - Global parameters
   - MD3 backgrounds
   - Viewport presets
   - A11y configuration
   - Theme toolbar

3. **`.storybook/vitest.setup.ts`** (Auto-generated)
   - Vitest integration
   - Browser mode setup

### Modified Files

1. **`packages/react/package.json`**
   - Added 10 dev dependencies
   - Added `storybook` script
   - Added `build-storybook` script

2. **`vitest.config.ts`** (Root)
   - Updated by Storybook addon-vitest
   - Added Storybook project configuration

### Deleted Files

- **`src/stories/`** - Entire example stories directory removed

---

## ✅ Success Criteria

- [x] Storybook 10.1.11 installed
- [x] React + Vite framework configured
- [x] Accessibility addon enabled
- [x] Vitest integration configured
- [x] Chromatic integration ready
- [x] MD3-specific configuration applied
- [x] Example stories removed
- [x] Scripts added to package.json
- [x] Configuration files customized

---

## 🎓 Key Learnings

### 1. Storybook 10.x Package Structure

**Discovery:** Not all packages follow the same versioning!
- `storybook@10.1.11` ✅ (main CLI)
- `@storybook/react-vite@10.1.11` ✅ (framework)
- `@storybook/addon-a11y@10.1.11` ✅ (addon)
- `@storybook/addon-essentials` ❌ (only up to 8.x)
- `@storybook/test` ❌ (only up to 8.x)

**Lesson:** In Storybook 10.x, some addons are now bundled differently or renamed.

### 2. Auto-configuration is Powerful

The `storybook init` command:
- Detected React + Vite automatically
- Installed correct framework packages
- Configured TypeScript properly
- Set up addons intelligently
- Added scripts to package.json

**Lesson:** For complex tools like Storybook, using the CLI is faster and more reliable than manual setup.

### 3. Vitest Integration is Built-in

Storybook 10.x has native Vitest support:
- `@storybook/addon-vitest` package
- Browser mode with Playwright
- Stories become test cases automatically

**Lesson:** We can test components directly in Storybook, reducing test duplication.

### 4. Accessibility Testing is First-Class

The a11y addon is now a core part of Storybook:
- WCAG compliance checking
- Color contrast analysis
- Semantic HTML validation
- Screen reader compatibility

**Lesson:** Accessibility testing is integrated into the development workflow, not an afterthought.

### 5. MD3 Theme Configuration

We configured Storybook specifically for MD3:
- MD3 surface colors for backgrounds
- WCAG AA accessibility rules
- Standard viewport sizes
- Auto-docs with TypeScript props

**Lesson:** Storybook is highly customizable for design system requirements.

---

## 🔗 Related Tasks

**Prerequisite Tasks:**
- ✅ Part A-H completed (all foundation work)

**This Task (8.1):**
- ✅ Storybook main configuration complete

**Next Tasks:**
- ⏳ Task 8.2 - Storybook Preview Configuration (customize further)
- ⏳ Task 8.3 - Storybook Manager Configuration (UI customization)

---

## 📝 Notes for Next Steps

### Task 8.2: Storybook Preview (Further Customization)

Will add:
- Theme provider decorator
- Global CSS reset
- Custom decorators for MD3 containers
- More comprehensive viewport configurations

### Task 8.3: Storybook Manager (UI Branding)

Will customize:
- Storybook UI theme
- Brand logo
- Custom color scheme
- Title and description

### When Building Components (Phase 1)

**Story Structure:**
```typescript
// Always include:
tags: ['autodocs']  // Auto-generate docs
parameters: { layout: 'centered' }  // Center component
argTypes: { ... }  // Define controls

// Test all states:
- Default
- All variants
- Disabled
- Loading
- Error
- Interactive states (hover, focus, active)
```

**Accessibility Testing:**
- Check a11y tab for violations
- Test keyboard navigation
- Verify screen reader announcements
- Test light/dark mode

---

## ✅ Task Completion

**Status:** Complete ✅  
**Result:** Storybook 10.1.11 configured and ready for MD3 component development.

**What We Have:**
- ✅ Storybook 10.1.11 running
- ✅ React + Vite framework
- ✅ Accessibility testing enabled
- ✅ Vitest integration configured
- ✅ MD3-specific settings applied
- ✅ Ready to build components!

**To Start Storybook:**
```bash
pnpm storybook
# Opens http://localhost:6006
```

**Next Phase:** Task 8.2 - Further preview customization (optional) or move to Part J (Code Quality)

---

*Task completed on 2025-12-31 as part of Phase 0 - Part I (Storybook Setup)*

