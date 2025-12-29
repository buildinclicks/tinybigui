# Task 1.3: Tokens Package Setup

**Status**: ✅ Completed  
**Date**: December 29, 2025  
**Part**: Phase 0 - Part B (Project Initialization)

---

## 📋 Overview

This task created the `@tinybigui/tokens` package, which contains Material Design 3 design tokens as CSS custom properties (variables). This package is framework-agnostic and can be used with React, Vue, Svelte, or vanilla JavaScript.

---

## 📄 Files Created

1. `packages/tokens/package.json` - Package configuration
2. `packages/tokens/src/tokens.css` - Design tokens as CSS variables
3. `packages/tokens/scripts/build.js` - Build script

---

## 🔍 Detailed Explanation

### File 1: `packages/tokens/package.json`

This is a **pure CSS package** (no JavaScript, just design tokens).

#### Key Differences from React Package:

**1. Side Effects**
```json
{
  "sideEffects": true
}
```
- **Always** `true` for CSS packages
- Importing CSS **has side effects** (styles applied globally)
- Bundlers won't remove it even if "unused"

**React package comparison:**
```json
"sideEffects": ["**/*.css"]  // Only CSS has side effects
```

**2. Exports**
```json
{
  "exports": {
    "./tokens.css": "./dist/tokens.css",
    "./package.json": "./package.json"
  }
}
```
- **Only exports CSS**, no JavaScript code
- Users import: `import "@tinybigui/tokens/tokens.css"`
- No ESM/CJS distinction needed (it's just CSS)

**3. Build Script**
```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "dev": "node scripts/build.js --watch"
  }
}
```
- Simple Node.js script (no fancy build tools)
- Just copies CSS from `src/` to `dist/`
- Can be enhanced later for token generation

**4. Publish Config**
```json
{
  "publishConfig": {
    "access": "public"
  }
}
```
- Same as React package
- Makes it publicly accessible on NPM

---

### Why a Separate Package?

**Advantages:**

1. **Framework-agnostic**
   - Works with React, Vue, Svelte, vanilla JS
   - Not tied to React ecosystem

2. **Flexibility**
   - Users can use tokens without components
   - Can build custom components using our tokens

3. **Smaller bundle**
   - Only include what you need
   - Tokens package is ~5KB
   - React package will be larger

4. **Clear separation**
   - Design tokens ≠ component logic
   - Follows single responsibility principle

**Usage examples:**

```javascript
// Option 1: Use tokens + components
import '@tinybigui/tokens/tokens.css';
import { Button } from '@tinybigui/react';

// Option 2: Use tokens only (custom components)
import '@tinybigui/tokens/tokens.css';
// Build your own components using CSS variables

// Option 3: Use components only (includes tokens internally)
import { Button } from '@tinybigui/react';
import '@tinybigui/react/styles.css';
```

---

### File 2: `packages/tokens/src/tokens.css`

The **actual design tokens** as CSS custom properties.

#### Structure Overview:

```css
:root {
  /* Color tokens */
  /* Typography tokens */
  /* Shape tokens */
  /* Elevation tokens */
  /* Motion tokens */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode color overrides */
  }
}
```

---

#### 1. Color System (Material Design 3)

**Light mode colors:**
```css
:root {
  /* Primary */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;
}
```

**What each token means:**

| Token | Purpose | Example Use |
|-------|---------|-------------|
| `primary` | Main brand color | Button background, FAB |
| `on-primary` | Content on primary color | Button text, icon |
| `primary-container` | Lighter variant for containers | Selected states, chips |
| `on-primary-container` | Content on container | Text on selected chips |

**MD3 Color Roles:**
- **Primary** - Highest emphasis (main actions)
- **Secondary** - Medium emphasis (secondary actions)
- **Tertiary** - Low emphasis (accents, alternative actions)
- **Error** - Error states, destructive actions
- **Surface** - Background surfaces (cards, sheets)
- **Outline** - Borders, dividers

---

#### 2. Typography Tokens

```css
:root {
  /* Font family */
  --md-sys-typescale-font-family: system-ui, -apple-system, sans-serif;
  
  /* Display Large */
  --md-sys-typescale-display-large-size: 3.5625rem;
  --md-sys-typescale-display-large-line-height: 4rem;
  --md-sys-typescale-display-large-weight: 400;
}
```

**MD3 Type Scale:**

| Scale | Size | Use Case |
|-------|------|----------|
| Display Large | 57px | Hero headings |
| Headline Large | 32px | Page headings |
| Body Large | 16px | Body text |
| Label Large | 14px | Button labels, form labels |

**Why separate tokens for size/weight/line-height?**
- ✅ Granular control
- ✅ Can override individually
- ✅ Better responsive design

**Usage:**
```css
.heading {
  font-size: var(--md-sys-typescale-headline-large-size);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-weight: var(--md-sys-typescale-headline-large-weight);
}
```

---

#### 3. Shape Tokens (Border Radius)

```css
:root {
  --md-sys-shape-corner-none: 0;
  --md-sys-shape-corner-extra-small: 0.25rem;    /* 4px */
  --md-sys-shape-corner-small: 0.5rem;           /* 8px */
  --md-sys-shape-corner-medium: 0.75rem;         /* 12px */
  --md-sys-shape-corner-large: 1rem;             /* 16px */
  --md-sys-shape-corner-extra-large: 1.75rem;    /* 28px */
  --md-sys-shape-corner-full: 624.9375rem;       /* 9999px */
}
```

**MD3 Shape System:**

| Component | Corner Size |
|-----------|-------------|
| Button | Small (8px) |
| Card | Medium (12px) |
| FAB | Large (16px) |
| Chip | Small (8px) |
| Dialog | Extra Large (28px) |

**Why 624.9375rem for "full"?**
- MD3 specification uses this value
- Ensures true circular corners
- Better than `9999px` or `100%`

---

#### 4. Elevation Tokens (Box Shadows)

```css
:root {
  --md-sys-elevation-level0: none;
  --md-sys-elevation-level1: 0 1px 2px 0 rgba(0, 0, 0, 0.3),
                             0 1px 3px 1px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level2: 0 1px 2px 0 rgba(0, 0, 0, 0.3),
                             0 2px 6px 2px rgba(0, 0, 0, 0.15);
  /* ... level3-5 ... */
}
```

**MD3 Elevation Levels:**

| Level | Use Case | Example |
|-------|----------|---------|
| 0 | Flat surfaces | Filled buttons, app bars |
| 1 | Slightly raised | Cards at rest |
| 2 | Raised | Dragged cards, hovered buttons |
| 3 | Floating | FAB, menus |
| 4 | Higher | Navigation drawer |
| 5 | Highest | Modal dialogs |

**Elevation structure:**
```css
/* Two shadows for depth perception */
box-shadow: 
  0 1px 2px 0 rgba(0, 0, 0, 0.3),     /* Key light (sharp) */
  0 1px 3px 1px rgba(0, 0, 0, 0.15);  /* Ambient light (soft) */
```

---

#### 5. Motion Tokens (Animation)

**Duration tokens:**
```css
:root {
  --md-sys-motion-duration-short1: 50ms;     /* Micro-interactions */
  --md-sys-motion-duration-short2: 100ms;    /* Simple transitions */
  --md-sys-motion-duration-short3: 150ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium1: 250ms;   /* Standard transitions */
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-long1: 450ms;     /* Complex animations */
  --md-sys-motion-duration-long2: 500ms;
}
```

**Easing tokens:**
```css
:root {
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
}
```

**When to use each easing:**

| Easing | Use Case | Example |
|--------|----------|---------|
| Standard | Most transitions | Hover states, focus |
| Emphasized | Entering elements | Dialog opening |
| Emphasized Decelerate | Elements entering screen | Slide-in menu |
| Emphasized Accelerate | Elements leaving screen | Slide-out menu |

**Usage:**
```css
.button {
  transition: 
    background-color var(--md-sys-motion-duration-short2) 
    var(--md-sys-motion-easing-standard);
}
```

---

#### 6. Dark Mode Support

**Automatic dark mode:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Override colors for dark mode */
    --md-sys-color-primary: #d0bcff;        /* Lighter purple */
    --md-sys-color-surface: #1c1b1f;         /* Dark surface */
    --md-sys-color-on-surface: #e6e1e5;      /* Light text */
  }
}
```

**How it works:**
1. Browser detects OS theme preference
2. Applies dark mode colors automatically
3. No JavaScript required
4. Instant (no flash of wrong theme)

**Color role reversal pattern:**

| Token | Light Mode | Dark Mode | Why? |
|-------|-----------|-----------|------|
| `primary` | Dark (#6750a4) | Light (#d0bcff) | Dark colors hurt eyes in dark mode |
| `surface` | White-ish (#fffbfe) | Black-ish (#1c1b1f) | Background inverts |
| `on-surface` | Black-ish (#1c1b1f) | White-ish (#e6e1e5) | Text needs contrast |

**MD3 Principle:**
- **Roles stay the same** (primary, surface, etc.)
- **Colors change** to maintain readability and depth

---

### File 3: `packages/tokens/scripts/build.js`

A **simple Node.js script** for building the tokens package.

```javascript
#!/usr/bin/env node

import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

async function build() {
  // 1. Create dist/ directory
  await mkdir(distDir, { recursive: true });
  
  // 2. Copy tokens.css to dist/
  await copyFile(srcFile, destFile);
  
  console.log('✨ Build complete!');
}

build();
```

**Current functionality:**
- ✅ Creates `dist/` folder
- ✅ Copies `src/tokens.css` → `dist/tokens.css`
- ✅ Simple, fast, no dependencies

**Future enhancements:**

**1. Generate tokens from seed color:**
```javascript
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

// User provides brand color
const seedColor = '#6750a4';
const theme = themeFromSourceColor(argbFromHex(seedColor));

// Generate full MD3 color palette
// Write to tokens.css
```

**2. Custom color schemes:**
```javascript
// Support multiple themes
buildTokens({ name: 'default', seedColor: '#6750a4' });
buildTokens({ name: 'ocean', seedColor: '#0077be' });
buildTokens({ name: 'forest', seedColor: '#2d5016' });
```

**3. TypeScript definitions:**
```javascript
// Generate TypeScript types for tokens
interface MDTokens {
  'md-sys-color-primary': string;
  'md-sys-color-secondary': string;
  // ...
}
```

**4. Validation:**
```javascript
// Ensure all required tokens are present
// Check color contrast ratios (accessibility)
// Validate token naming conventions
```

---

## 🎯 What This Setup Achieves

✅ **Framework-agnostic** - Works with any JavaScript framework  
✅ **CSS-first** - Native CSS custom properties  
✅ **MD3 compliant** - Follows Material Design 3 specifications  
✅ **Dark mode ready** - Automatic theme switching  
✅ **Extensible** - Easy to add more tokens  
✅ **Type-safe** - Can generate TypeScript definitions  
✅ **Small bundle** - Just CSS (~5KB)  
✅ **No dependencies** - Pure CSS, no runtime JS  

---

## 🎓 Key Learnings

### CSS Custom Properties (Variables)

**Advantages over preprocessor variables (Sass/Less):**

| Feature | CSS Variables | Sass Variables |
|---------|---------------|----------------|
| Runtime update | ✅ Yes | ❌ No (compile-time) |
| Browser-native | ✅ Yes | ❌ Needs compilation |
| JavaScript access | ✅ Yes | ❌ No |
| Dynamic theming | ✅ Easy | ❌ Hard |
| Inheritance | ✅ Yes | ❌ No |

**Example - Runtime theming:**
```javascript
// Change theme dynamically
document.documentElement.style.setProperty(
  '--md-sys-color-primary',
  '#0077be'
);
// All components update instantly! ✅
```

**Can't do this with Sass:**
```scss
$primary: #6750a4;  // Fixed at compile time ❌
```

---

### Material Design 3 Token Naming

**Pattern:**
```
--md-sys-{category}-{role/variant}
```

**Examples:**
- `--md-sys-color-primary` = System Color, Primary role
- `--md-sys-typescale-body-large-size` = System Typography, Body Large, Size
- `--md-sys-shape-corner-medium` = System Shape, Corner, Medium

**Why this naming?**

1. **Namespace** (`md-sys-`) - Prevents conflicts with user variables
2. **Category** (`color`, `typescale`) - Groups related tokens
3. **Role** (`primary`, `body-large`) - Semantic meaning
4. **Property** (`size`, `weight`) - Specific value

**Consistency with official MD3:**
- ✅ Matches Android Material 3
- ✅ Matches Flutter Material 3
- ✅ Matches official documentation
- ✅ Easy to find in specs

---

### Dark Mode Strategies

**Three approaches:**

**1. System preference (implemented):**
```css
@media (prefers-color-scheme: dark) { }
```
- ✅ Respects user's OS setting
- ✅ No JavaScript needed
- ✅ No flash of wrong theme
- ❌ Can't override per-site

**2. Manual toggle (future):**
```css
[data-theme="dark"] { }
```
- ✅ User controls per-site
- ✅ Persists preference
- ❌ Requires JavaScript
- ❌ Possible flash on load

**3. Hybrid (best):**
```css
@media (prefers-color-scheme: dark) { }  /* Default to system */
[data-theme="light"] { }  /* Force light */
[data-theme="dark"] { }   /* Force dark */
```
- ✅ Best of both worlds
- ✅ System default, manual override
- ✅ Accessible

---

## 📊 Directory Structure After Task 1.3

```
packages/tokens/
├── package.json            ← Package config
├── src/
│   └── tokens.css         ← Source tokens (MD3 CSS variables)
├── scripts/
│   └── build.js           ← Build script (copy CSS)
└── dist/                  ← Build output (generated)
    └── tokens.css         ← Published CSS file
```

---

## ✅ Verification Steps

To verify this task was completed correctly:

1. **Check package name:**
   ```bash
   cat packages/tokens/package.json | grep '"name"'
   # Should show: "@tinybigui/tokens"
   ```

2. **Verify tokens exist:**
   ```bash
   grep "md-sys-color-primary" packages/tokens/src/tokens.css
   # Should find color definitions
   ```

3. **Check build script:**
   ```bash
   cat packages/tokens/scripts/build.js | grep "copyFile"
   # Should show copy operation
   ```

4. **Verify dark mode:**
   ```bash
   grep "prefers-color-scheme: dark" packages/tokens/src/tokens.css
   # Should find dark mode media query
   ```

---

## 🔗 Related Tasks

- **Previous**: Task 1.2 (React Package Setup)
- **Next**: Task 2.1 (Root TypeScript Config)
- **Depends on**: Task 1.1 (workspace configuration)
- **Required for**: Task 4.2 (Tailwind v4 configuration), Task 5.x (Token generation)

---

## 📝 Commit Information

**Commit**: Not yet committed (will be in next commit with Task 1.3)  
**Files to commit**:
- `packages/tokens/package.json`
- `packages/tokens/src/tokens.css`
- `packages/tokens/scripts/build.js`

---

## 🤔 Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Token format | CSS custom properties | Browser-native, dynamic, modern |
| Token naming | MD3 specification | Consistency with official Material |
| Dark mode | System preference | Zero JS, instant, accessible |
| Build tool | Node.js script | Simple, no dependencies, extensible |
| Separate package | Yes | Framework-agnostic, flexible |
| Package scope | @tinybigui | Matches React package |

---

## 📚 References

- [Material Design 3 Design Tokens](https://m3.material.io/foundations/design-tokens/overview)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Material Design 3 Color System](https://m3.material.io/styles/color/system/overview)

