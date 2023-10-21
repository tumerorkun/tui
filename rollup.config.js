import fs from "node:fs";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import stringHash from "string-hash";

const packageJson = require("./package.json");

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
        minimize: true,
        modules: {
          generateScopedName: (name, filename, css) =>
            `_${stringHash(css).toString(36).substring(0, 7)}`,
        },
      }),
      terser(),
    ],
  },
];
