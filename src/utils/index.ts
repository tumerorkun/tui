export const wait = (ms: number) =>
  new Promise((res) => setTimeout(() => res(null), ms));

export const calculateStrokeWidth = (
  size?: number | "100%",
  width?: number | "100%",
  viewPointWidth: number = 24,
  defaultStrokeWidth: number = 1.5
) => {
  const factor = size ?? width;
  return (
    (viewPointWidth /
      (isNaN(Number(factor)) ? viewPointWidth : (factor as number))) *
    defaultStrokeWidth
  );
};
