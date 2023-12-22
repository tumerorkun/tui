import fs from "node:fs";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import stringHash from "string-hash";

const packageJson = require("./package.json");

const classNameHashing = (name, filename, css) => {
  const nameHash = stringHash(name).toString(36).substring(0, 7);
  const fileNameHash = stringHash(filename).toString(36).substring(0, 7);
  const cssHash = stringHash(css).toString(36).substring(0, 7);
  return `tui_${nameHash}${fileNameHash}__${cssHash}`;
};

const components = fs
  .readdirSync("src/components")
  .filter((file) => file !== "common")
  .reduce((acc, file) => {
    return {
      ...acc,
      [`components/${file.split(".")[0]}${
        file.split(".")[0] !== "index" ? "/index" : ""
      }`]: `./src/components/${file.split(".")[0]}/index.tsx`,
    };
  }, {});

console.log(components);

const createPlugins = (cssPlugins) => [
  external(),
  resolve(),
  commonjs(),
  typescript(),
  ...cssPlugins,
  terser(),
];

export default [
  {
    input: { "components/Button/index": "src/components/Button/index.tsx" },
    output: [{ dir: "dist", format: "esm", sourcemap: true }],
    plugins: createPlugins([
      postcss({
        minimize: true,
        namedExports: true,
        include: "src/components/Button/styles.module.scss",
        extract: "components/Button/index.css",
        modules: { generateScopedName: classNameHashing },
      }),
      postcss({
        minimize: true,
        namedExports: true,
        include: "src/components/Button/variants.scss",
        extract: "components/Button/variants.css",
        modules: { generateScopedName: classNameHashing },
      }),
      postcss({
        minimize: true,
        namedExports: true,
        include: "src/styles/common.module.scss",
        extract: "styles/common.css",
        modules: { generateScopedName: classNameHashing },
      }),
    ]),
  },
  {
    input: {
      "components/SecondButton/index": "src/components/SecondButton/index.tsx",
    },
    output: [{ dir: "dist", format: "esm", sourcemap: true }],
    plugins: createPlugins([
      postcss({
        minimize: true,
        namedExports: true,
        include: "src/components/SecondButton/styles.module.scss",
        extract: "components/SecondButton/index.css",
        modules: { generateScopedName: classNameHashing },
      }),
      postcss({
        minimize: true,
        namedExports: true,
        include: "src/components/SecondButton/variants.scss",
        extract: "components/SecondButton/variants.css",
        modules: { generateScopedName: classNameHashing },
      }),
      postcss({
        minimize: true,
        namedExports: true,
        include: "src/styles/common.module.scss",
        extract: "styles/common.css",
        modules: { generateScopedName: classNameHashing },
      }),
    ]),
  },
];
