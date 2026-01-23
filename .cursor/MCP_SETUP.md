# MCP Servers Setup Guide for TinyBigUI

This guide documents the Model Context Protocol (MCP) servers configured for this project.

## Configured MCP Servers

### 1. React Aria (High Priority)

- **Package**: `@react-spectrum/mcp`
- **Purpose**: Direct access to React Aria documentation and hooks
- **Tools**: `list_s2_pages`, `get_s2_page`, `search_s2_icons`
- **Usage**: Ask about React Aria hooks like `useButton`, `useFocusRing`, accessibility patterns

### 2. Material Design 3 (High Priority)

- **Package**: `material3-mcp-server`
- **Purpose**: MD3 component specs, design tokens, accessibility guidance
- **Tools**: Component specs, design token export, icon search
- **Usage**: Ask about MD3 specifications, tokens, WCAG guidelines

### 3. Context7 (Medium Priority)

- **Package**: `@upstash/context7-mcp`
- **Purpose**: Up-to-date npm package documentation
- **Coverage**: Tailwind CSS v4, CVA, clsx, tailwind-merge, all dependencies
- **Usage**: Use "use context7" in prompts for package documentation

## Optional: Context7 API Key

For higher rate limits, add your Context7 API key to `.cursor/mcp.json`:

1. Get key from https://context7.com/
2. Update the Context7 entry with headers:
   ```json
   "Context7": {
     "url": "https://mcp.context7.com/mcp",
     "transport": "http",
     "headers": {
       "x-context7-api-key": "YOUR_KEY"
     }
   }
   ```

## Expected Benefits

| Benefit         | Impact                                      |
| --------------- | ------------------------------------------- |
| Token Reduction | 40-60% less context needed for docs         |
| Speed           | Direct API calls vs searching/reading files |
| Accuracy        | Always current documentation                |
| Consistency     | Same source as official specs               |

## Verification

After configuring, restart Cursor IDE and verify:

1. Check MCP server indicators in Cursor settings
2. Try asking: "What hooks does React Aria provide for buttons?"
3. The response should use the React Aria MCP server
