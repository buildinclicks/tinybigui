import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

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
  typescript: {
    check: false, // Disable type checking (we do it separately)
    reactDocgen: "react-docgen-typescript", // Generate prop types from TypeScript
  },
  viteFinal(config) {
    // Merge with our Vite config to include Tailwind CSS v4 plugin
    return mergeConfig(config, {
      plugins: [tailwindcss()],
    });
  },
};

export default config;
