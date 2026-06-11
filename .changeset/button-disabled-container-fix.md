---
"@tinybigui/react": patch
---

fix(button): move container background to child slot so disabled state overrides apply

Tailwind `group-data-[disabled]/button:` generates a descendant combinator selector, so it cannot target the root `<button>` group host directly. Background color now lives on an absolutely-positioned `buttonContainerVariants` child span, matching the Switch track pattern and ensuring `group-data-[disabled]/button:bg-on-surface/12` wins over variant backgrounds. Elevation overrides on the root use self-targeting `data-[disabled]:` selectors for the same reason.
