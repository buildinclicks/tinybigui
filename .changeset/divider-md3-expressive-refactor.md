---
"@tinybigui/react": minor
"@tinybigui/tokens": minor
---

refactor(divider)!: slot-based CVA, CSS-var thickness, logical RTL insets; remove subheader label

**BREAKING CHANGES:**

- `label` prop removed from `Divider`. The subheader variant (text centered between two rules) was not part of the MD3 divider spec and has been removed.
- Inset variants now use logical inline properties (`margin-inline-start` / `margin-inline-end`) instead of physical margins. This is a visual change only in RTL layouts.

**What changed:**

- Styling switched from `border-*` to a background-fill approach (`bg-outline-variant`) on a zero-border element. Matches the `@material/web` `MdDivider` implementation.
- Thickness is now controlled by the `--md-divider-thickness` CSS custom property (default `1px`, MD3 1dp). Override per instance: `<Divider style={{ "--md-divider-thickness": "2px" }} />`.
- `Divider.variants.ts` rewritten following the documented slot-CVA architecture used by Button and Switch (spec header comment, array-form base, explicit `defaultVariants`).
- `DividerHeadless` simplified — `label` and `children` props removed from the interface.
- All MD3 design token classes (no arbitrary values).
- 22 tests cover orientation, insets, bg token, ref forwarding, and axe accessibility.
