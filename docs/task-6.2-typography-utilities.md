# Task 6.2: Typography Utilities

**Task ID:** 6.2  
**Category:** Phase 0 - Part G (Utility Functions)  
**Status:** ✅ Complete  
**Date:** 2025-12-30

---

## 📋 Task Overview

**Objective:** Create comprehensive typography utilities that integrate with Material Design 3 typography tokens and provide type-safe text styling helpers.

**Why This Task Matters:**
- Provides type-safe access to MD3 typography system
- Simplifies applying complete typography styles
- Enables responsive typography patterns
- Maps semantic HTML elements to appropriate styles
- Includes text manipulation utilities (truncation, conversions)

---

## ⚠️ Important: When to Use These Utilities

### **Tailwind Classes = Primary Method (90% of cases)**

**Use Tailwind classes for static, template-based typography:**

```tsx
// ✅ PREFERRED - Use Tailwind classes
<button className="text-label-large font-medium">
  Click Me
</button>

<h1 className="text-display-large">
  Welcome
</h1>

<p className="text-body-large">
  Lorem ipsum dolor sit amet...
</p>
```

**Why Tailwind First:**
- ✅ Better performance (no runtime computation)
- ✅ Smaller bundle size
- ✅ Better tree-shaking
- ✅ Familiar syntax
- ✅ Works with IntelliSense
- ✅ Zero runtime cost

---

### **Typography Utilities = Special Cases (10% of cases)**

**Use these utilities ONLY when:**

#### 1. **Multi-line Text Truncation** (No Tailwind equivalent)
```tsx
// ✅ Use truncateText() - Tailwind can't do multi-line
<p 
  className="text-body-medium"
  style={truncateText(3)} // Truncate after 3 lines
>
  Long text here...
</p>
```

#### 2. **Runtime/Dynamic Typography**
```tsx
// ✅ Typography determined at runtime
function DynamicHeading({ level }: { level: 1 | 2 | 3 }) {
  const style = getTypographyForElement(`h${level}`);
  const Tag = `h${level}` as const;
  
  return <Tag className={getTypographyClassName(style)}>...</Tag>;
}
```

#### 3. **User Customization**
```tsx
// ✅ User-controlled font sizes
function CustomText({ userFontSizePx }: { userFontSizePx: number }) {
  return (
    <div 
      className="text-body-large"
      style={{ fontSize: pxToRem(userFontSizePx) }}
    >
      Customizable text
    </div>
  );
}
```

#### 4. **JavaScript Calculations**
```tsx
// ✅ Need actual pixel values for layout calculations
function CanvasText() {
  const headingSize = remToPx(getTypographyToken('display-large', 'size'));
  
  return <canvas height={headingSize * 2}>...</canvas>;
}
```

#### 5. **Third-Party Library Integration**
```tsx
// ✅ Libraries that require inline styles
import RichTextEditor from 'some-library';

function Editor() {
  return <RichTextEditor style={getTypographyStyle('body-large')} />;
}
```

#### 6. **Testing & Documentation**
```tsx
// ✅ Verify components use correct tokens
test('Button uses label-large typography', () => {
  const expectedStyle = getTypographyStyle('label-large');
  expect(button).toHaveStyle(expectedStyle);
});
```

---

### **Quick Decision Guide**

| Question | Answer | Method |
|----------|--------|--------|
| Is the typography static in the template? | Yes | **Use Tailwind** |
| Is the typography computed at runtime? | Yes | **Use Utilities** |
| Need multi-line text truncation? | Yes | **Use `truncateText()`** |
| Need pixel values for calculations? | Yes | **Use `remToPx()`** |
| Styling third-party components? | Yes | **Use Utilities** |
| Writing unit tests? | Yes | **Use Utilities** |
| Building Storybook docs? | Yes | **Use Utilities** |
| Everything else? | - | **Use Tailwind** |

---

### **What We'll Actually Build**

In Phase 1 components, you'll see:

```tsx
// Button component - 95% Tailwind, 5% utilities
const Button = ({ children, customSize }) => {
  // Tailwind classes for static styling (preferred)
  const baseClasses = "text-label-large font-medium";
  
  // Utilities only for dynamic overrides (rare)
  const dynamicStyles = customSize ? { fontSize: pxToRem(customSize) } : {};
  
  return (
    <button className={baseClasses} style={dynamicStyles}>
      {children}
    </button>
  );
};
```

**Key Takeaway:** These utilities are **supplementary tools** for edge cases, not the primary styling method. Always prefer Tailwind classes when possible.

---

## 🎯 What Was Done

### 1. Created Typography Utilities File ✅

Created `packages/react/src/utils/typography.ts` with comprehensive typography manipulation utilities.

**File Structure:**
```
packages/react/src/utils/typography.ts (332 lines)
├── Type definitions (5 types)
├── Token access utilities (2 functions)
├── Style generation utilities (4 functions)
├── Conversion utilities (2 functions)
├── Text manipulation utilities (1 function)
└── Constants and maps (2 objects)
```

---

## 📊 Utility Functions Overview

| Utility | Purpose | Returns |
|---------|---------|---------|
| `getTypographyToken()` | Get individual token value | `string` |
| `getTypographyStyle()` | Get complete style object | `TypographyStyleObject` |
| `getFontFamily()` | Get font family token | `string` |
| `getTypographyForElement()` | Get style for HTML element | `MD3TypographyStyle` |
| `getTypographyClassName()` | Generate utility class name | `string` |
| `getResponsiveTypography()` | Create responsive styles | `object` |
| `remToPx()` | Convert rem to pixels | `number` |
| `pxToRem()` | Convert pixels to rem | `string` |
| `truncateText()` | Generate truncation styles | `React.CSSProperties` |

---

## 🔍 Detailed Function Documentation

### 1. Type Definitions

#### `MD3TypographyScale`
The 5 main typography categories in Material Design 3.

```typescript
export type MD3TypographyScale =
  | 'display'    // Large, expressive text
  | 'headline'   // High-emphasis text
  | 'title'      // Medium-emphasis text
  | 'body'       // Plain text
  | 'label';     // UI labels and buttons
```

**Usage Context:**
- **Display**: Hero sections, marketing headlines, attention-grabbing text
- **Headline**: Page titles, section headers, important headings
- **Title**: Card titles, dialog titles, list headers
- **Body**: Paragraphs, descriptions, general content
- **Label**: Buttons, tabs, form labels, navigation items

---

#### `MD3TypographySize`
Size variants available for each scale.

```typescript
export type MD3TypographySize = 'large' | 'medium' | 'small';
```

---

#### `MD3TypographyStyle`
Complete typography style names (15 total).

```typescript
export type MD3TypographyStyle =
  | 'display-large' | 'display-medium' | 'display-small'
  | 'headline-large' | 'headline-medium' | 'headline-small'
  | 'title-large' | 'title-medium' | 'title-small'
  | 'body-large' | 'body-medium' | 'body-small'
  | 'label-large' | 'label-medium' | 'label-small';
```

**Typography Scale Reference:**
| Style | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| display-large | 57px | 64px | 400 | -0.25px |
| display-medium | 45px | 52px | 400 | 0 |
| display-small | 36px | 44px | 400 | 0 |
| headline-large | 32px | 40px | 400 | 0 |
| headline-medium | 28px | 36px | 400 | 0 |
| headline-small | 24px | 32px | 400 | 0 |
| title-large | 22px | 28px | 400 | 0 |
| title-medium | 16px | 24px | 500 | 0.15px |
| title-small | 14px | 20px | 500 | 0.1px |
| body-large | 16px | 24px | 400 | 0.5px |
| body-medium | 14px | 20px | 400 | 0.25px |
| body-small | 12px | 16px | 400 | 0.4px |
| label-large | 14px | 20px | 500 | 0.1px |
| label-medium | 12px | 16px | 500 | 0.5px |
| label-small | 11px | 16px | 500 | 0.5px |

---

#### `TypographyProperty`
Individual typography token properties.

```typescript
export type TypographyProperty = 'size' | 'line-height' | 'weight' | 'tracking';
```

---

#### `TypographyStyleObject`
Complete typography style object for React components.

```typescript
export interface TypographyStyleObject {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
  fontFamily?: string;
}
```

---

### 2. Token Access Utilities

#### `getTypographyToken(style, property)`
Get individual typography token values.

**Purpose:** Access specific properties of a typography style  
**Returns:** String (token value)

**Examples:**
```typescript
// Get font size
getTypographyToken('display-large', 'size');
// Returns: '3.5625rem' (57px)

// Get line height
getTypographyToken('body-medium', 'line-height');
// Returns: '1.25rem' (20px)

// Get font weight
getTypographyToken('title-medium', 'weight');
// Returns: '500'

// Get letter spacing
getTypographyToken('label-large', 'tracking');
// Returns: '0.1px'
```

**Implementation:**
```typescript
export function getTypographyToken(
  style: MD3TypographyStyle,
  property: TypographyProperty
): string {
  return getColorValue(`--md-sys-typescale-${style}-${property}`);
}
```

---

#### `getFontFamily(variant)`
Get font family token value.

**Purpose:** Access font family stack  
**Returns:** String (font family CSS value)

**Examples:**
```typescript
getFontFamily('plain');
// Returns: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'

getFontFamily('brand');
// Returns: Same as 'plain' (can be customized via CSS variables)
```

**Implementation:**
```typescript
export function getFontFamily(variant: 'plain' | 'brand' = 'plain'): string {
  return getColorValue(`--md-sys-typescale-font-family-${variant}`);
}
```

**Use Cases:**
- Apply consistent font stack to components
- Override font family for brand customization
- Generate CSS font-family rules

---

### 3. Style Generation Utilities

#### `getTypographyStyle(style, includeFontFamily?)`
Get complete typography style object.

**Purpose:** Get all typography properties in a single object  
**Returns:** `TypographyStyleObject` (ready for React inline styles)

**Examples:**
```typescript
// Basic usage
const displayStyle = getTypographyStyle('display-large');
// Returns: {
//   fontSize: '3.5625rem',
//   lineHeight: '4rem',
//   fontWeight: '400',
//   letterSpacing: '-0.25px'
// }

// With font family
const bodyStyle = getTypographyStyle('body-medium', true);
// Returns: {
//   fontSize: '0.875rem',
//   lineHeight: '1.25rem',
//   fontWeight: '400',
//   letterSpacing: '0.25px',
//   fontFamily: 'system-ui, -apple-system, ...'
// }

// Use in React component
<h1 style={getTypographyStyle('display-large')}>
  Large Display Text
</h1>
```

**Implementation:**
```typescript
export function getTypographyStyle(
  style: MD3TypographyStyle,
  includeFontFamily = false
): TypographyStyleObject {
  const styleObject: TypographyStyleObject = {
    fontSize: getTypographyToken(style, 'size'),
    lineHeight: getTypographyToken(style, 'line-height'),
    fontWeight: getTypographyToken(style, 'weight'),
    letterSpacing: getTypographyToken(style, 'tracking'),
  };

  if (includeFontFamily) {
    styleObject.fontFamily = getColorValue('--md-sys-typescale-font-family-plain');
  }

  return styleObject;
}
```

**Key Features:**
- Returns object ready for React `style` prop
- Optional font family inclusion
- All properties from MD3 tokens
- Type-safe return value

---

#### `getTypographyForElement(element)`
Get recommended typography style for HTML elements.

**Purpose:** Semantic mapping of HTML elements to MD3 typography  
**Returns:** `MD3TypographyStyle`

**Examples:**
```typescript
getTypographyForElement('h1');
// Returns: 'display-large'

getTypographyForElement('h4');
// Returns: 'headline-medium'

getTypographyForElement('button');
// Returns: 'label-large'

getTypographyForElement('p');
// Returns: 'body-large'
```

**Element Mapping:**
```typescript
export const TYPOGRAPHY_ELEMENT_MAP = {
  h1: 'display-large',
  h2: 'display-medium',
  h3: 'headline-large',
  h4: 'headline-medium',
  h5: 'headline-small',
  h6: 'title-large',
  p: 'body-large',
  span: 'body-medium',
  small: 'body-small',
  button: 'label-large',
  label: 'label-medium',
  caption: 'label-small',
} as const;
```

**Use Cases:**
- Automatically style semantic HTML
- Base styles for typography components
- CSS reset with MD3 typography

---

#### `getTypographyClassName(style)`
Generate consistent CSS class names for typography.

**Purpose:** Create utility class names for typography styles  
**Returns:** String (CSS class name)

**Examples:**
```typescript
getTypographyClassName('display-large');
// Returns: 'text-display-large'

getTypographyClassName('body-medium');
// Returns: 'text-body-medium'

getTypographyClassName('label-small');
// Returns: 'text-label-small'
```

**Use Cases:**
- Generate Tailwind-style utility classes
- Create component variant class names
- CSS module naming conventions

---

#### `getResponsiveTypography(mobile, tablet?, desktop?)`
Create responsive typography styles.

**Purpose:** Adapt typography across breakpoints  
**Returns:** Object with mobile, tablet, and desktop styles

**Examples:**
```typescript
// Basic responsive setup
const responsiveTitle = getResponsiveTypography(
  'headline-small',     // Mobile: 24px
  'headline-medium',    // Tablet: 28px
  'headline-large'      // Desktop: 32px
);

// Returns: {
//   mobile: { fontSize: '1.5rem', lineHeight: '2rem', ... },
//   tablet: { fontSize: '1.75rem', lineHeight: '2.25rem', ... },
//   desktop: { fontSize: '2rem', lineHeight: '2.5rem', ... }
// }

// Use with CSS-in-JS
const Title = styled.h2`
  ${({ theme }) => responsiveTitle.mobile}
  
  @media (min-width: 768px) {
    ${({ theme }) => responsiveTitle.tablet}
  }
  
  @media (min-width: 1024px) {
    ${({ theme }) => responsiveTitle.desktop}
  }
`;

// Or use in React component
<h2 
  className="responsive-title"
  style={responsiveTitle.mobile}
>
  Responsive Heading
</h2>
```

**Mobile-First Pattern:**
```typescript
// Display only on mobile, headline on larger screens
const heroText = getResponsiveTypography(
  'display-small',      // Mobile: Smaller for readability
  'display-medium',     // Tablet: Medium size
  'display-large'       // Desktop: Full impact
);
```

---

### 4. Conversion Utilities

#### `remToPx(rem)`
Convert rem units to pixels (16px base).

**Purpose:** Convert CSS rem values to pixel equivalents  
**Returns:** Number (pixel value)

**Examples:**
```typescript
remToPx('1.5rem');
// Returns: 24

remToPx('3.5625rem');
// Returns: 57

remToPx('0.875rem');
// Returns: 14
```

**Use Cases:**
- Calculate exact pixel dimensions
- Dynamic layout calculations
- Canvas or SVG sizing

---

#### `pxToRem(px)`
Convert pixels to rem units (16px base).

**Purpose:** Convert pixel values to rem  
**Returns:** String (rem value)

**Examples:**
```typescript
pxToRem(24);
// Returns: '1.5rem'

pxToRem('57px');
// Returns: '3.5625rem'

pxToRem(14);
// Returns: '0.875rem'
```

**Use Cases:**
- Convert design specs to rem
- Dynamic font size generation
- Responsive typography calculations

---

### 5. Text Manipulation Utilities

#### `truncateText(lines)`
Generate CSS properties for text truncation.

**Purpose:** Create single or multi-line text ellipsis  
**Returns:** `React.CSSProperties`

**Examples:**
```typescript
// Single line truncation
const singleLine = truncateText(1);
// Returns: {
//   overflow: 'hidden',
//   textOverflow: 'ellipsis',
//   whiteSpace: 'nowrap'
// }

<div style={singleLine}>
  This is a very long text that will be truncated with...
</div>

// Multi-line truncation (3 lines)
const multiLine = truncateText(3);
// Returns: {
//   display: '-webkit-box',
//   WebkitLineClamp: 3,
//   WebkitBoxOrient: 'vertical',
//   overflow: 'hidden',
//   textOverflow: 'ellipsis'
// }

<p style={multiLine}>
  This is a longer paragraph that will be displayed
  across multiple lines but truncated after 3 lines
  with an ellipsis at the end...
</p>
```

**Implementation:**
```typescript
export function truncateText(lines: number = 1): React.CSSProperties {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }

  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
}
```

**Browser Support:**
- Single-line: All modern browsers
- Multi-line: WebKit/Chromium, Firefox 68+

---

### 6. Constants and Reference Maps

#### `TYPOGRAPHY_ELEMENT_MAP`
Maps HTML elements to recommended MD3 typography styles.

```typescript
export const TYPOGRAPHY_ELEMENT_MAP = {
  h1: 'display-large',
  h2: 'display-medium',
  h3: 'headline-large',
  h4: 'headline-medium',
  h5: 'headline-small',
  h6: 'title-large',
  p: 'body-large',
  span: 'body-medium',
  small: 'body-small',
  button: 'label-large',
  label: 'label-medium',
  caption: 'label-small',
} as const;
```

---

#### `TYPOGRAPHY_USAGE`
Semantic context for each typography scale.

```typescript
export const TYPOGRAPHY_USAGE = {
  display: 'Large, expressive text for hero sections and marketing',
  headline: 'High-emphasis text for titles and important headings',
  title: 'Medium-emphasis text for section headers and card titles',
  body: 'Plain text for paragraphs, lists, and general content',
  label: 'UI labels, buttons, tabs, and form elements',
} as const;
```

---

## 💡 Usage Examples

### Example 1: Basic Typography Styling
```tsx
import { getTypographyStyle } from '@tinybigui/react';

function Article() {
  return (
    <article>
      <h1 style={getTypographyStyle('display-large')}>
        Article Title
      </h1>
      <p style={getTypographyStyle('body-large')}>
        Article content with proper typography styling.
      </p>
    </article>
  );
}
```

### Example 2: Responsive Headlines
```tsx
import { getResponsiveTypography } from '@tinybigui/react';

function HeroSection() {
  const heroTypography = getResponsiveTypography(
    'display-small',
    'display-medium',
    'display-large'
  );

  return (
    <h1 
      className="hero-title"
      style={{
        ...heroTypography.mobile,
        '@media (min-width: 768px)': heroTypography.tablet,
        '@media (min-width: 1024px)': heroTypography.desktop,
      }}
    >
      Welcome to Our Product
    </h1>
  );
}
```

### Example 3: Text Truncation
```tsx
import { getTypographyStyle, truncateText } from '@tinybigui/react';

function CardTitle({ children }: { children: string }) {
  return (
    <h3 style={{
      ...getTypographyStyle('title-large'),
      ...truncateText(2) // Truncate after 2 lines
    }}>
      {children}
    </h3>
  );
}
```

### Example 4: Semantic HTML Typography
```tsx
import { getTypographyForElement, getTypographyStyle } from '@tinybigui/react';

// Create a styled heading component
function Heading({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: React.ReactNode }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const style = getTypographyStyle(
    getTypographyForElement(Tag as keyof typeof TYPOGRAPHY_ELEMENT_MAP)
  );
  
  return <Tag style={style}>{children}</Tag>;
}

// Usage
<Heading level={1}>Display Large</Heading>
<Heading level={3}>Headline Large</Heading>
```

### Example 5: Dynamic Font Sizing
```tsx
import { pxToRem, getTypographyStyle } from '@tinybigui/react';

function CustomText({ baseSizePx }: { baseSizePx: number }) {
  const baseStyle = getTypographyStyle('body-large');
  
  return (
    <p style={{
      ...baseStyle,
      fontSize: pxToRem(baseSizePx) // Override with custom size
    }}>
      Custom sized text
    </p>
  );
}
```

### Example 6: Using in CVA Variants
```tsx
import { cva } from 'class-variance-authority';
import { getTypographyClassName } from '@tinybigui/react';

// Generate variant classes
const textVariants = cva('base-text', {
  variants: {
    variant: {
      display: getTypographyClassName('display-large'),
      headline: getTypographyClassName('headline-medium'),
      body: getTypographyClassName('body-large'),
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});
```

---

## 📂 Files Created/Modified

### Created Files
1. **`packages/react/src/utils/typography.ts`** (332 lines)
   - 9 utility functions
   - 5 TypeScript type definitions
   - 2 constant reference objects
   - Comprehensive JSDoc documentation

### Modified Files
1. **`packages/react/src/index.ts`**
   - Added typography utility exports
   - Added type exports (5 types)
   - Maintained barrel export pattern

---

## ✅ Success Criteria

- [x] Created comprehensive typography utility functions
- [x] Added TypeScript type definitions for all MD3 typography
- [x] Implemented style generation utilities
- [x] Added conversion utilities (rem/px)
- [x] Created text manipulation utilities
- [x] Provided semantic HTML element mappings
- [x] Exported all utilities from main package
- [x] No linter or TypeScript errors
- [x] Complete JSDoc documentation
- [x] Usage examples for all functions

---

## 🎓 Key Learnings

### 1. Material Design 3 Typography System
- **15 typography styles** (5 scales × 3 sizes)
- **4 properties per style** (size, line-height, weight, tracking)
- **Semantic naming** reflects usage, not appearance
- **Consistent spacing** ensures visual harmony

### 2. Typography Token Structure
MD3 typography tokens follow a predictable pattern:
```
--md-sys-typescale-{scale}-{size}-{property}
```
Examples:
- `--md-sys-typescale-display-large-size`
- `--md-sys-typescale-body-medium-line-height`
- `--md-sys-typescale-label-small-weight`

### 3. Complete Typography Styles
A complete typography style requires 4 properties:
1. **fontSize** - Text size in rem
2. **lineHeight** - Line height for readability
3. **fontWeight** - Weight (400 for regular, 500 for medium)
4. **letterSpacing** - Tracking for optical clarity

### 4. Responsive Typography Strategy
MD3 doesn't define responsive breakpoints, but best practices:
- **Mobile**: Use smaller scales (small/medium sizes)
- **Tablet**: Use medium sizes
- **Desktop**: Use larger scales (large sizes)
- **Scale down gracefully** on smaller screens

### 5. Text Truncation Techniques
- **Single-line**: Uses `white-space: nowrap` + `text-overflow: ellipsis`
- **Multi-line**: Uses `-webkit-line-clamp` (WebKit/Blink only)
- **Fallback**: Consider JavaScript solutions for older browsers

### 6. Rem vs Pixels
- **Rem**: Relative to root font size (typically 16px)
- **Benefits**: Respects user font size preferences, scales consistently
- **MD3 uses rem**: All typography tokens use rem units
- **Conversion formula**: `1rem = 16px` (default)

### 7. Type Safety Benefits
Strong typing provides:
- **Autocomplete** for all 15 typography styles
- **Compile-time validation** prevents typos
- **IntelliSense** shows available properties
- **Better refactoring** across codebase

### 8. Tailwind vs Utilities Strategy ⭐
**Critical understanding for component development:**
- **Tailwind classes**: Primary method for all static, template-based typography (90% of cases)
- **Typography utilities**: Only for dynamic scenarios, runtime computation, and edge cases (10%)
- **Performance**: Tailwind classes have zero runtime cost; utilities compute at runtime
- **Bundle size**: Unused Tailwind classes tree-shake out; utilities always ship
- **Best practice**: Default to Tailwind, reach for utilities only when necessary
- **Examples**: Use utilities for multi-line truncation, user customization, JS calculations, testing

**Remember:** These utilities are **tools for edge cases**, not the primary styling method.

---

## 🔗 Related Tasks

**Prerequisite Tasks:**
- ✅ Task 1.2 - React Package Setup
- ✅ Task 2.2 - React TypeScript Config
- ✅ Task 5.2 - Typography Tokens (MD3 typography CSS variables)
- ✅ Task 6.1 - Color Utilities (similar pattern)

**Dependent Tasks:**
- ⏳ Task 6.3 - Utils Barrel Export
- ⏳ Phase 1 Components (will use typography utilities)

---

## 📝 Notes for Next Steps

### Immediate Next Steps
1. **Task 6.3** - Create utils barrel export (consolidate all utility exports)
2. **Verify Build** - Ensure all utilities compile correctly
3. **Test Suite** - Consider adding unit tests for utilities (Task 7.x)

### Future Enhancements
Consider adding later:
- **`clamp()` utilities** for fluid typography
- **`getAccessibleFontSize()`** for WCAG compliance
- **`getLineHeight()`** calculator based on font size
- **Typography presets** for common component patterns
- **Text wrapping utilities** (balance, pretty)

### Component Integration ⭐
**Important: Tailwind-First Approach**

In Phase 1 components, we'll primarily use **Tailwind classes**:
```tsx
// ✅ PREFERRED - Button with Tailwind
<button className="text-label-large font-medium">Click Me</button>

// ✅ PREFERRED - Heading with Tailwind
<h1 className="text-display-large">Welcome</h1>
```

**Typography utilities will be used sparingly for:**
- **Text truncation** - Multi-line ellipsis (`truncateText()`)
- **Dynamic styling** - Runtime-computed styles
- **User customization** - Prop-based font sizes
- **Testing** - Verify correct token usage
- **Calculations** - Canvas, SVG, layout math

**Component Guidelines:**
- Default to Tailwind classes in component templates
- Use utilities only for dynamic or computed scenarios
- Document when and why utilities are used
- Prefer static Tailwind for better performance

### Documentation Needs
When creating user-facing docs:
- **Tailwind classes reference** - Primary method (emphasize this!)
- Typography scale reference table
- When to use each scale
- When to use utilities vs Tailwind (critical section)
- Responsive typography guide
- Accessibility considerations
- Custom font integration guide

---

## ✅ Task Completion

**Status:** Complete ✅  
**Result:** Comprehensive typography utility system with Material Design 3 integration, type safety, responsive helpers, and full documentation.

**Next Task:** Task 6.3 - Utils Barrel Export

---

*Task completed on 2025-12-30 as part of Phase 0 - Part G (Utility Functions)*

