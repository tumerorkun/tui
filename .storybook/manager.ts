import { addons } from "@storybook/addons";
import firestrapTheme from "./theme";

addons.setConfig({
  theme: firestrapTheme,
  sidebar: { filters: { show: (item) => !item.tags?.includes("hide") } },
});
