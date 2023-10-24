import styles from "./styles.module.scss";
import { PureArgsTable } from "@storybook/blocks";
import type { Args } from "@storybook/react";
import { useState } from "react";
import { normalizeColor } from "../../utils/creators";

export const Color = ({ color, name }: { color: string; name: string }) => {
  const normalized = normalizeColor(color)!;

  const [currentColor, setColor] = useState(normalized);

  const [currentOpacity, setOpacity] = useState(normalized?.opacity ?? 100);

  const updateArgs = ({ color: updateColor, opacity: updateOpacity }: Args) => {
    let normalized: ReturnType<typeof normalizeColor> | undefined;
    if (
      currentColor.sampleColor.includes("#") &&
      updateColor &&
      !updateColor.includes("#")
    ) {
      normalized = normalizeColor(
        updateColor ?? currentColor.sampleColor,
        currentOpacity
      );
    } else if (
      !currentColor.sampleColor.includes("#") &&
      updateColor?.includes("#")
    ) {
      normalized = normalizeColor(
        updateColor,
        normalizeColor(currentColor.sampleColor)?.opacity
      );
    } else {
      normalized = normalizeColor(
        updateColor ?? currentColor.sampleColor,
        updateOpacity !== undefined ? updateOpacity : currentOpacity
      );
    }

    if (normalized) {
      setColor(normalized);
      setOpacity(normalized.opacity!);
    }
  };

  return (
    <div className={styles.colorSet} key={name}>
      <div
        className={styles.color}
        style={{
          backgroundColor: currentColor.sampleColor,
          boxShadow: `1px 0px 3px ${currentColor.sampleColor}`,
        }}
        title={currentColor.sampleColor}
      />
      <PureArgsTable
        key={name}
        compact
        updateArgs={updateArgs}
        args={{ color: currentColor.color, name, opacity: currentOpacity }}
        rows={{
          name: { name: "Name", control: { type: "text" } },
          color: { name: "Color", control: { type: "color", opacity: true } },
          ...(currentColor?.sampleColor.includes("#")
            ? {
                opacity: {
                  name: "Opacity",
                  control: { type: "range", min: 0, max: 100, step: 1 },
                },
              }
            : {}),
        }}
      />
    </div>
  );
};

export const ColorSet = () => {
  const colors = JSON.parse(window.localStorage.getItem("tui-colors") ?? "{}");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 20 }}>
      {(Object.entries(colors) as [string, string][]).map(([name, value]) => {
        return <Color key={name} color={value} name={name} />;
      })}
    </div>
  );
};
