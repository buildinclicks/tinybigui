import type { Preview } from '@storybook/react-vite';
import '../src/styles.css'; // Import MD3 tokens and Tailwind

const preview: Preview = {
  parameters: {
    // Configure controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true, // Expand controls by default
      sort: 'requiredFirst', // Show required props first
    },

    // Configure actions
    actions: {
      argTypesRegex: '^on[A-Z].*', // Auto-detect event handlers
    },

    // Configure backgrounds for light/dark mode testing
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#fef7ff', // MD3 surface light
        },
        {
          name: 'dark',
          value: '#1c1b1f', // MD3 surface dark
        },
      ],
    },

    // Configure viewport presets
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },

    // Configure accessibility addon
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
      config: {
        rules: [
          {
            // Enforce WCAG AA compliance
            id: 'color-contrast',
            enabled: true,
          },
          {
            // Ensure proper heading hierarchy
            id: 'heading-order',
            enabled: true,
          },
          {
            // Ensure images have alt text
            id: 'image-alt',
            enabled: true,
          },
        ],
      },
    },

    // Configure docs
    docs: {
      toc: true, // Show table of contents
      source: {
        state: 'open', // Show source code by default
      },
    },

    // Configure layout
    layout: 'centered', // Center components by default
  },

  // Global types for toolbar controls
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
