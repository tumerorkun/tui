import styles from "./styles.module.scss";
import { PureArgsTable } from "@storybook/blocks";
import type { Args } from "@storybook/react";
import { useState } from "react";
import { normalizeColor } from "../../utils/creators";

export const Color = ({ color, name }: { color: string; name: string }) => {
  const normalized = normalizeColor(color)!;

  const [currentColor, setColor] = useState(normalized);
  const [noAlpha, setNoAlpha] = useState(false);

  const [currentOpacity, setOpacity] = useState(normalized?.opacity ?? 100);

  const updateArgs = ({
    color: updateColor,
    opacity: updateOpacity,
    noAlpha: unpdateNoAlpha,
  }: Args) => {
    if (unpdateNoAlpha !== undefined) {
      return setNoAlpha(unpdateNoAlpha);
    }
    let normalized: ReturnType<typeof normalizeColor> | undefined;
    if (
      currentColor.sampleColor.includes("#") &&
      updateColor &&
      !updateColor.includes("#")
    ) {
      normalized = normalizeColor(
        updateColor ?? currentColor.sampleColor,
        noAlpha ? 100 : currentOpacity
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
        updateOpacity
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
        style={{ backgroundColor: currentColor.sampleColor }}
        title={currentColor.sampleColor}
      />
      <PureArgsTable
        key={name}
        compact
        updateArgs={updateArgs}
        args={{
          color:
            currentColor?.sampleColor.includes("#") && noAlpha
              ? currentColor.noAlphaColor
              : currentColor.color,
          name,
          opacity: currentOpacity,
          ...(currentColor?.sampleColor.includes("#") ? { noAlpha } : {}),
        }}
        rows={{
          name: { name: "Name", control: { type: "text" } },
          color: { name: "Color", control: { type: "color" } },
          ...(currentColor?.sampleColor.includes("#")
            ? {
                noAlpha: {
                  name: "no Alpha",
                  control: { type: "boolean" },
                },
              }
            : {}),
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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 20,
        justifyContent: "space-between",
      }}
    >
      {(Object.entries(colors) as [string, string][]).map(([name, value]) => {
        return <Color key={name} color={value} name={name} />;
      })}
    </div>
  );
};
