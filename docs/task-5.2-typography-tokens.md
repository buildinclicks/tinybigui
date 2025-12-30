# Task 5.2: Typography Tokens

**Status**: ✅ Completed  
**Date**: December 30, 2025  
**Part**: Phase 0 - Part F (Design Tokens)

---

## 📋 Overview

This task completed the Material Design 3 typography system by implementing all 15 type styles across 5 categories. Previously, we only had 4 placeholder styles; now we have the complete MD3 type scale with size, line-height, weight, and letter-spacing tokens.

---

## 📄 What Changed

### File Modified: `packages/tokens/src/tokens.css`

**Before (4 placeholder styles):**
- Display Large
- Headline Large
- Body Large
- Label Large

**After (15 complete styles):**
- Display: Large, Medium, Small
- Headline: Large, Medium, Small
- Title: Large, Medium, Small
- Body: Large, Medium, Small
- Label: Large, Medium, Small

---

## 📝 Material Design 3 Type Scale

### Complete Typography System

MD3 organizes typography into **5 categories**, each with **3 sizes** (Large, Medium, Small):

| Category | Purpose | Sizes | Total |
|----------|---------|-------|-------|
| **Display** | Large, expressive text | L, M, S | 3 |
| **Headline** | High-emphasis text | L, M, S | 3 |
| **Title** | Medium-emphasis text | L, M, S | 3 |
| **Body** | Plain body text | L, M, S | 3 |
| **Label** | UI labels, buttons | L, M, S | 3 |
| **Total** | | | **15** |

---

## 🎨 Typography Categories Explained

### 1. Display (57px, 45px, 36px)

**Purpose**: Large, expressive text for marketing or hero sections.

**Characteristics:**
- Largest type sizes
- Light weight (400)
- Wide line-height for readability
- Negative letter-spacing on large size

**Use cases:**
- Hero headlines
- Marketing headers
- Landing page titles
- Splash screens

**Example:**
```css
--md-sys-typescale-display-large-size: 3.5625rem;        /* 57px */
--md-sys-typescale-display-large-line-height: 4rem;       /* 64px */
--md-sys-typescale-display-large-weight: 400;
--md-sys-typescale-display-large-tracking: -0.25px;       /* Tighter spacing */
```

---

### 2. Headline (32px, 28px, 24px)

**Purpose**: High-emphasis text for important sections.

**Characteristics:**
- Prominent but not oversized
- Regular weight (400)
- Good for hierarchical structure
- Zero letter-spacing

**Use cases:**
- Page titles
- Section headings
- Dialog titles
- Card headers

**Example:**
```css
--md-sys-typescale-headline-large-size: 2rem;            /* 32px */
--md-sys-typescale-headline-large-line-height: 2.5rem;    /* 40px */
--md-sys-typescale-headline-large-weight: 400;
--md-sys-typescale-headline-large-tracking: 0;
```

---

### 3. Title (22px, 16px, 14px)

**Purpose**: Medium-emphasis text for subtitles and labels.

**Characteristics:**
- Smaller than headlines
- Medium weight (500) for emphasis
- Slight letter-spacing for readability
- Distinct from body text

**Use cases:**
- App bar titles
- List item titles
- Card subtitles
- Tab labels

**Example:**
```css
--md-sys-typescale-title-medium-size: 1rem;              /* 16px */
--md-sys-typescale-title-medium-line-height: 1.5rem;      /* 24px */
--md-sys-typescale-title-medium-weight: 500;              /* Medium */
--md-sys-typescale-title-medium-tracking: 0.15px;         /* Slight spacing */
```

---

### 4. Body (16px, 14px, 12px)

**Purpose**: Plain body text for paragraphs and content.

**Characteristics:**
- Most readable sizes
- Regular weight (400)
- Generous line-height
- Moderate letter-spacing

**Use cases:**
- Paragraph text
- Descriptions
- Content blocks
- Long-form reading

**Example:**
```css
--md-sys-typescale-body-large-size: 1rem;                /* 16px */
--md-sys-typescale-body-large-line-height: 1.5rem;        /* 24px */
--md-sys-typescale-body-large-weight: 400;
--md-sys-typescale-body-large-tracking: 0.5px;            /* Loose for readability */
```

---

### 5. Label (14px, 12px, 11px)

**Purpose**: UI labels, button text, and small annotations.

**Characteristics:**
- Small but readable
- Medium weight (500) for emphasis
- Higher letter-spacing
- Optimized for UI elements

**Use cases:**
- Button labels
- Input labels
- Chips
- Badges
- Captions

**Example:**
```css
--md-sys-typescale-label-large-size: 0.875rem;           /* 14px */
--md-sys-typescale-label-large-line-height: 1.25rem;      /* 20px */
--md-sys-typescale-label-large-weight: 500;               /* Medium */
--md-sys-typescale-label-large-tracking: 0.1px;
```

---

## 📐 Token Structure

Each type style has **4 properties**:

```css
--md-sys-typescale-{category}-{size}-{property}
```

### Properties:

1. **size** - Font size in rem
2. **line-height** - Line height in rem
3. **weight** - Font weight (400, 500)
4. **tracking** - Letter spacing in px

### Example (Title Medium):

```css
--md-sys-typescale-title-medium-size: 1rem;              /* 16px */
--md-sys-typescale-title-medium-line-height: 1.5rem;      /* 24px */
--md-sys-typescale-title-medium-weight: 500;
--md-sys-typescale-title-medium-tracking: 0.15px;
```

---

## 📊 Complete Type Scale Reference

### Visual Hierarchy

```
Display Large     57px (3.5625rem) - Hero headlines
Display Medium    45px (2.8125rem)
Display Small     36px (2.25rem)

Headline Large    32px (2rem)      - Page titles
Headline Medium   28px (1.75rem)
Headline Small    24px (1.5rem)

Title Large       22px (1.375rem)  - Section titles
Title Medium      16px (1rem)
Title Small       14px (0.875rem)

Body Large        16px (1rem)      - Body text
Body Medium       14px (0.875rem)
Body Small        12px (0.75rem)

Label Large       14px (0.875rem)  - UI labels
Label Medium      12px (0.75rem)
Label Small       11px (0.6875rem)
```

---

## 🎯 Usage Examples

### Using CSS Variables Directly

```css
.hero-title {
  font-family: var(--md-sys-typescale-font-family-brand);
  font-size: var(--md-sys-typescale-display-large-size);
  line-height: var(--md-sys-typescale-display-large-line-height);
  font-weight: var(--md-sys-typescale-display-large-weight);
  letter-spacing: var(--md-sys-typescale-display-large-tracking);
}

.page-heading {
  font-family: var(--md-sys-typescale-font-family-plain);
  font-size: var(--md-sys-typescale-headline-large-size);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}

.button-label {
  font-size: var(--md-sys-typescale-label-large-size);
  line-height: var(--md-sys-typescale-label-large-line-height);
  font-weight: var(--md-sys-typescale-label-large-weight);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
}
```

### Creating Typography Utility Classes

```css
/* In component styles or utility CSS */

.text-display-lg {
  font-size: var(--md-sys-typescale-display-large-size);
  line-height: var(--md-sys-typescale-display-large-line-height);
  font-weight: var(--md-sys-typescale-display-large-weight);
  letter-spacing: var(--md-sys-typescale-display-large-tracking);
}

.text-headline-md {
  font-size: var(--md-sys-typescale-headline-medium-size);
  line-height: var(--md-sys-typescale-headline-medium-line-height);
  font-weight: var(--md-sys-typescale-headline-medium-weight);
  letter-spacing: var(--md-sys-typescale-headline-medium-tracking);
}

.text-body-lg {
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}
```

### React Component Usage

```tsx
// Headline component
function Headline({ size = 'large', children }) {
  const sizeStyles = {
    large: {
      fontSize: 'var(--md-sys-typescale-headline-large-size)',
      lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
      fontWeight: 'var(--md-sys-typescale-headline-large-weight)',
      letterSpacing: 'var(--md-sys-typescale-headline-large-tracking)',
    },
    // ... medium, small
  };
  
  return <h2 style={sizeStyles[size]}>{children}</h2>;
}

// Usage
<Headline size="large">Welcome to TinyBigUI</Headline>
```

---

## 🎓 Design Principles

### 1. Font Families

**Two families defined:**

```css
--md-sys-typescale-font-family-plain: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--md-sys-typescale-font-family-brand: var(--md-sys-typescale-font-family-plain);
```

**Why system fonts?**
- ✅ No loading time (already on device)
- ✅ Excellent rendering
- ✅ Matches OS aesthetics
- ✅ Zero cost (no web fonts)

**Brand vs Plain:**
- Currently the same
- Users can customize `brand` for headers
- `plain` for body text

**Example customization:**
```css
:root {
  --md-sys-typescale-font-family-brand: 'Inter', system-ui, sans-serif;
  /* plain stays system-ui */
}
```

---

### 2. Rem Units (Not Pixels)

**Why rem?**
- ✅ Respects user's browser font size settings
- ✅ Accessible (users with visual impairments)
- ✅ Scales proportionally
- ✅ Better than fixed pixels

**Conversion:**
```
1rem = 16px (browser default)
User increases browser font → everything scales
```

**Example:**
- Default: `1rem = 16px`
- User sets 20px base: `1rem = 20px` (everything 25% larger)

---

### 3. Letter Spacing (Tracking)

**Strategic spacing for readability:**

| Size | Tracking | Why |
|------|----------|-----|
| Display Large | -0.25px | Tighter (large text looks spaced out) |
| Headline | 0px | Neutral |
| Title | 0.1-0.15px | Slight spacing (medium weight needs it) |
| Body | 0.25-0.5px | Looser (improves readability) |
| Label | 0.1-0.5px | Varies by size (small text needs more) |

**General rule:**
- Larger text → tighter spacing
- Smaller text → looser spacing
- Heavier weight → more spacing

---

### 4. Line Height

**Generous spacing for readability:**

**Formula (approximate):**
- Large text: 1.12-1.15x font size
- Medium text: 1.25-1.5x font size
- Small text: 1.33-1.5x font size

**Why important?**
- ✅ Comfortable reading
- ✅ Prevents lines from running together
- ✅ Better for multi-line text

**Example:**
```css
/* Body Large */
font-size: 1rem;           /* 16px */
line-height: 1.5rem;       /* 24px = 1.5× */
/* ↑ Good for paragraphs */

/* Display Large */
font-size: 3.5625rem;      /* 57px */
line-height: 4rem;         /* 64px = 1.12× */
/* ↑ Tighter for short headlines */
```

---

### 5. Font Weights

**Only two weights used:**

- **400 (Regular)**: Display, Headline, Body
- **500 (Medium)**: Title, Label

**Why not more?**
- ✅ System fonts may not have all weights
- ✅ Simpler, more consistent
- ✅ Medium weight gives enough emphasis
- ✅ Reduces font loading (if using web fonts)

---

## 📱 Responsive Typography (Future)

**Current implementation:** Fixed sizes (work on all screens)

**Future enhancement:** Responsive sizes

```css
/* Future: Responsive Display Large */
@media (max-width: 640px) {
  :root {
    --md-sys-typescale-display-large-size: 2.25rem;  /* 36px on mobile */
  }
}

@media (min-width: 641px) {
  :root {
    --md-sys-typescale-display-large-size: 3.5625rem;  /* 57px on desktop */
  }
}
```

**Why wait?**
- Current sizes work well on all devices
- MD3 doesn't mandate responsive sizes
- Can be added based on user feedback

---

## ✅ What This Achieves

✅ **Complete MD3 type scale** - All 15 styles (was 4)  
✅ **Semantic naming** - Clear purpose for each style  
✅ **Consistent properties** - Size, line-height, weight, tracking  
✅ **Accessible** - Rem units, good line-height  
✅ **System fonts** - Fast, native, zero cost  
✅ **Ready for components** - Can be used immediately  
✅ **Customizable** - Users can override via CSS variables  

---

## 🔗 Related Tasks

- **Previous**: Task 5.1 (Color Tokens)
- **Next**: Task 5.3 (Elevation, Shape, Motion Tokens)
- **Related**: Task 1.3 (Tokens package initial setup)

---

## 📚 References

- [Material Design 3 Typography](https://m3.material.io/styles/typography/overview)
- [MD3 Type Scale](https://m3.material.io/styles/typography/type-scale-tokens)
- [Web Typography Best Practices](https://web.dev/typography/)
- [CSS rem Units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)

---

## ✅ Task Complete!

Typography system is now complete with all 15 MD3 type styles! 📝

**Summary of Changes:**
- **Added**: 11 new type styles (from 4 → 15 total)
- **Added**: Letter-spacing (tracking) tokens
- **Added**: Brand and plain font family tokens
- **Improved**: Documentation and comments
- **File Modified**: `packages/tokens/src/tokens.css`

Ready for component development with complete typography support! 🎨

