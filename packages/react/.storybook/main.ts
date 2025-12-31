import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "tailwindcss";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: undefined, // Use default Vite config
      },
    },
  },
  viteFinal(config) {
    // Configure Tailwind CSS v4 as PostCSS plugin
    config.css = config.css ?? {};
    config.css.postcss = {
      plugins: [tailwindcss()],
    };
    return config;
  },
  docs: {
    autodocs: "tag", // Auto-generate docs for components with "autodocs" tag
  },
  typescript: {
    check: false, // Disable type checking (we do it separately)
    reactDocgen: "react-docgen-typescript", // Generate prop types from TypeScript
  },
};

export default config;
