# @tinybigui/react

> Material Design 3 React components

[![npm version](https://img.shields.io/npm/v/@tinybigui/react.svg?style=flat-square)](https://www.npmjs.com/package/@tinybigui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@tinybigui/react?style=flat-square)](https://bundlephobia.com/package/@tinybigui/react)

A modern, accessible React component library implementing Google's Material Design 3 design system. Built with TypeScript, styled with Tailwind CSS v4, and optimized for performance.

---

## ✅ Status

> **Latest Release: v0.12.0** (2026-06-09)
>
> **29 MD3 components** published to npm with full TypeScript support and WCAG 2.1 AA accessibility.
>
> Install with `npm install @tinybigui/react` — follow our [GitHub repository](https://github.com/buildinclicks/tinybigui) for updates!

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

TinyBigUI requires **Tailwind CSS v4**. Styles must be loaded through a CSS file processed by Tailwind, not via a direct JS import.

### 1. Create a CSS entry file

```css
/* app/globals.css (Next.js) or src/index.css (Vite) */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

> `@source` is required so Tailwind scans the library's compiled output and generates all utility classes used by components.

### 2. Import the CSS in your app entry

```tsx
// app/layout.tsx (Next.js)
import "./globals.css";

// src/main.tsx (Vite)
import "./index.css";
```

### 3. Use Components

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

### 4. Customize Theme (Optional)

Override palette variables after the library import to apply your brand colors:

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";

:root {
  /* Override the primary palette — all components update automatically */
  --md-ref-palette-primary40: #006a6a;
  --md-ref-palette-primary80: #4ddada;
  --md-ref-palette-primary90: #b2fefe;
}
```

See [THEMING.md](./THEMING.md) for the full customization guide.

---

## 📚 Components

### Phase 1a: Core Buttons ✅

| Component     | Status | Description                                      |
| ------------- | ------ | ------------------------------------------------ |
| `Button`      | ✅     | Filled, outlined, tonal, elevated, text variants |
| `IconButton`  | ✅     | M3 Expressive 5-tier sizing, toggle mode         |
| `FAB`         | ✅     | M3 Expressive slot architecture, size scale      |
| `FABMenu`     | ✅     | Speed-dial with MD3 Expressive pill menu items   |
| `ButtonGroup` | ✅     | Connected layout, single/multi-select            |
| `SplitButton` | ✅     | Primary action + dropdown menu                   |

### Phase 1b: Form Components ✅

| Component    | Status | Description                                          |
| ------------ | ------ | ---------------------------------------------------- |
| `TextField`  | ✅     | Filled and outlined, floating label                  |
| `Checkbox`   | ✅     | MD3 variants-vs-states, spec-accurate icons (v0.8.1) |
| `Radio`      | ✅     | Radio button input                                   |
| `RadioGroup` | ✅     | Vertical and horizontal orientation                  |
| `Switch`     | ✅     | Toggle with variants-vs-states arch.                 |
| `Slider`     | ✅     | Standard, centered, range; discrete stops            |

### Phase 2: Navigation ✅

| Component          | Status | Description                                                          |
| ------------------ | ------ | -------------------------------------------------------------------- |
| `AppBar`           | ✅     | M3 expressive flexible slot architecture, subtitle growth (v0.10.0)  |
| `Tabs`             | ✅     | MD3 expressive variants-vs-states, content-width indicator (v0.11.2) |
| `NavigationDrawer` | ✅     | Modal and standard navigation drawer                                 |
| `NavigationBar`    | ✅     | Bottom navigation with badges                                        |
| `Search`           | ✅     | SearchBar and SearchView overlay                                     |

### Phase 3: Feedback ✅

| Component     | Status | Description                                                      |
| ------------- | ------ | ---------------------------------------------------------------- |
| `Dialog`      | ✅     | Basic and fullscreen modal dialogs                               |
| `Snackbar`    | ✅     | Provider, stacking, imperative API                               |
| `Menu`        | ✅     | Dropdown, context menu, submenus                                 |
| `Progress`    | ✅     | Linear and circular indicators                                   |
| `BottomSheet` | ✅     | MD3 expressive handle, variants-vs-states architecture (v0.11.0) |
| `Tooltip`     | ✅     | Plain and rich tooltip with positioning                          |

### Phase 4: Data Display ✅

| Component    | Status | Description                                                              |
| ------------ | ------ | ------------------------------------------------------------------------ |
| `Card`       | ✅     | MD3 motion tier, media aspect-ratio fix, CVA export parity (v0.11.1)     |
| `List`       | ✅     | Static and interactive list items                                        |
| `Chip`       | ✅     | MD3 expressive slot architecture, elevated surface (v0.9.0)              |
| `Badge`      | ✅     | MD3 expressive dot/count badges, icon-corner anchoring (v0.8.0)          |
| `Divider`    | ✅     | MD3 expressive slot CVA, CSS-var thickness, logical RTL insets (v0.12.0) |
| `DatePicker` | ✅     | Docked, modal, and input variants                                        |
| `TimePicker` | ✅     | 12h/24h clock dial, range selection                                      |

### Planned

| Component | Status | Description |
| --------- | ------ | ----------- |
| `Table`   | 📋     | Data table  |

**Legend:** ✅ Complete · 🚧 In Progress · 📋 Planned

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
document.documentElement.classList.add("dark");
document.documentElement.classList.remove("light");

// Force light mode
document.documentElement.classList.add("light");
document.documentElement.classList.remove("dark");

// Revert to OS preference
document.documentElement.classList.remove("dark", "light");
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

All frameworks require a CSS entry file that includes `@import "tailwindcss"` and `@source` before the library import.

### Next.js

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

```tsx
// app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Vite

```css
/* src/index.css */
@import "tailwindcss";
@source "./node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

```tsx
// src/main.tsx
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

### Remix

```css
/* app/root.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

```tsx
// app/root.tsx
import styles from "@tinybigui/react/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: styles }];
```

---

## 🛠️ Customization

### Brand Colors

Override the palette layer to retheme all components at once. All semantic color roles cascade from these raw palette values:

```css
:root {
  /* Teal brand — light mode uses the 40-stop, dark mode uses the 80-stop */
  --md-ref-palette-primary40: #006a6a;
  --md-ref-palette-primary80: #4ddada;
  --md-ref-palette-primary90: #b2fefe;
  --md-ref-palette-primary10: #002020;
}
```

Use the [Material Theme Builder](https://m3.material.io/theme-builder) to generate a complete tonal palette from a single hex color.

### Typography

```css
:root {
  --md-sys-typescale-font-family-plain: "Inter", system-ui, sans-serif;
  --md-sys-typescale-font-family-brand: "Playfair Display", serif;
}
```

### Shape

```css
:root {
  --md-sys-shape-corner-medium: 6px; /* sharper cards */
  --md-sys-shape-corner-large: 10px; /* sharper FABs and drawers */
}
```

### Tailwind Classes

Components work seamlessly with Tailwind utilities:

```tsx
<Button className="mt-4 w-full">Custom Styles</Button>
```

See [THEMING.md](./THEMING.md) for the complete theming reference including dark mode overrides, granular imports, and all available CSS variable namespaces.

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
