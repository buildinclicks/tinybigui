# @tinybigui/react

> Material Design 3 React components

[![npm version](https://img.shields.io/npm/v/@tinybigui/react.svg?style=flat-square)](https://www.npmjs.com/package/@tinybigui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@tinybigui/react?style=flat-square)](https://bundlephobia.com/package/@tinybigui/react)

A modern, accessible React component library implementing Google's Material Design 3 design system. Built with TypeScript, styled with Tailwind CSS v4, and optimized for performance.

---

## ✅ Status

> **Released: v0.1.0** (2026-04-15)
>
> This package is published to npm. Install it with `npm install @tinybigui/react`.
>
> Follow our [GitHub repository](https://github.com/buildinclicks/tinybigui) for updates!

---

## ✨ Features

- 🎨 **Material Design 3** - Full implementation of MD3 design system
- 🌙 **Dark Mode** - Automatic theme switching based on system preferences
- ♿ **Accessible** - WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- 🎯 **TypeScript** - 100% TypeScript with comprehensive type definitions
- 📦 **Tree-shakable** - Import only what you need, optimized bundle size
- 🎨 **Customizable** - Easy theming with CSS variables and Tailwind classes
- 🚀 **Modern React** - Built for React 18+ with hooks and concurrent features
- 📱 **Responsive** - Mobile-first, works on all screen sizes
- 🧪 **Well Tested** - Comprehensive unit and integration tests
- 📚 **Documented** - Full API documentation with examples

---

## 📦 Installation

```bash
npm install @tinybigui/react
# or
pnpm add @tinybigui/react
# or
yarn add @tinybigui/react
```

### Peer Dependencies

This library requires React 18 or higher:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

---

## 🚀 Quick Start

### 1. Import the CSS

Import the styles in your app's entry point:

```tsx
// main.tsx or App.tsx
import "@tinybigui/react/styles.css";
```

### 2. Use Components

```tsx
import { Button, TextField, Checkbox } from "@tinybigui/react";

function App() {
  return (
    <div>
      <TextField label="Email" type="email" />
      <Checkbox label="Accept terms" />
      <Button variant="filled" color="primary">
        Sign Up
      </Button>
    </div>
  );
}
```

### 3. Customize Theme (Optional)

Override CSS variables to customize the theme:

```css
:root {
  --md-sys-color-primary: #your-color;
  --md-sys-color-on-primary: #your-text-color;
}
```

---

## 📚 Components

### Phase 1a: Core Buttons ✅

| Component    | Status | Description                   |
| ------------ | ------ | ----------------------------- |
| `Button`     | ✅     | Standard button with variants |
| `IconButton` | ✅     | Button with icon only         |
| `FAB`        | ✅     | FAB for primary actions       |

### Phase 1b: Form Components ✅

| Component    | Status | Description           |
| ------------ | ------ | --------------------- |
| `TextField`  | ✅     | Text input with label |
| `Checkbox`   | ✅     | Checkbox input        |
| `Radio`      | ✅     | Radio button input    |
| `RadioGroup` | ✅     | Radio group container |
| `Switch`     | ✅     | Toggle switch         |

### Phase 2: Layout & Navigation (Planned)

| Component | Status | Description              |
| --------- | ------ | ------------------------ |
| `Card`    | 📋     | Container with elevation |
| `Dialog`  | 📋     | Modal dialog             |
| `Drawer`  | 📋     | Side navigation drawer   |
| `Tabs`    | 📋     | Tabbed navigation        |

### Phase 3: Data Display (Planned)

| Component | Status | Description            |
| --------- | ------ | ---------------------- |
| `Table`   | 📋     | Data table             |
| `List`    | 📋     | List with items        |
| `Chip`    | 📋     | Compact information    |
| `Badge`   | 📋     | Notification badge     |
| `Tooltip` | 📋     | Contextual information |

**Legend:**

- ✅ Complete
- 🚧 In Progress
- 📋 Planned

---

## 🎨 Variants & Customization

### Button Variants

```tsx
<Button variant="filled">Filled</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
<Button variant="elevated">Elevated</Button>
<Button variant="tonal">Tonal</Button>
```

### Color Schemes

```tsx
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="tertiary">Tertiary</Button>
<Button color="error">Error</Button>
```

### Sizes

```tsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

---

## ♿ Accessibility

All components are built with accessibility in mind:

- ✅ **Keyboard Navigation** - Full keyboard support (Tab, Enter, Space, Arrow keys)
- ✅ **Screen Readers** - Proper ARIA labels and roles
- ✅ **Focus Management** - Clear focus indicators and logical focus order
- ✅ **Color Contrast** - WCAG 2.1 AA compliant contrast ratios
- ✅ **Reduced Motion** - Respects `prefers-reduced-motion`
- ✅ **Semantic HTML** - Uses proper HTML elements

---

## 🌙 Dark Mode

Dark mode is enabled automatically based on system preferences:

```css
/* Automatically switches based on system preference */
@media (prefers-color-scheme: dark) {
  /* Dark theme applied */
}
```

**Manual Control:**

```tsx
// Force dark mode
document.documentElement.setAttribute("data-theme", "dark");

// Force light mode
document.documentElement.setAttribute("data-theme", "light");

// Use system preference
document.documentElement.removeAttribute("data-theme");
```

---

## 🎯 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { ButtonProps, ButtonVariant } from "@tinybigui/react";

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

// Type-safe variants
const variant: ButtonVariant = "filled"; // ✅
const invalid: ButtonVariant = "invalid"; // ❌ Type error
```

---

## 📦 Tree Shaking

Only import what you need - unused components are automatically removed:

```tsx
// Only Button code is included in your bundle
import { Button } from "@tinybigui/react";
```

**Bundle impact:**

- Base styles: ~5KB (gzipped)
- Button component: ~3KB (gzipped)
- Each additional component: ~2-4KB (gzipped)

---

## 🔗 Using with Frameworks

### Next.js

```tsx
// app/layout.tsx
import "@tinybigui/react/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Vite

```tsx
// main.tsx
import "@tinybigui/react/styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

### Remix

```tsx
// app/root.tsx
import styles from "@tinybigui/react/styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];
```

---

## 🛠️ Customization

### CSS Variables

All components use CSS custom properties for easy theming:

```css
:root {
  /* Colors */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;

  /* Typography */
  --md-sys-typescale-body-medium-font-size: 14px;

  /* Shape */
  --md-sys-shape-corner-medium: 12px;

  /* Elevation */
  --md-sys-elevation-2: 0 1px 3px rgba(0, 0, 0, 0.12);
}
```

### Tailwind Classes

Components work seamlessly with Tailwind utilities:

```tsx
<Button className="mt-4 w-full">Custom Styles</Button>
```

---

## 📖 Documentation

- **GitHub Repository**: [github.com/buildinclicks/tinybigui](https://github.com/buildinclicks/tinybigui)
- **Documentation Site**: Coming soon at [tinybigui.dev](https://tinybigui.dev)
- **Storybook**: Storybook 10 is set up in `packages/react/.storybook/` — run `pnpm storybook` to explore components locally
- **API Reference**: Coming soon

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/buildinclicks/tinybigui#contributing) for details.

---

## 📄 License

MIT © [buildinclicks](https://github.com/buildinclicks)

---

## 🔗 Related Packages

- [`@tinybigui/tokens`](https://www.npmjs.com/package/@tinybigui/tokens) - Design tokens (CSS variables)

---

## 🙏 Credits

Built with:

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Material Design 3](https://m3.material.io/) - Design system

---

<div align="center">
  <p>
    <strong>Made with ❤️ by <a href="https://github.com/buildinclicks">buildinclicks</a></strong>
  </p>
  <p>
    <a href="https://github.com/buildinclicks/tinybigui">GitHub</a> •
    <a href="https://github.com/buildinclicks/tinybigui/issues">Report Bug</a> •
    <a href="https://github.com/buildinclicks/tinybigui/discussions">Request Feature</a>
  </p>
</div>
