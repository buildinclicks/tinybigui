import type { Preview, ReactRenderer } from "@storybook/react-vite";
import type { DecoratorFunction } from "storybook/internal/types";
import { withThemeByClassName } from "@storybook/addon-themes";
import "./storybook.css"; // Tailwind + @source scanning + MD3 tokens and component styles

/**
 * Wraps every story in a surface-colored container so that the active MD3
 * theme (light or dark) is visually apparent from the canvas background.
 * Uses semantic token utilities so the color automatically follows the
 * `.dark` / `.light` class applied by withThemeByClassName.
 */
const withThemeWrapper: DecoratorFunction<ReactRenderer> = (Story) => (
  <div className="text-on-surface duration-medium2 min-h-[100px] w-full p-6 transition-colors">
    <Story />
  </div>
);

const preview: Preview = {
  /**
   * Pre-seed the `theme` global so the addon-themes toolbar renders its
   * initial label ("light theme") without waiting for the first story render.
   */
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    withThemeWrapper,
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    // Configure controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true, // Expand controls by default
      sort: "requiredFirst", // Show required props first
    },

    // Configure actions
    actions: {
      argTypesRegex: "^on[A-Z].*", // Auto-detect event handlers
    },

    // Configure viewport presets
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "375px", height: "667px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },

    // Configure accessibility addon
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
      config: {
        rules: [
          {
            // Enforce WCAG AA compliance
            id: "color-contrast",
            enabled: true,
          },
          {
            // Ensure proper heading hierarchy
            id: "heading-order",
            enabled: true,
          },
          {
            // Ensure images have alt text
            id: "image-alt",
            enabled: true,
          },
        ],
      },
    },

    // Configure docs
    docs: {
      toc: true, // Show table of contents
      source: {
        state: "open", // Show source code by default
      },
    },

    // Configure layout
    layout: "centered", // Center components by default
  },
};

export default preview;
