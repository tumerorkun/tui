import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import { dark } from "../src/theme/dark";
import { light } from "../src/theme/light";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "white" },
        { name: "dark", value: "black" },
      ],
    },
  },
};

export default preview;

export const decorators = [
  withThemeFromJSXProvider({
    themes: { light, dark },
    // Provider: null,
    defaultTheme: "light",
    // GlobalStyles: FireUIStyle, // Adds your GlobalStyle component to all stories
  }),
];
