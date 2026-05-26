# Setting Up a Next.js Project with Tailwind CSS and TinyBigUI

This guide walks through creating a new Next.js application, integrating Tailwind CSS v4, installing `@tinybigui/react`, and configuring a personalized brand theme.

---

## Prerequisites

- Node.js 18+ installed
- pnpm, npm, or yarn package manager
- Basic familiarity with React and Next.js

---

## Step 1: Create a New Next.js Project

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

The `--tailwind` flag bootstraps Tailwind CSS v4 automatically. If you are using an older version of `create-next-app` that installs Tailwind v3, see Step 2 for manual Tailwind v4 setup.

> **Verify Tailwind version** — After creating the project, check `package.json`:
>
> ```json
> "tailwindcss": "^4.x.x"
> ```
>
> TinyBigUI requires Tailwind CSS v4.0 or higher.

---

## Step 2: Verify Tailwind CSS v4 Setup

After project creation, confirm your `src/app/globals.css` contains a Tailwind v4 import:

```css
@import "tailwindcss";
```

If it still uses the v3 `@tailwind base; @tailwind components; @tailwind utilities;` syntax, replace the entire content with:

```css
@import "tailwindcss";
```

Also ensure the PostCSS config (or `@tailwindcss/postcss` plugin) is in place. Next.js with `--tailwind` handles this automatically.

---

## Step 3: Install TinyBigUI

```bash
# Using pnpm
pnpm add @tinybigui/react

# Using npm
npm install @tinybigui/react

# Using yarn
yarn add @tinybigui/react
```

This installs the component library. Tailwind CSS is a peer dependency and is already present from Step 1.

---

## Step 4: Configure CSS Entry Point

Open `src/app/globals.css` and replace its contents with:

```css
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

**What each line does:**

| Line | Purpose |
|------|---------|
| `@import "tailwindcss"` | Initializes Tailwind CSS v4 (base, components, utilities layers) |
| `@source "../node_modules/@tinybigui/react/dist"` | Tells Tailwind to scan the library's compiled output so it generates utility classes like `bg-primary`, `text-display-large`, `shadow-elevation-1`, etc. |
| `@import "@tinybigui/react/styles.css"` | Loads MD3 design tokens (CSS variables), the Tailwind `@theme` bridge, keyframes, and base body styles |

> **Important:** Without `@source`, Tailwind will not generate the utility classes used internally by TinyBigUI components. Components will render but appear unstyled.

---

## Step 5: Confirm It Works

Edit `src/app/page.tsx` to use a TinyBigUI component:

```tsx
import { Button } from "@tinybigui/react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button variant="filled" color="primary">
        Hello TinyBigUI
      </Button>
    </main>
  );
}
```

Run the dev server:

```bash
pnpm dev
# or: npm run dev
```

Open `http://localhost:3000`. You should see a styled Material Design 3 button in the default purple theme.

---

## Step 6: Set Up a Custom Theme

TinyBigUI uses a three-layer token system. Override the **reference palette** tokens to apply your brand colors globally. All components update automatically.

### 6.1 Generate Your Palette

Visit the [Material Theme Builder](https://m3.material.io/theme-builder) and enter your brand's primary color. Export the CSS values for the full tonal palette at stops: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100.

### 6.2 Add Token Overrides

Append your overrides to `src/app/globals.css` after the library import:

```css
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";

/* ============================================
   BRAND THEME — Custom palette overrides
   ============================================ */

:root {
  /* Primary palette — teal brand example */
  --md-ref-palette-primary0: #000000;
  --md-ref-palette-primary10: #002020;
  --md-ref-palette-primary20: #003737;
  --md-ref-palette-primary30: #004f4f;
  --md-ref-palette-primary40: #006a6a;
  --md-ref-palette-primary50: #008585;
  --md-ref-palette-primary60: #00a1a1;
  --md-ref-palette-primary70: #23bdbd;
  --md-ref-palette-primary80: #4ddada;
  --md-ref-palette-primary90: #b2fefe;
  --md-ref-palette-primary95: #d6fffe;
  --md-ref-palette-primary99: #f5fffe;
  --md-ref-palette-primary100: #ffffff;

  /* Secondary palette (optional — keeps MD3 baseline if not overridden) */
  /* --md-ref-palette-secondary40: #your-color; */

  /* Tertiary palette (optional) */
  /* --md-ref-palette-tertiary40: #your-color; */
}
```

Save and reload — all buttons, cards, chips, and other components now use your teal brand color.

### 6.3 Dark Mode Overrides

The token system handles dark mode automatically. Light mode uses palette stop 40 for `--md-sys-color-primary`; dark mode uses stop 80. Since you override the full tonal scale in `:root`, dark mode picks up the correct stops automatically.

If you need to fine-tune dark mode specifically:

```css
/* Force specific dark mode adjustments */
.dark {
  --md-ref-palette-primary80: #4ddada;
  /* or override system-level tokens directly: */
  --md-sys-color-primary: #4ddada;
  --md-sys-color-on-primary: #003737;
}
```

---

## Step 7: Customize Typography

Override the type scale tokens to use your brand fonts:

```css
:root {
  /* Brand fonts */
  --md-sys-typescale-font-family-plain: "Inter", system-ui, sans-serif;
  --md-sys-typescale-font-family-brand: "Playfair Display", serif;

  /* Adjust specific sizes (optional) */
  --md-sys-typescale-display-large-size: 4rem;
  --md-sys-typescale-display-large-line-height: 4.5rem;
  --md-sys-typescale-body-medium-size: 1rem;
  --md-sys-typescale-body-medium-line-height: 1.625rem;
}
```

Load your custom fonts via `next/font`:

```tsx
// src/app/layout.tsx
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then reference the font variables in your token overrides:

```css
:root {
  --md-sys-typescale-font-family-plain: var(--font-inter), system-ui, sans-serif;
  --md-sys-typescale-font-family-brand: var(--font-playfair), serif;
}
```

---

## Step 8: Customize Shape (Border Radius)

```css
:root {
  /* Sharper brand */
  --md-sys-shape-corner-extra-small: 2px;
  --md-sys-shape-corner-small: 4px;
  --md-sys-shape-corner-medium: 6px;
  --md-sys-shape-corner-large: 8px;
  --md-sys-shape-corner-extra-large: 12px;
}
```

Or for a rounder brand:

```css
:root {
  --md-sys-shape-corner-extra-small: 8px;
  --md-sys-shape-corner-small: 12px;
  --md-sys-shape-corner-medium: 16px;
  --md-sys-shape-corner-large: 24px;
  --md-sys-shape-corner-extra-large: 36px;
}
```

---

## Step 9: Customize Elevation (Shadows)

```css
:root {
  /* Softer, more subtle shadows */
  --md-sys-elevation-level-1: 0 1px 3px rgba(0, 0, 0, 0.08);
  --md-sys-elevation-level-2: 0 2px 6px rgba(0, 0, 0, 0.08);
  --md-sys-elevation-level-3: 0 3px 8px rgba(0, 0, 0, 0.1);
  --md-sys-elevation-level-4: 0 4px 12px rgba(0, 0, 0, 0.12);
  --md-sys-elevation-level-5: 0 6px 16px rgba(0, 0, 0, 0.14);
}
```

---

## Complete `globals.css` Example

Here is a full example combining all customizations:

```css
/* src/app/globals.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";

/* ============================================
   BRAND THEME
   ============================================ */

:root {
  /* --- Colors (primary teal palette) --- */
  --md-ref-palette-primary0: #000000;
  --md-ref-palette-primary10: #002020;
  --md-ref-palette-primary20: #003737;
  --md-ref-palette-primary30: #004f4f;
  --md-ref-palette-primary40: #006a6a;
  --md-ref-palette-primary50: #008585;
  --md-ref-palette-primary60: #00a1a1;
  --md-ref-palette-primary70: #23bdbd;
  --md-ref-palette-primary80: #4ddada;
  --md-ref-palette-primary90: #b2fefe;
  --md-ref-palette-primary95: #d6fffe;
  --md-ref-palette-primary99: #f5fffe;
  --md-ref-palette-primary100: #ffffff;

  /* --- Typography --- */
  --md-sys-typescale-font-family-plain: var(--font-inter), system-ui, sans-serif;
  --md-sys-typescale-font-family-brand: var(--font-playfair), serif;

  /* --- Shape (slightly sharper) --- */
  --md-sys-shape-corner-extra-small: 3px;
  --md-sys-shape-corner-small: 6px;
  --md-sys-shape-corner-medium: 10px;
  --md-sys-shape-corner-large: 14px;
  --md-sys-shape-corner-extra-large: 20px;

  /* --- Elevation (softer) --- */
  --md-sys-elevation-level-1: 0 1px 3px rgba(0, 0, 0, 0.08);
  --md-sys-elevation-level-2: 0 2px 6px rgba(0, 0, 0, 0.08);
}
```

---

## Token Reference

| Namespace | Controls | Example Variable |
|---|---|---|
| `--md-ref-palette-*` | Raw tonal palette (hex values) | `--md-ref-palette-primary40` |
| `--md-sys-color-*` | Semantic color roles | `--md-sys-color-primary` |
| `--md-sys-typescale-*` | Font sizes, line-heights, weights, families | `--md-sys-typescale-display-large-size` |
| `--md-sys-shape-corner-*` | Border radius scale | `--md-sys-shape-corner-medium` |
| `--md-sys-elevation-level-*` | Box shadow values | `--md-sys-elevation-level-2` |
| `--md-sys-motion-*` | Animation durations and easings | `--md-sys-motion-duration-medium2` |

---

## Tailwind Utility Classes Available

After setup, you can use these MD3 token-mapped utilities in your own components:

| Category | Example Utilities |
|---|---|
| Colors | `bg-primary`, `text-on-primary`, `bg-surface-container`, `border-outline` |
| Typography | `text-display-large`, `text-headline-medium`, `text-body-small`, `text-label-large` |
| Elevation | `shadow-elevation-1`, `shadow-elevation-2`, `shadow-elevation-3` |
| Shape | `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` |
| Motion | `duration-short4`, `ease-standard`, `ease-expressive-fast-spatial` |
| Animations | `animate-md-fade-in`, `animate-md-scale-in`, `animate-md-slide-in-bottom` |
| State layers | `opacity-8`, `opacity-12`, `opacity-38` |

---

## Troubleshooting

### Components render but look unstyled

You are missing the `@source` directive. Add it to `globals.css`:

```css
@source "../node_modules/@tinybigui/react/dist";
```

### `text-display-large` has no effect

Ensure you are using Tailwind CSS v4 (check `package.json`). Tailwind v3 does not support the `@theme` syntax used by TinyBigUI.

### Dark mode does not switch

Add `.dark` class to `<html>` for manual toggling, or confirm your OS is set to dark mode. The library respects `prefers-color-scheme: dark` by default.

### Custom fonts do not apply

Verify the CSS variable names match between `next/font` and the token overrides. Use the `variable` option in `next/font` and reference the CSS variable in your `--md-sys-typescale-font-family-*` override.
