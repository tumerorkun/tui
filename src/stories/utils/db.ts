import { nanoid } from "nanoid";

type Colors = {
  [groupId: string]: {
    name: string;
    timestamp: number;
    colors: {
      [colorId: string]: { name: string; value: string; timestamp: number };
    };
  };
};

export const getColors = (): Colors => {
  // return {
  //   "g-1-id": {
  //     name: "group-1",
  //     colors: {
  //       "colorid-1": { name: "color 1", value: "#ffffff" },
  //       "colorid-2": { name: "color 2", value: "#cccccc" },
  //     },
  //   },
  //   "g-2-id": {
  //     name: "group-2",
  //     colors: {
  //       "colorid-1": { name: "g-2 color 1", value: "#ffffff" },
  //       "colorid-2": { name: "g-2 color 2", value: "#cccccc" },
  //     },
  //   },
  // };
  return JSON.parse(window.localStorage.getItem("tui-colors") ?? "{}");
};
export const setColors = (colors: Colors) => {
  window.localStorage.setItem("tui-colors", JSON.stringify(colors));
};
export const getColorGroupIDs = () => {
  const groups = Object.entries(getColors());
  return groups
    .sort(
      ([_group1ID, { timestamp }], [_group2Id, { timestamp: timestamp2 }]) =>
        timestamp > timestamp2 ? -1 : 1
    )
    .map(([id]) => id);
};
export const isColorGroupExists = (id: string) =>
  getColorGroupIDs().includes(id);
export const getColorGroupNames = () => {
  const colors = getColors();
  return Object.keys(colors).map((id) => colors[id].name);
};

export const getColorsIn = (groupId: string) => {
  const colors = getColors();
  return Object.keys(colors[groupId]?.colors ?? {})
    .map((colorId) => ({
      id: colorId,
      ...colors[groupId].colors[colorId],
    }))
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
};

export const getFlatColors = () => {
  const colors = getColors();
  return getColorGroupIDs().flatMap((group) =>
    Object.values(colors[group].colors).flatMap(({ value }) => value)
  );
};

export const addNewColorGroup = (id: string, name: string) => {
  const colors = getColors();
  if (!colors[id]) {
    return setColors({
      ...colors,
      [id]: { name, colors: {}, timestamp: new Date().getTime() },
    });
  }
};
export const setColorGroup = (id: string, name: string) => {
  const colors = getColors();
  if (colors[id]) {
    return setColors({
      ...colors,
      [id]: {
        name,
        colors: { ...colors[id].colors },
        timestamp: new Date().getTime(),
      },
    });
  }
};

export const removeColorGroup = (id: string) => {
  const colors = getColors();
  if (colors[id]) {
    delete colors[id];
    return setColors(colors);
  }
};

export const removeColor = (groupId: string, id: string) => {
  const colors = getColors();
  if (colors[groupId] && colors[groupId].colors[id]) {
    delete colors[groupId].colors[id];
    return setColors(colors);
  }
};

export const setColortoDb = ({
  groupId,
  color,
  colorId,
  name,
}: {
  groupId: string;
  colorId?: string;
  name: string;
  color: string;
}) => {
  const colors = getColors();
  const colorid = colorId ?? nanoid();
  setColors({
    ...colors,
    [groupId]: {
      ...(colors[groupId] ?? {}),
      colors: {
        ...(colors[groupId]?.colors ?? {}),
        [colorId ?? nanoid()]: {
          name,
          value: color,
          timestamp: new Date().getTime(),
        },
      },
    },
  });
  return colorid;
};
