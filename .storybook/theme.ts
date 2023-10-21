import { create } from "@storybook/theming/create";
import pkg from "../package.json";

export default create({
  base: "dark",
  brandTitle: `<h1>t-UI</h1><h5><small>v${pkg.version}</small></h5>`,
  // brandUrl: "https://tst-app.fireflyon.com",
});
