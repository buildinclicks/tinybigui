# Research 0.3: Material Design 3 FAB Specifications

**Date**: 2025-12-31  
**Source**: Material Design 3 Guidelines (m3.material.io)  
**Component**: Floating Action Button (FAB)

---

## 📚 Overview

Material Design 3 Floating Action Buttons (FABs) are high-emphasis buttons that perform the primary, most important action on a screen. They "float" above the UI and are prominently placed for easy access.

**Official Documentation**: https://m3.material.io/components/floating-action-button/overview

---

## 🎯 FAB Philosophy

**Key Principles:**
- **One per screen** - Should represent THE most important action
- **Persistent** - Stays visible as user scrolls
- **Promotes primary action** - The action users should take most
- **High visibility** - Floats above content with elevation

**When to use:**
- ✅ Create/Add actions (compose email, add photo, new item)
- ✅ Primary action that's used frequently
- ✅ Action promotes core app functionality
- ✅ Action available from multiple places in flow

**When NOT to use:**
- ❌ Destructive actions (delete, remove)
- ❌ Minor actions (edit, settings)
- ❌ Navigation actions (back, close)
- ❌ Multiple equally important actions
- ❌ Actions specific to list items

---

## 🎨 FAB Variants

### 1. **FAB (Standard Size)**

**Visual Characteristics:**
- Container: 56×56px (circular)
- Icon: 24×24px (centered)
- Background: Primary color container
- Icon color: On-primary-container
- Elevation: Level 3 (default)
- Elevation: Level 4 (hover)

**Use Cases:**
- Default FAB for most scenarios
- Primary action on screen
- Standard emphasis
- Most common size

**Token Mapping:**
```css
width: 56px;
height: 56px;
background: var(--md-sys-color-primary-container);
color: var(--md-sys-color-on-primary-container);
box-shadow: var(--md-sys-elevation-3);
border-radius: 16px; /* Not fully rounded! */
```

---

### 2. **Small FAB**

**Visual Characteristics:**
- Container: 40×40px (circular)
- Icon: 24×24px (centered)
- Same colors as standard
- Elevation: Level 3 (default)
- Elevation: Level 4 (hover)

**Use Cases:**
- When standard FAB is too large
- Secondary screens
- Mobile views where space limited
- Less prominent primary action

**Token Mapping:**
```css
width: 40px;
height: 40px;
background: var(--md-sys-color-primary-container);
color: var(--md-sys-color-on-primary-container);
box-shadow: var(--md-sys-elevation-3);
border-radius: 12px; /* Smaller corner radius */
```

---

### 3. **Large FAB**

**Visual Characteristics:**
- Container: 96×96px (circular)
- Icon: 36×36px (centered)
- Same colors as standard
- Elevation: Level 3 (default)
- Elevation: Level 4 (hover)

**Use Cases:**
- When action needs maximum emphasis
- Landing screens
- Hero areas
- When screen real estate permits

**Token Mapping:**
```css
width: 96px;
height: 96px;
background: var(--md-sys-color-primary-container);
color: var(--md-sys-color-on-primary-container);
box-shadow: var(--md-sys-elevation-3);
border-radius: 28px; /* Larger corner radius */
```

---

### 4. **Extended FAB**

**Visual Characteristics:**
- Container: Variable width × 56px height
- Icon: 24×24px (leading)
- Text label (required)
- Same colors as standard
- Elevation: Level 3 (default)
- Minimum width: Icon + text + padding

**Use Cases:**
- When action needs text clarification
- First time users encounter action
- Complex or ambiguous actions
- When screen width allows
- Prominent call-to-action

**Token Mapping:**
```css
height: 56px;
min-width: 80px; /* Expands with text */
padding: 0 20px 0 16px; /* Asymmetric for icon */
background: var(--md-sys-color-primary-container);
color: var(--md-sys-color-on-primary-container);
box-shadow: var(--md-sys-elevation-3);
border-radius: 16px;
```

**Layout:**
```
┌──────────────────────┐
│ [Icon] Label Text    │
│  16px   8px gap      │
└──────────────────────┘
```

---

## 🎨 Color Variants

### **Primary Container (Default)**

```css
background: var(--md-sys-color-primary-container);
color: var(--md-sys-color-on-primary-container);
```

**Use:**
- Default color scheme
- Primary branded action
- Most common choice

---

### **Secondary Container**

```css
background: var(--md-sys-color-secondary-container);
color: var(--md-sys-color-on-secondary-container);
```

**Use:**
- Alternative to primary
- Less prominent but still important
- Different functional areas

---

### **Tertiary Container**

```css
background: var(--md-sys-color-tertiary-container);
color: var(--md-sys-color-on-tertiary-container);
```

**Use:**
- Third-level actions
- Alternative emphasis
- Supporting actions

---

### **Surface**

```css
background: var(--md-sys-color-surface);
color: var(--md-sys-color-primary);
box-shadow: var(--md-sys-elevation-3);
```

**Use:**
- Lower emphasis
- When primary color is too strong
- Light-colored FAB on dark background

---

## 📏 Dimensions & Specifications

### **Size Comparison**

| Size | Container | Icon | Corner Radius | Touch Target |
|------|-----------|------|---------------|--------------|
| **Small** | 40×40px | 24px | 12px | 48×48px |
| **Standard** | 56×56px | 24px | 16px | 56×56px |
| **Large** | 96×96px | 36px | 28px | 96×96px |
| **Extended** | auto×56px | 24px | 16px | min 56×56px |

---

### **Corner Radius (Important!)**

**FABs are NOT fully rounded:**

```css
/* NOT 9999px like buttons! */
small: 12px;
standard: 16px;
large: 28px;
extended: 16px;

/* Uses shape tokens */
small: var(--md-sys-shape-corner-large);
standard: var(--md-sys-shape-corner-extra-large);
large: 28px; /* Custom value */
```

**Why not fully rounded?**
- MD3 design language evolution
- Distinctive from buttons and icon buttons
- Better balance with content
- Still feels rounded but more modern

---

### **Extended FAB Dimensions**

**Width:**
```
Minimum: 80px (very short text)
Maximum: No limit (but keep reasonable)
Typical: 120-180px
```

**Padding:**
```
Leading (with icon): 16px
Between icon and text: 8px
Trailing: 20px

Total: [16px][Icon 24px][8px][Text][20px]
```

**Typography:**
```
Font: var(--md-sys-typescale-label-large)
Size: 14px
Weight: 500
Letter-spacing: 0.1px
```

---

## 🎭 States & Interactions

### **Elevation Levels**

FABs use elevation prominently:

```css
/* Default (Resting) */
box-shadow: var(--md-sys-elevation-3);

/* Hover */
box-shadow: var(--md-sys-elevation-4);

/* Pressed */
box-shadow: var(--md-sys-elevation-3);
/* Plus state layer */

/* Dragged (rare) */
box-shadow: var(--md-sys-elevation-4);
```

**Why elevation matters:**
- Creates "floating" appearance
- Separates from content
- Draws attention
- Indicates interactivity

---

### **State Layers**

Same as buttons and icon buttons:

```css
/* Hover */
opacity: 0.08; /* 8% overlay of on-container color */

/* Focus */
opacity: 0.12; /* 12% overlay */

/* Pressed */
opacity: 0.12; /* 12% overlay */
```

---

### **Disabled State**

FABs are rarely disabled (usually hidden instead):

```css
/* If disabled */
opacity: 0.38; /* Icon and text */
background: rgba(on-surface, 0.12); /* Container */
box-shadow: none; /* No elevation */
pointer-events: none;
```

**Best Practice:**
- Hide FAB instead of disabling it
- If action unavailable, don't show FAB
- Disabled FAB is confusing for users

---

### **Loading State**

```tsx
<FAB loading>
  <Spinner /> {/* Replaces icon */}
</FAB>
```

**Characteristics:**
- Show spinner instead of icon
- Keep same size and position
- Disable interaction
- Optional text: "Creating..."

---

## 🎯 Positioning & Placement

### **Screen Position**

**Desktop/Tablet:**
```
Bottom-right: Most common (default)
Bottom-left: Navigation drawer apps
Bottom-center: Special cases (rare)
```

**Mobile:**
```
Bottom-right: Standard
Bottom-center: Alternative
Floating over content: Yes
```

**Spacing from edges:**
```
Right: 16px
Bottom: 16px (or above navigation bar)
```

---

### **Z-Index & Layering**

**Layer hierarchy:**
```
1. Background content
2. App bar
3. Bottom navigation (if present)
4. FAB ← Floats above all
5. Dialogs/modals
```

**Z-index:**
```css
z-index: 1000; /* Above content */
/* But below dialogs/modals (1300+) */
```

---

### **Scroll Behavior**

**Options:**

**1. Fixed Position (Recommended)**
```css
position: fixed;
bottom: 16px;
right: 16px;
```
- Stays visible while scrolling
- Always accessible
- Most common pattern

**2. Show/Hide on Scroll**
```tsx
// Hide on scroll down, show on scroll up
{scrollDirection === 'up' && <FAB />}
```
- Saves space
- Less intrusive
- Modern pattern

**3. Transform on Scroll**
```tsx
// Extended → Standard on scroll down
{scrolled ? <FAB /> : <ExtendedFAB />}
```
- Saves space
- Maintains visibility
- Good compromise

---

## ♿ Accessibility Requirements

### **1. Always Require aria-label**

Even extended FABs with text need aria-label:

```tsx
// Icon-only FABs (standard, small, large)
<FAB aria-label="Create new item">
  <IconAdd />
</FAB>

// Extended FABs with text
<FAB aria-label="Create new item">
  <IconAdd />
  Create
</FAB>
```

**Why for extended FABs?**
- Text might be truncated on small screens
- Screen readers benefit from explicit label
- Consistency across FAB variants

---

### **2. Touch Targets**

**Minimum sizes:**
- Small FAB: 48×48px minimum (40×40px + margin)
- Standard FAB: 56×56px (already compliant)
- Large FAB: 96×96px (already compliant)
- Extended FAB: 56px height minimum

**Small FAB implementation:**
```css
.fab-small {
  width: 40px;
  height: 40px;
  margin: 4px; /* Creates 48×48px touch area */
}
```

---

### **3. Keyboard Navigation**

**Required keys:**
- `Enter`: Activate FAB
- `Space`: Activate FAB
- `Tab`: Move focus to/from FAB

**Focus indicator:**
```css
.fab:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}
```

---

### **4. Color Contrast**

**Requirements:**
- Icon vs container: 3:1 minimum (non-text)
- Text vs container: 4.5:1 minimum (extended FAB)
- Elevation shadow: Provides additional contrast

**MD3 tokens guarantee compliance:**
- All container/on-container pairs meet standards
- Elevation adds visual separation

---

### **5. Screen Reader Announcements**

```html
<!-- Screen reader will announce: -->
<!-- "Create new item, button" -->
<button aria-label="Create new item">
  <svg>...</svg>
</button>
```

**For extended FAB:**
```html
<!-- "Create new item, button" -->
<!-- Text is redundant with aria-label but okay -->
<button aria-label="Create new item">
  <svg>...</svg>
  <span>Create</span>
</button>
```

---

## 🎨 Animation & Motion

### **Entrance Animation**

FABs should animate in:

```css
@keyframes fab-enter {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fab {
  animation: fab-enter 200ms var(--md-sys-motion-easing-emphasized-decelerate);
}
```

**Duration:** 200ms  
**Easing:** emphasized-decelerate

---

### **Exit Animation**

```css
@keyframes fab-exit {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}
```

**Duration:** 150ms  
**Easing:** emphasized-accelerate

---

### **Extended ↔ Standard Transition**

```css
/* Extended → Standard */
.fab-extended {
  transition: width 300ms var(--md-sys-motion-easing-emphasized);
}

/* Animate width change smoothly */
/* Icon stays, text fades out */
```

---

### **Ripple Effect**

Same as buttons:

**Characteristics:**
- Emanates from touch point
- Bounded to container (including corners)
- Duration: 450ms
- Easing: emphasized-decelerate
- Opacity: 0.12 → 0

---

## 🎯 Use Cases & Patterns

### **1. Create/Add Actions**

**Most common use case:**

```tsx
// Email app
<FAB aria-label="Compose new email">
  <IconEdit />
</FAB>

// Photo gallery
<FAB aria-label="Add photo">
  <IconCamera />
</FAB>

// Notes app
<FAB aria-label="Create new note">
  <IconAdd />
</FAB>
```

---

### **2. Transform on Scroll**

```tsx
const [scrolled, setScrolled] = useState(false);

return scrolled ? (
  <FAB aria-label="Add item">
    <IconAdd />
  </FAB>
) : (
  <ExtendedFAB aria-label="Add new item">
    <IconAdd />
    Add Item
  </ExtendedFAB>
);
```

---

### **3. Multiple Related Actions (Speed Dial)**

Not part of FAB spec, but common pattern:

```
Main FAB expands to reveal:
  ↑ [Action 3]
  ↑ [Action 2]
  ↑ [Action 1]
[Main FAB] (rotating icon)
```

**Note:** This is a separate "Speed Dial" component, not basic FAB.

---

### **4. Context-Aware FAB**

FAB changes based on current screen/context:

```tsx
// Home screen
<FAB icon={<IconAdd />}>Create</FAB>

// Details screen
<FAB icon={<IconEdit />}>Edit</FAB>

// Different FAB for different contexts
```

---

## 🔄 FAB vs IconButton vs Button

| Feature | FAB | IconButton | Button |
|---------|-----|------------|--------|
| **Shape** | Large circle | Small circle | Pill |
| **Size** | 56×56px (std) | 40×40px | Variable |
| **Elevation** | Yes (3dp) | No | No |
| **Position** | Floating | Inline | Inline |
| **Use** | Primary action | Tool actions | All actions |
| **Per Screen** | 1 only | Multiple | Multiple |
| **Text** | Optional (extended) | No | Yes |
| **Emphasis** | Highest | Low-Medium | Varies |

---

## 📱 Responsive Behavior

### **Mobile**

**Standard approach:**
```
Standard FAB (56×56px)
Bottom-right: 16px margin
Above bottom nav if present
Fixed position while scrolling
```

**Space-saving approach:**
```
Transform: Extended → Standard on scroll
Or: Hide on scroll down, show on scroll up
Small FAB (40×40px) for very small screens
```

---

### **Tablet**

```
Standard or Large FAB
Bottom-right placement
Consider extended FAB (more space available)
```

---

### **Desktop**

```
Standard or Large FAB
Extended FAB recommended (clarity)
Bottom-right or bottom-center
May appear in specific containers
```

---

## ⚠️ Common Mistakes to Avoid

### **1. Multiple FABs**

```tsx
// ❌ WRONG - Only one FAB per screen!
<FAB aria-label="Add">...</FAB>
<FAB aria-label="Edit">...</FAB>
<FAB aria-label="Delete">...</FAB>

// ✅ CORRECT - One FAB for primary action
<FAB aria-label="Add new item">...</FAB>
// Other actions go in menu/toolbar
```

---

### **2. Using FAB for Navigation**

```tsx
// ❌ WRONG - Don't use for navigation
<FAB aria-label="Back" onClick={goBack}>
  <IconArrowBack />
</FAB>

// ✅ CORRECT - Use IconButton in app bar
<IconButton aria-label="Back" onClick={goBack}>
  <IconArrowBack />
</IconButton>
```

---

### **3. Destructive Actions**

```tsx
// ❌ WRONG - FAB shouldn't be destructive
<FAB aria-label="Delete all" color="error">
  <IconDelete />
</FAB>

// ✅ CORRECT - Constructive actions only
<FAB aria-label="Create new">
  <IconAdd />
</FAB>
```

---

### **4. Fully Rounded Corners**

```css
/* ❌ WRONG - FAB is not fully rounded */
.fab {
  border-radius: 9999px;
}

/* ✅ CORRECT - Use specific corner radius */
.fab {
  border-radius: 16px; /* Standard FAB */
}
```

---

### **5. Missing Elevation**

```css
/* ❌ WRONG - FAB needs elevation */
.fab {
  box-shadow: none;
}

/* ✅ CORRECT - Level 3 elevation */
.fab {
  box-shadow: var(--md-sys-elevation-3);
}
```

---

## 🎯 Implementation Checklist

### **Visual**
- [ ] 4 sizes (small, standard, large, extended)
- [ ] 4 color variants (primary, secondary, tertiary, surface)
- [ ] Proper corner radius (12/16/28px, NOT 9999px)
- [ ] Elevation level 3 (default) and 4 (hover)
- [ ] State layers for hover/focus/pressed
- [ ] Proper icon sizing (24px standard, 36px large)
- [ ] Extended FAB with text label
- [ ] Ripple effect on press

### **Functional**
- [ ] onClick handler works
- [ ] Keyboard navigation (Enter/Space)
- [ ] Fixed positioning option
- [ ] Loading state support
- [ ] Icon can be any React node
- [ ] Text support for extended variant
- [ ] Entrance/exit animations

### **Accessibility**
- [ ] aria-label REQUIRED for all variants
- [ ] Touch targets meet minimum (48×48px)
- [ ] Focus indicator visible
- [ ] Color contrast WCAG AA
- [ ] Keyboard accessible
- [ ] Screen reader announces correctly
- [ ] Elevation provides visual separation

### **Positioning**
- [ ] Fixed position support
- [ ] Configurable placement (bottom-right, bottom-left, etc.)
- [ ] Proper z-index (above content, below modals)
- [ ] Scroll behavior options (fixed, hide, transform)
- [ ] Spacing from screen edges (16px default)

---

## 🎓 Key Takeaways

1. **One per screen** - THE most important action only
2. **Not fully rounded** - 16px corner radius (standard), not 9999px
3. **Elevation required** - Level 3 default, creates floating effect
4. **aria-label required** - Even for extended FABs with text
5. **Fixed positioning** - Floats above content, stays visible
6. **56×56px standard** - With small (40px) and large (96px) variants
7. **Extended variant** - Adds text label, variable width
8. **Constructive actions** - Create/add, never delete/remove
9. **Primary container** - Default color scheme
10. **Animate in/out** - 200ms entrance, 150ms exit

---

## 📚 References

- **MD3 FAB Overview**: https://m3.material.io/components/floating-action-button/overview
- **MD3 FAB Guidelines**: https://m3.material.io/components/floating-action-button/guidelines
- **Material Symbols**: https://fonts.google.com/icons
- **ARIA Button Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- **MD3 Elevation**: https://m3.material.io/styles/elevation/overview

---

## 🔄 When to Use What

**Use FAB when:**
- ✅ Primary action on screen
- ✅ Create/add action
- ✅ Needs highest emphasis
- ✅ Action available throughout flow

**Use IconButton when:**
- ✅ Tool or utility action
- ✅ Multiple actions needed
- ✅ Action in toolbar/app bar
- ✅ Icon is universally understood

**Use Button when:**
- ✅ Action needs text label
- ✅ Multiple similar actions
- ✅ Action in forms/dialogs
- ✅ Variable importance levels

---

## 💡 Design Recommendations

### **Icon Selection**

**Good icons for FAB:**
- ✅ Add (+)
- ✅ Edit (pencil)
- ✅ Create (compose)
- ✅ Camera
- ✅ Mic (recording)

**Avoid:**
- ❌ Delete (trash) - destructive
- ❌ Back (arrow) - navigation
- ❌ Close (×) - navigation
- ❌ Settings (gear) - not primary
- ❌ Share - usually secondary

---

### **Extended FAB Text**

**Keep it short:**
- ✅ "Create" (best)
- ✅ "New Item" (good)
- ✅ "Add Photo" (okay)
- ❌ "Create New Document Here" (too long!)

**Use verbs:**
- ✅ "Compose", "Create", "Add"
- ❌ "New", "Item", "Thing"

---

**Research Status**: ✅ Complete  
**Next Step**: Task 0.4 (Define component API contracts)

