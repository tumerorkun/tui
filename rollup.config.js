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

export default [
  {
    input: { index: "src/index.ts", ...components },
    output: [{ dir: "dist", format: "esm", sourcemap: true }],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript(),
      postcss({
        extract: true,
        minimize: true,
        namedExports: true,
        modules: { generateScopedName: classNameHashing },
      }),
      terser(),
    ],
  },
  {
    input: { index: "src/index.ts", ...components },
    output: [{ dir: "dist", format: "esm", sourcemap: true }],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript(),
      postcss({
        include: "src/styles/common.module.scss",
        extract: "common/styles.css",
        minimize: true,
        namedExports: true,
        modules: { generateScopedName: classNameHashing },
      }),
      postcss({
        include: "src/components/Button/styles.module.scss",
        extract: "components/Button/index.css",
        minimize: true,
        namedExports: true,
        modules: { generateScopedName: classNameHashing },
      }),
      postcss({
        include: "src/components/ButtonTemp/styles.module.scss",
        extract: "components/ButtonTemp/index.css",
        minimize: true,
        namedExports: true,
        modules: { generateScopedName: classNameHashing },
      }),

      terser(),
    ],
  },
];
