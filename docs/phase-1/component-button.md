# Button Component

**Status**: ✅ Complete  
**Version**: 1.0.0  
**Last Updated**: 2025-12-31

---

## 📋 Overview

The Material Design 3 Button component provides a flexible, accessible button with 5 visual variants, 4 color schemes, 3 sizes, icon support, loading states, and full keyboard accessibility.

**Key Features:**
- ✅ 5 variants (filled, outlined, tonal, elevated, text)
- ✅ 4 color schemes (primary, secondary, tertiary, error)
- ✅ 3 sizes (small, medium, large)
- ✅ Leading and trailing icon support
- ✅ Loading state with spinner
- ✅ Ripple effect (MD3 motion)
- ✅ State layers (hover, focus, active)
- ✅ Full keyboard accessibility
- ✅ WCAG AA compliant
- ✅ TypeScript support

---

## 📦 Installation

```bash
npm install @tinybigui/react
# or
pnpm add @tinybigui/react
# or
yarn add @tinybigui/react
```

---

## 🚀 Basic Usage

```tsx
import { Button } from '@tinybigui/react';

function App() {
  return (
    <Button onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
```

---

## 🎨 Variants

### **Filled (Default)**

High emphasis button for primary actions.

```tsx
<Button variant="filled">
  Filled Button
</Button>
```

**Use when:**
- Primary action on screen
- Final action in flow (e.g., "Submit", "Confirm")
- Needs highest visual emphasis

---

### **Outlined**

Medium emphasis button with border.

```tsx
<Button variant="outlined">
  Outlined Button
</Button>
```

**Use when:**
- Secondary action
- Needs clear boundaries
- Alternative to primary action

---

### **Tonal**

Medium emphasis button with tinted background.

```tsx
<Button variant="tonal">
  Tonal Button
</Button>
```

**Use when:**
- Alternative to filled
- Softer emphasis needed
- Multiple actions of similar importance

---

### **Elevated**

Medium emphasis button with elevation shadow.

```tsx
<Button variant="elevated">
  Elevated Button
</Button>
```

**Use when:**
- Need separation from patterned background
- Action needs to "lift" from surface
- Alternative to filled with more depth

---

### **Text**

Low emphasis button with no background.

```tsx
<Button variant="text">
  Text Button
</Button>
```

**Use when:**
- Least important action
- Inline with content
- Dense UI (cards, dialogs)

---

## 🎨 Colors

### **Primary (Default)**

```tsx
<Button color="primary">Primary</Button>
```

Main brand color, most common choice.

---

### **Secondary**

```tsx
<Button color="secondary">Secondary</Button>
```

Alternative actions or different functional areas.

---

### **Tertiary**

```tsx
<Button color="tertiary">Tertiary</Button>
```

Third-level actions or contrasting accent.

---

### **Error**

```tsx
<Button color="error">Delete</Button>
```

Destructive or error-related actions.

---

## 📏 Sizes

### **Small**

```tsx
<Button size="small">Small</Button>
```

- Height: 32px (8 Tailwind units)
- Padding: 16px horizontal
- Use in dense UIs, toolbars

---

### **Medium (Default)**

```tsx
<Button size="medium">Medium</Button>
```

- Height: 40px (10 Tailwind units)
- Padding: 24px horizontal
- Standard size for most uses

---

### **Large**

```tsx
<Button size="large">Large</Button>
```

- Height: 48px (12 Tailwind units)
- Padding: 32px horizontal
- Use for prominent CTAs, touch interfaces

---

## 🎯 Icons

### **Leading Icon**

```tsx
import { IconAdd } from './icons';

<Button icon={<IconAdd />}>
  Add Item
</Button>
```

Icon appears before text.

---

### **Trailing Icon**

```tsx
import { IconArrowForward } from './icons';

<Button trailingIcon={<IconArrowForward />}>
  Continue
</Button>
```

Icon appears after text.

---

### **Icon Guidelines**

- ✅ Use 18×18px or 24×24px icons
- ✅ Icons should be simple and recognizable
- ✅ Only use one icon per button
- ❌ Don't use both leading and trailing icons
- ❌ Icon-only buttons should use `IconButton` component instead

---

## 🔄 States

### **Loading**

```tsx
<Button loading>
  Saving...
</Button>
```

Shows spinner, disables interaction, hides icon.

**When to use:**
- Async operations (save, submit, fetch)
- Processing state
- Waiting for API response

---

### **Disabled**

```tsx
<Button disabled>
  Disabled
</Button>
```

Visually muted, prevents interaction.

**When to use:**
- Action not available
- Form validation failed
- Prerequisites not met

---

### **Full Width**

```tsx
<Button fullWidth>
  Full Width Button
</Button>
```

Spans entire container width.

**When to use:**
- Mobile layouts
- Forms
- Single prominent action

---

## ♿ Accessibility

### **ARIA Attributes**

```tsx
// Custom label
<Button aria-label="Add new item">
  Add
</Button>

// Toggle button
<Button aria-pressed={liked}>
  Like
</Button>

// Menu button
<Button aria-haspopup="menu" aria-expanded={open}>
  Menu
</Button>

// Controls
<Button aria-controls="panel-id">
  Open Panel
</Button>
```

---

### **Keyboard Navigation**

- `Tab`: Move focus to/from button
- `Enter`: Activate button
- `Space`: Activate button

---

### **Focus Indicator**

Focus ring automatically appears on keyboard navigation:

```tsx
<Button>
  Keyboard Accessible
</Button>
```

Meets WCAG 2.1 AA standards (2px outline, sufficient contrast).

---

## 🎨 Customization

### **Custom Classes**

```tsx
<Button className="shadow-lg hover:shadow-xl">
  Custom Styles
</Button>
```

Add Tailwind classes or custom CSS.

---

### **Disable Ripple**

```tsx
<Button disableRipple>
  No Ripple
</Button>
```

Disables ripple animation (not recommended, reduces motion feedback).

---

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'tonal' \| 'elevated' \| 'text'` | `'filled'` | Button visual style |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'error'` | `'primary'` | Color scheme |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `icon` | `React.ReactNode` | - | Leading icon |
| `trailingIcon` | `React.ReactNode` | - | Trailing icon |
| `children` | `React.ReactNode` | - | Button text (required) |
| `fullWidth` | `boolean` | `false` | Span full container width |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `disableRipple` | `boolean` | `false` | Disable ripple effect |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |
| `className` | `string` | - | Custom CSS classes |
| `ref` | `React.Ref<HTMLButtonElement>` | - | Ref forwarding |
| `aria-label` | `string` | - | Accessible label |
| `aria-pressed` | `boolean \| 'true' \| 'false' \| 'mixed'` | - | Toggle state |
| `aria-expanded` | `boolean \| 'true' \| 'false'` | - | Expansion state |
| `aria-controls` | `string` | - | Controlled element ID |
| `aria-haspopup` | `boolean \| 'menu' \| 'dialog' \| ...` | - | Popup type |
| `tabIndex` | `number` | `0` | Tab index |
| `data-testid` | `string` | - | Test identifier |

---

## 🎯 Use Cases

### **Form Submission**

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" loading={isSubmitting}>
    Submit
  </Button>
</form>
```

---

### **Confirmation Dialog**

```tsx
<div className="dialog">
  <h2>Delete File?</h2>
  <p>This action cannot be undone.</p>
  <div className="actions">
    <Button variant="text" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="tonal" color="error" onClick={onConfirm}>
      Delete
    </Button>
  </div>
</div>
```

---

### **Call to Action**

```tsx
<div className="hero">
  <h1>Welcome to Our App</h1>
  <Button size="large" icon={<IconArrowForward />}>
    Get Started
  </Button>
</div>
```

---

### **Multiple Actions**

```tsx
<div className="card-actions">
  <Button variant="text">Learn More</Button>
  <Button variant="tonal">Try Now</Button>
  <Button variant="filled">Buy Now</Button>
</div>
```

---

## 🎨 Design Tokens

Button uses these MD3 design tokens (automatically mapped via Tailwind):

### **Filled Variant**

```css
background: var(--md-sys-color-primary);
color: var(--md-sys-color-on-primary);
```

### **Outlined Variant**

```css
border: 1px solid var(--md-sys-color-outline);
color: var(--md-sys-color-primary);
```

### **Tonal Variant**

```css
background: var(--md-sys-color-secondary-container);
color: var(--md-sys-color-on-secondary-container);
```

### **Elevated Variant**

```css
background: var(--md-sys-color-surface-container-low);
box-shadow: var(--md-sys-elevation-1);
color: var(--md-sys-color-primary);
```

### **Text Variant**

```css
background: transparent;
color: var(--md-sys-color-primary);
```

### **State Layers**

```css
/* Hover */
opacity: 0.08;

/* Focus */
opacity: 0.12;

/* Pressed */
opacity: 0.12;
```

---

## 🎬 Motion

### **Ripple Effect**

- **Duration**: 450ms
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (emphasized-decelerate)
- **Origin**: Touch/click point
- **Bounded**: Yes (clipped to button bounds)
- **Opacity**: 0.12 → 0

### **State Layer Transition**

- **Duration**: 200ms
- **Easing**: `ease-in-out`
- **Property**: `opacity`

---

## 🧪 Testing

### **Unit Tests**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@tinybigui/react';

test('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('is disabled when loading', () => {
  render(<Button loading>Loading</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

---

## 📚 Related Components

- **IconButton**: For icon-only buttons (circular, no text)
- **FAB**: For floating action buttons (primary screen action)
- **SegmentedButton**: For mutually exclusive selections

---

## 🎓 Best Practices

### **Do's**

- ✅ Use filled variant for primary actions
- ✅ Provide meaningful text labels
- ✅ Use loading state for async operations
- ✅ Add icons to enhance clarity
- ✅ Use appropriate color for action type
- ✅ Ensure sufficient spacing between buttons

### **Don'ts**

- ❌ Don't use multiple filled buttons in same context
- ❌ Don't use button for navigation (use link instead)
- ❌ Don't use both leading and trailing icons
- ❌ Don't make buttons too small (min 40px height)
- ❌ Don't use unclear or generic labels ("Click here", "Button")
- ❌ Don't disable ripple effect without good reason

---

## 📖 Examples

### **Login Form**

```tsx
function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button type="submit" fullWidth loading={loading}>
        Sign In
      </Button>
      <Button variant="text" fullWidth>
        Forgot Password?
      </Button>
    </form>
  );
}
```

---

### **Product Card**

```tsx
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <div className="actions">
        <Button
          variant="text"
          aria-pressed={liked}
          onClick={() => setLiked(!liked)}
        >
          {liked ? 'Liked' : 'Like'}
        </Button>
        <Button icon={<IconAdd />}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### **Ripple not working**

- Ensure you haven't set `disableRipple={true}`
- Check that button is not disabled
- Verify Tailwind CSS is properly configured

### **Button not clickable**

- Check if `disabled` or `loading` props are set
- Verify no overlapping elements
- Ensure button has pointer-events enabled

### **Styles not applying**

- Ensure `@tinybigui/tokens` CSS is imported
- Check Tailwind configuration
- Verify no CSS conflicts

---

## 📝 Changelog

### **v1.0.0** (2025-12-31)

- ✅ Initial release
- ✅ 5 variants (filled, outlined, tonal, elevated, text)
- ✅ 4 colors (primary, secondary, tertiary, error)
- ✅ 3 sizes (small, medium, large)
- ✅ Icon support (leading, trailing)
- ✅ Loading state with spinner
- ✅ Ripple effect (MD3 motion)
- ✅ State layers (hover, focus, active)
- ✅ Full accessibility (WCAG AA)
- ✅ TypeScript support
- ✅ 53 unit tests (100% passing)
- ✅ Comprehensive Storybook stories

---

## 🔗 Resources

- **Storybook**: View all variants and examples
- **GitHub**: Source code and issues
- **MD3 Spec**: https://m3.material.io/components/buttons/overview
- **API Docs**: Auto-generated from TypeScript types

---

**Component Status**: ✅ Production Ready  
**Test Coverage**: 100%  
**Accessibility**: WCAG 2.1 AA Compliant

