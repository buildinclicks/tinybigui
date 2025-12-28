# Cursor AI Rules for TinyBigUI

> **Status**: ✅ Active  
> **Last Updated**: December 24, 2025

## 🎯 Purpose

This document defines rules and guidelines for Cursor AI when assisting with TinyBigUI development. These rules ensure consistency with our established strategy and best practices.

---

## 📚 Strategy Awareness

### Core Strategy Documents

Before making any suggestions or changes, Cursor AI must be aware of:

1. **[00-overview.md](./00-overview.md)** - Project vision and principles
2. **[01-tech-stack.md](./01-tech-stack.md)** - Technology decisions
3. **[02-architecture.md](./02-architecture.md)** - Code organization
4. **[03-design-system.md](./03-design-system.md)** - MD3 implementation
5. **[04-accessibility.md](./04-accessibility.md)** - A11y requirements
6. **[09-quick-reference.md](./09-quick-reference.md)** - Quick lookup

### Key Principles

Always adhere to:
- ✅ Quality over speed
- ✅ Accessibility first (WCAG 2.1 AA minimum)
- ✅ Material Design 3 strict adherence
- ✅ TypeScript strict mode
- ✅ Explicit 'use client' for client components

---

## 🏗️ Project Structure Rules

### Monorepo Organization

```
tinybigui/
├── packages/
│   ├── react/          # @tinybigui/react
│   └── tokens/         # @tinybigui/tokens
```

**Rules**:
- ✅ Always place React components in `packages/react/`
- ✅ Design tokens go in `packages/tokens/`
- ❌ Never create files outside of packages
- ❌ Never flatten the monorepo structure

### Component File Structure

Every component MUST follow this structure:

```
component-name/
├── component-name.tsx              # Main styled component
├── component-name-headless.tsx     # Headless primitive
├── component-name.variants.ts      # CVA variants
├── component-name.types.ts         # TypeScript types
├── component-name.test.tsx         # Tests
├── component-name.stories.tsx      # Storybook
└── index.ts                        # Public exports
```

**Rules**:
- ✅ MUST create all files for each component
- ✅ MUST follow kebab-case for file names
- ❌ NEVER skip any required files
- ❌ NEVER use different naming patterns

---

## 💻 Code Style Rules

### TypeScript

```typescript
// ✅ DO: Explicit types
interface ButtonProps extends AriaButtonProps {
  variant?: 'filled' | 'outlined'
}

// ❌ DON'T: Use any
interface ButtonProps {
  props: any
}

// ✅ DO: const assertions
const variants = ['filled', 'outlined'] as const

// ✅ DO: JSDoc documentation
/**
 * A button component following Material Design 3
 * @example
 * <Button variant="filled">Click me</Button>
 */

// ✅ DO: forwardRef for refs
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => { }
)
```

**Rules**:
- ✅ MUST use TypeScript strict mode
- ✅ MUST provide JSDoc for all public APIs
- ✅ MUST use `forwardRef` for components accepting refs
- ❌ NEVER use `any` type
- ❌ NEVER use default exports

### React Patterns

```typescript
// ✅ DO: Explicit 'use client' for interactive components
'use client'

export function Button() { }

// ✅ DO: Destructure props
function Button({ variant, size, children, ...rest }) { }

// ❌ DON'T: Inline styles
<button style={{ color: 'red' }} />

// ✅ DO: Tailwind classes
<button className="text-red-500" />

// ✅ DO: Use cn() utility for className merging
<button className={cn('base-class', variant === 'filled' && 'filled-class')} />
```

**Rules**:
- ✅ MUST add `'use client'` to all interactive components
- ✅ MUST use Tailwind CSS (never inline styles)
- ✅ MUST use `cn()` utility for className merging
- ❌ NEVER use default exports
- ❌ NEVER use CSS-in-JS

### React Aria Integration

```typescript
// ✅ DO: Use React Aria hooks
import { useButton } from 'react-aria'

function ButtonHeadless(props) {
  const ref = useRef(null)
  const { buttonProps } = useButton(props, ref)
  return <button {...buttonProps} ref={ref} />
}

// ❌ DON'T: Implement accessibility manually
function ButtonHeadless(props) {
  return (
    <button
      onClick={props.onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { /* ... */ }
      }}
    />
  )
}
```

**Rules**:
- ✅ MUST use React Aria hooks for all interactive components
- ✅ MUST let React Aria handle accessibility
- ❌ NEVER implement keyboard/ARIA logic manually
- ❌ NEVER skip React Aria hooks

### CVA (Class Variance Authority)

```typescript
// ✅ DO: Use CVA for variants
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary',
        outlined: 'border-2 border-outline',
      },
      size: {
        small: 'h-10 px-4',
        medium: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
    },
  }
)

// ✅ DO: Export VariantProps type
export type ButtonVariants = VariantProps<typeof buttonVariants>
```

**Rules**:
- ✅ MUST use CVA for component variants
- ✅ MUST define variants in separate `.variants.ts` file
- ✅ MUST export VariantProps type
- ✅ MUST provide defaultVariants
- ❌ NEVER handle variants with conditional className logic

---

## 🎨 Material Design 3 Rules

### Design Tokens

```typescript
// ✅ DO: Use CSS variables for MD3 tokens
<button className="bg-primary text-on-primary" />

// ❌ DON'T: Use arbitrary values
<button className="bg-[#6750a4] text-white" />

// ✅ DO: Use MD3 elevation classes
<div className="shadow-elevation-1" />

// ✅ DO: Use MD3 typography classes
<h1 className="text-headline-large" />
```

**Rules**:
- ✅ MUST use MD3 design tokens (via CSS variables)
- ✅ MUST follow MD3 specifications exactly
- ❌ NEVER use arbitrary color values
- ❌ NEVER deviate from MD3 specs

### Component Variants

**Rules**:
- ✅ MUST implement ALL MD3 variants for each component
- ✅ MUST follow MD3 naming (e.g., 'filled', 'outlined', not 'solid', 'bordered')
- ❌ NEVER create custom variants not in MD3 spec
- ❌ NEVER skip MD3 variants

### Interactions

```typescript
// ✅ DO: Implement state layers
<button className="relative overflow-hidden">
  <span className="state-layer" />
  {children}
</button>

// ✅ DO: Use MD3 motion tokens
<button className="transition-all duration-short2 ease-standard" />
```

**Rules**:
- ✅ MUST implement MD3 state layers
- ✅ MUST use MD3 motion tokens
- ✅ MUST implement ripple effect (where specified)
- ❌ NEVER use custom animations not in MD3

---

## ♿ Accessibility Rules

### WCAG Compliance

**Rules**:
- ✅ MUST meet WCAG 2.1 AA minimum
- ✅ MUST ensure 4.5:1 contrast for text
- ✅ MUST ensure 3:1 contrast for UI components
- ✅ MUST provide accessible labels for all interactive elements
- ❌ NEVER skip accessibility attributes
- ❌ NEVER rely on color alone for information

### Keyboard Navigation

**Rules**:
- ✅ MUST support Tab/Shift+Tab navigation
- ✅ MUST support Enter/Space for activation
- ✅ MUST show visible focus indicators
- ✅ MUST implement component-specific keyboard shortcuts
- ❌ NEVER create keyboard traps
- ❌ NEVER remove focus indicators

### ARIA

```typescript
// ✅ DO: Use React Aria (provides ARIA automatically)
const { buttonProps } = useButton(props, ref)

// ✅ DO: Add aria-label for icon-only components
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>

// ❌ DON'T: Manually add ARIA when React Aria provides it
<button role="button" aria-pressed={pressed}>
  // React Aria already handles this
</button>
```

**Rules**:
- ✅ MUST let React Aria handle ARIA attributes
- ✅ MUST provide `aria-label` for icon-only components
- ✅ MUST use semantic HTML when possible
- ❌ NEVER add redundant ARIA attributes
- ❌ NEVER skip ARIA for custom interactions

---

## 🧪 Testing Rules

### Test Structure

```typescript
// ✅ DO: Follow this structure
describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => { })
    it('renders all variants', () => { })
  })
  
  describe('Interactions', () => {
    it('handles click events', async () => { })
    it('handles keyboard navigation', async () => { })
  })
  
  describe('Accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(<Button>Click</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  
  describe('Customization', () => {
    it('merges custom className', () => { })
  })
})
```

**Rules**:
- ✅ MUST write tests for every component
- ✅ MUST include accessibility tests (axe)
- ✅ MUST test all variants and states
- ✅ MUST test keyboard interactions
- ❌ NEVER skip accessibility tests
- ❌ NEVER skip interaction tests

### Test Coverage

**Rules**:
- ✅ MUST achieve >90% code coverage
- ✅ MUST test edge cases
- ✅ MUST test error states
- ❌ NEVER skip tests for "simple" components

---

## 📖 Documentation Rules

### Storybook Stories

```typescript
// ✅ DO: Include all standard stories
export const Default: Story = { }
export const Variants: Story = { }
export const Sizes: Story = { }
export const States: Story = { }
export const WithIcons: Story = { }
export const Accessibility: Story = { }
export const Interactive: Story = { } // with play function
```

**Rules**:
- ✅ MUST create Storybook stories for every component
- ✅ MUST include all variants in stories
- ✅ MUST include accessibility story
- ✅ MUST include interactive tests (play function)
- ❌ NEVER skip Storybook documentation

### JSDoc

```typescript
// ✅ DO: Document all props
interface ButtonProps {
  /**
   * The visual style of the button
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined'
  
  /**
   * Handler called when button is pressed
   */
  onPress?: () => void
}
```

**Rules**:
- ✅ MUST add JSDoc to all public APIs
- ✅ MUST document @default values
- ✅ MUST include @example where helpful
- ❌ NEVER skip JSDoc for public APIs

---

## 🔧 Import/Export Rules

### Import Order

```typescript
// 1. React imports
import { forwardRef } from 'react'

// 2. External libraries
import { useButton } from 'react-aria'
import { cva } from 'class-variance-authority'

// 3. Internal components
import { Icon } from '../icon'

// 4. Internal utilities
import { cn } from '../../utils/cn'

// 5. Types
import type { ButtonProps } from './button.types'
```

**Rules**:
- ✅ MUST follow this import order
- ✅ MUST use type imports for types (`import type`)
- ✅ MUST use relative imports within packages
- ❌ NEVER use default imports
- ❌ NEVER mix import styles

### Exports

```typescript
// ✅ DO: Named exports only
export { Button } from './button'
export { ButtonHeadless } from './button-headless'
export { buttonVariants } from './button.variants'
export type { ButtonProps } from './button.types'

// ❌ DON'T: Default exports
export default Button
```

**Rules**:
- ✅ MUST use named exports only
- ✅ MUST export types separately (`export type`)
- ✅ MUST re-export from index.ts
- ❌ NEVER use default exports
- ❌ NEVER export implementation details

---

## 📝 Commit Rules

### Conventional Commits

```bash
# ✅ DO: Follow conventional commit format
feat(button): add loading state
fix(textfield): resolve focus ring color
docs(readme): update installation steps
test(checkbox): add keyboard navigation tests
chore(deps): update react-aria to v3.30.0
refactor(button): simplify variant logic

# ❌ DON'T: Vague commits
git commit -m "fixes"
git commit -m "update stuff"
git commit -m "wip"
```

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring (no feature/fix)
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance (deps, config, etc.)

**Rules**:
- ✅ MUST use conventional commit format
- ✅ MUST include component scope (e.g., `feat(button)`)
- ✅ MUST write descriptive commit messages
- ❌ NEVER commit without proper format
- ❌ NEVER use generic messages

---

## 🚫 Never Do This

### Forbidden Patterns

```typescript
// ❌ NEVER: Default exports
export default Button

// ❌ NEVER: any type
function Button(props: any) { }

// ❌ NEVER: Inline styles
<button style={{ color: 'red' }} />

// ❌ NEVER: Manual accessibility
<button onClick={() => {}} onKeyDown={(e) => { /* keyboard handling */ }} />

// ❌ NEVER: Arbitrary values for MD3 tokens
<button className="bg-[#6750a4]" />

// ❌ NEVER: Skip 'use client' for interactive components
export function Button() { } // Missing 'use client'

// ❌ NEVER: Non-MD3 variants
<Button variant="fancy" /> // Not in MD3 spec

// ❌ NEVER: Skip tests
// "This component is too simple to test"

// ❌ NEVER: Skip accessibility
// "We'll add a11y later"
```

---

## ✅ Always Do This

### Required Patterns

```typescript
// ✅ ALWAYS: Named exports
export { Button } from './button'

// ✅ ALWAYS: Explicit types
interface ButtonProps extends AriaButtonProps { }

// ✅ ALWAYS: Use 'use client' for interactive components
'use client'
export function Button() { }

// ✅ ALWAYS: Use React Aria
const { buttonProps } = useButton(props, ref)

// ✅ ALWAYS: Use CVA for variants
const buttonVariants = cva(...)

// ✅ ALWAYS: MD3 design tokens
<button className="bg-primary text-on-primary" />

// ✅ ALWAYS: Write tests
describe('Button', () => { })

// ✅ ALWAYS: Write Storybook stories
export const Default: Story = { }

// ✅ ALWAYS: JSDoc documentation
/** Button component following MD3 */

// ✅ ALWAYS: Accessibility first
it('has no a11y violations', async () => { })
```

---

## 🎯 When Suggesting Changes

### Checklist for Cursor AI

Before suggesting any code change, verify:

1. ✅ Does it follow the monorepo structure?
2. ✅ Does it use TypeScript strict mode?
3. ✅ Does it follow naming conventions?
4. ✅ Does it use React Aria for accessibility?
5. ✅ Does it use CVA for variants?
6. ✅ Does it follow MD3 specifications?
7. ✅ Does it include 'use client' if needed?
8. ✅ Does it include tests?
9. ✅ Does it include Storybook stories?
10. ✅ Does it include JSDoc?
11. ✅ Does it follow import/export rules?
12. ✅ Is it accessible (WCAG 2.1 AA)?

If answer is "No" to any → Don't suggest it!

---

## 📚 Reference Priority

When answering questions, consult in this order:

1. **Strategy docs** (this folder)
2. **Material Design 3 specs** (m3.material.io)
3. **React Aria docs** (react-spectrum.adobe.com/react-aria)
4. **WCAG guidelines** (w3.org/WAI/WCAG21)
5. **General best practices**

---

## 🔄 Updates

This document will evolve as:
- New patterns emerge
- Strategy changes
- Best practices improve

Always check the "Last Updated" date at the top.

---

## 🎉 Goal

These rules ensure that:
- ✅ Code is consistent across the project
- ✅ Quality standards are maintained
- ✅ Accessibility is never compromised
- ✅ MD3 specifications are followed
- ✅ Developer experience is excellent
- ✅ Codebase is maintainable long-term

**When in doubt, prioritize: Accessibility > Consistency > Convenience**

