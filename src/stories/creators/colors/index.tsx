import { PureArgsTable } from "@storybook/blocks";
import type { Args } from "@storybook/react";
import { useEffect, useState } from "react";
import { normalizeColor } from "../../utils";
import {
  addNewColorGroup,
  getColorGroupIDs,
  getColors,
  getColorsIn,
  isColorGroupExists,
  removeColor,
  removeColorGroup,
  setColorGroup,
  setColortoDb,
} from "../../utils/db";
import { Button } from "../../../components/Button";
import { nanoid } from "nanoid";
import styles from "./styles.module.scss";

export const Color = ({
  id,
  groupId,
  color,
  name,
  onCreate,
  onRemove,
}: {
  id?: string;
  groupId: string;
  color: string;
  name: string;
  onCreate?: () => void;
  onRemove?: () => void;
}) => {
  const normalized = normalizeColor(color)!;
  const [currentColor, setColor] = useState(normalized);
  const [colorName, setName] = useState(name);
  const [alphaChannel, setNoAlpha] = useState(false);
  const noAlpha = !alphaChannel;
  const [currentOpacity, setOpacity] = useState(normalized?.opacity ?? 100);

  const updateArgs = ({
    name: updateName,
    color: updateColor,
    opacity: updateOpacity,
    alphaChannel: unpdateNoAlpha,
  }: Args) => {
    if (unpdateNoAlpha !== undefined) {
      setColortoDb({
        colorId: id,
        groupId: groupId,
        name: updateName ?? colorName,
        color: unpdateNoAlpha
          ? currentColor!.noAlphaColor ?? currentColor!.sampleColor
          : currentColor!.sampleColor,
      });
      onCreate?.();
      if (unpdateNoAlpha) {
        setOpacity(100);
      } else {
        setOpacity(currentColor.opacity);
      }
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
      updateName && setName(updateName);
      setColor(normalized);
      setOpacity(normalized.opacity!);

      setColortoDb({
        colorId: id,
        groupId: groupId,
        name: updateName ?? colorName,
        color: noAlpha
          ? normalized!.noAlphaColor ?? normalized!.sampleColor
          : normalized!.sampleColor,
      });
      onCreate?.();
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
        key={id}
        compact
        updateArgs={updateArgs}
        args={{
          color:
            currentColor?.sampleColor.includes("#") && noAlpha
              ? currentColor.noAlphaColor
              : currentColor.color,
          name: colorName,
          opacity: currentOpacity,
          ...(currentColor?.sampleColor.includes("#") ? { alphaChannel } : {}),
        }}
        rows={{
          color: { name: "Color", control: { type: "color" } },
          ...(currentColor?.sampleColor.includes("#")
            ? { alphaChannel: { name: "Alpha", control: { type: "boolean" } } }
            : {}),
          ...(currentColor?.sampleColor.includes("#") && !noAlpha
            ? {
                opacity: {
                  name: "Opacity",
                  control: { type: "range", min: 0, max: 100, step: 1 },
                },
              }
            : {}),
          ...(currentColor.color
            ? { name: { name: "Name", control: { type: "text" } } }
            : {}),
        }}
      />
      <div
        style={{
          alignSelf: "flex-end",
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Button onClick={onRemove}>Remove</Button>
      </div>
    </div>
  );
};

export const ColorGroup = ({
  id,
  onCreate,
}: {
  id: string;
  onCreate?: () => void;
}) => {
  const [, setUpdate] = useState(false);
  const isGroupExists = isColorGroupExists(id);

  const colors = getColors();
  const groupColors = getColorsIn(id);
  const [newColorId, setNewColorId] = useState<string | null>(null);

  const [groupName, setGroupName] = useState(
    isGroupExists ? colors[id].name : "New Color Group"
  );
  useEffect(() => {
    if (onCreate && !isGroupExists) {
      addNewColorGroup(id, groupName);
      onCreate();
    }
  }, [id, onCreate, isGroupExists, groupName]);

  if (!isGroupExists) {
    return null;
  }
  return (
    <>
      <div className={styles.colorGroup}>
        <div className={styles.header}>
          <h3 id={colors[id].name}>
            <PureArgsTable
              key={`group-${id}`}
              compact
              updateArgs={({ groupName }) => {
                setGroupName(groupName);
                setColorGroup(id, groupName);
              }}
              args={{ groupName }}
              rows={{ groupName: { control: { type: "text" } } }}
            />
          </h3>
          <div style={{ display: "flex" }}>
            <Button
              disabled={Boolean(newColorId)}
              onClick={() => {
                removeColorGroup(id);
                setUpdate((u) => !u);
              }}
            >
              Remove Group
            </Button>
            <Button
              disabled={Boolean(newColorId)}
              onClick={() => {
                setNewColorId(nanoid());
              }}
            >
              Add Color
            </Button>
          </div>
        </div>

        <div className={styles.group}>
          {newColorId ? (
            <Color
              key={newColorId}
              id={newColorId}
              groupId={id}
              color="rgba(0, 0, 0, 0)"
              name="New Color"
              onCreate={() => setNewColorId(null)}
            />
          ) : null}
          {groupColors
            .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
            .map(({ id: colorId, name: colorName, value }) => (
              <Color
                id={colorId}
                groupId={id}
                key={colorId}
                color={value}
                name={colorName}
                onRemove={() => {
                  removeColor(id, colorId);
                  setUpdate((u) => !u);
                }}
              />
            ))}
        </div>
      </div>
      <hr />
    </>
  );
};

export const ColorGroups = () => {
  const [newGroupId, setNewColorGroup] = useState<string | null>(null);
  return (
    <>
      <div className={styles.header}>
        <h1 id={"colors"}>Colors</h1>
        <div>
          <Button
            disabled={Boolean(newGroupId)}
            onClick={() => {
              setNewColorGroup(nanoid());
            }}
          >
            Add Color Group
          </Button>
        </div>
      </div>
      <hr />
      {newGroupId ? (
        <ColorGroup
          key={newGroupId}
          id={newGroupId}
          onCreate={() => {
            setNewColorGroup(null);
          }}
        />
      ) : null}
      {getColorGroupIDs().map((id) => (
        <ColorGroup key={id} id={id} />
      ))}
    </>
  );
};
