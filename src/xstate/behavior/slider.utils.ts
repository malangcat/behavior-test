import { Context, Point, Rect } from "./slider.types";

export function getValueFromPoint(
  point: Point,
  controlRect: Rect,
  context: Context,
) {
  const { orientation, minValue, maxValue, step } = context;
  const length =
    orientation === "horizontal" ? controlRect.width : controlRect.height;
  const percentage =
    orientation === "horizontal"
      ? (point.x - controlRect.left) / length
      : (point.y - controlRect.top) / length;
  const value = percentage * (maxValue - minValue) + minValue;
  return Math.round(value / step) * step;
}

export function compact<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
