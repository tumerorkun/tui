import fs from "node:fs";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { classNameHashing } from "./rollup-utils";

const hooks = fs.readdirSync("./src/hooks").reduce(
  (hooks, hook) => ({
    ...hooks,
    [`hooks/${hook.split(".").at(0)}`]: `src/hooks/${hook}`,
  }),
  {}
);

const createPlugins = (cssPlugins = []) => [
  external(),
  resolve(),
  commonjs(),
  typescript(),
  ...cssPlugins,
  terser(),
];

const createPostcss = ({ include, extract }) =>
  postcss({
    minimize: true,
    namedExports: true,
    include: `src/${include}`,
    extract: extract,
    modules: { generateScopedName: classNameHashing },
  });

const input = (comp) => ({
  [`components/${comp}/index`]: `src/components/${comp}/index.tsx`,
  ...hooks,
});
const output = [{ dir: "dist", format: "esm", sourcemap: true }];

export default [
  {
    output,
    input: input("Button"),
    external: ["classnames"],
    plugins: createPlugins([
      createPostcss({
        include: "components/Button/styles.module.scss",
        extract: "components/Button/index.css",
      }),
      createPostcss({
        include: "components/Button/variants.scss",
        extract: "components/Button/variants.css",
      }),
      createPostcss({
        include: "styles/common.module.scss",
        extract: "styles/common.css",
      }),
    ]),
  },
];
