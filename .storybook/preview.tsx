import type { Preview } from "@storybook/react";
import { dark } from "../src/theme/dark";
import { light } from "../src/theme/light";
import React, { FC, PropsWithChildren } from "react";
import { initialize, mswDecorator } from "msw-storybook-addon";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [{ value: "en", right: "🇺🇸", title: "English" }],
      },
    },
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        items: [
          { title: "Light Theme", value: "light", icon: "sun" },
          { title: "Dark Theme", value: "dark", icon: "moon" },
        ],
        dynamicTitle: true,
        dynamicIcon: true,
      },
    },
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disable: true },
  },
};

export default preview;

const ThemeProvider = ({
  children,
  theme,
}: PropsWithChildren & { theme: typeof dark | typeof light }) => {
  return <>{children}</>;
};

const withThemeProvider = (
  Story: FC,
  context: { globals: { theme: "light" | "dark" } }
) => {
  const theme = context.globals.theme === "light" ? light : dark;
  return (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  );
};

export const decorators = [mswDecorator, withThemeProvider];
