import stringHash from "string-hash";

export const classNameHashing = (name, filename, css) => {
  const nameHash = stringHash(name).toString(36).substring(0, 7);
  const fileNameHash = stringHash(filename).toString(36).substring(0, 7);
  const cssHash = stringHash(css).toString(36).substring(0, 7);
  return `tui_${nameHash}${fileNameHash}__${cssHash}`;
};
