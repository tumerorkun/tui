function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export const hexToPercentage = (hex: string) => {
  return Math.round((parseInt(hex, 16) / 255) * 100);
};
export const percentageToHex = (percent: number) => {
  return Math.round((percent / 100) * 255)
    .toString(16)
    .padStart(2, "0");
};

export const blendWith = (
  background: number = 255,
  color: number,
  alpha: number
) => {
  return color * alpha + background * (1 - alpha);
};

export const normalizeColor = (color: string, opacity?: number) => {
  if (color.includes("rgba")) {
    const { red, green, blue, alpha } =
      /^rgba\((?<red>\d{1,3}),\s?(?<green>\d{1,3}),\s?(?<blue>\d{1,3}),\s?(?<alpha>\d{1}|0\.\d{1,2})\)/.exec(
        color
      )?.groups ?? {};
    return {
      color: `rgba(${red}, ${green}, ${blue}, ${
        opacity !== undefined ? opacity / 100 : alpha
      })`,
      sampleColor: `rgba(${red}, ${green}, ${blue}, ${
        opacity !== undefined ? opacity / 100 : alpha
      })`,
      isRgba: true,
      channels: { red, green, blue, alpha },
      opacity: opacity ?? Number(alpha) * 100,
      hexOpacity: percentageToHex(opacity ?? Number(alpha) * 100),
    };
  }

  if (color.includes("hsla")) {
    const { hue, saturation, lightness, alpha } =
      /^hsla\((?<hue>\d{1,3}),\s?(?<saturation>\d{1,3}%),\s?(?<lightness>\d{1,3}%),\s?(?<alpha>\d{1}|0\.\d{1,2})\)/.exec(
        color
      )?.groups ?? {};

    return {
      color: `hsla(${hue}, ${saturation}, ${lightness}, ${
        opacity !== undefined ? opacity / 100 : alpha
      })`,
      sampleColor: `hsla(${hue}, ${saturation}, ${lightness}, ${
        opacity !== undefined ? opacity / 100 : alpha
      })`,
      isHsla: true,
      channels: { hue, saturation, lightness },
      opacity: opacity ?? Number(alpha) * 100,
      hexOpacity: percentageToHex(opacity ?? Number(alpha) * 100),
    };
  }

  if (color.includes("#")) {
    const { red, green, blue } =
      /^#(?<red>[a-f\d]{2})(?<green>[a-f\d]{2})(?<blue>[a-f\d]{2})/.exec(color)
        ?.groups ?? {};

    const noAlphaColor = rgbToHex(
      blendWith(255, parseInt(red, 16), (opacity ?? 100) / 100),
      blendWith(255, parseInt(green, 16), (opacity ?? 100) / 100),
      blendWith(255, parseInt(blue, 16), (opacity ?? 100) / 100)
    );

    return {
      sampleColor: `#${red}${green}${blue}${
        opacity !== undefined && opacity !== 100 ? percentageToHex(opacity) : ""
      }`,
      noAlphaColor: noAlphaColor,
      color: `#${red}${green}${blue}${
        opacity !== undefined && opacity !== 100 ? percentageToHex(opacity) : ""
      }`,
      isHex: true,
      channels: { red, green, blue },
      opacity: opacity,
      hexOpacity: percentageToHex(opacity!),
    };
  }
};
