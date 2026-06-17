---
"@tinybigui/react": patch
---

**Button:** fix loading usage, outlined variant styling, and disabled state selectors

- **fix:** outlined variant uses `border-outline-variant` and explicit `bg-transparent` per MD3 spec
- **fix:** filled disabled overrides use `group-data-[disabled]/button:` selectors so background and text colors apply correctly on the root group host
- **fix:** focus/pressed shadow overrides use `group-data-[focus-visible]/button` and `group-data-[pressed]/button` for consistent cascade with hover
- **fix:** state layer hover opacity uses explicit `opacity-[0.08]` token; pressed state layer no longer requires doubled selector
- **docs:** loading Storybook examples simplified (icons removed from loading demos)
