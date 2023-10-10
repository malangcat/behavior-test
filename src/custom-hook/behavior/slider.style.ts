import { getValuePercent, getValueTransformer } from "@zag-js/numeric-range";
import type { CSSProperties as Style } from "react";

interface StyleContext {
  value: number;
  min: number;
  max: number;
  isRtl: boolean;
  isHorizontal: boolean;
  isVertical: boolean;
  origin: "start" | "center";
  thumbAlignment: "center" | "contain";
  thumbSize: { width: number; height: number };
}

/* -----------------------------------------------------------------------------
 * Thumb style calculations
 * -----------------------------------------------------------------------------*/

function getVerticalThumbOffset(ctx: StyleContext) {
  const { height = 0 } = ctx.thumbSize ?? {};
  const getValue = getValueTransformer(
    [ctx.min, ctx.max],
    [-height / 2, height / 2],
  );
  return parseFloat(getValue(ctx.value).toFixed(2));
}

function getHorizontalThumbOffset(ctx: StyleContext) {
  const { width = 0 } = ctx.thumbSize ?? {};

  if (ctx.isRtl) {
    const getValue = getValueTransformer(
      [ctx.max, ctx.min],
      [-width / 2, width / 2],
    );
    return -1 * parseFloat(getValue(ctx.value).toFixed(2));
  }

  const getValue = getValueTransformer(
    [ctx.min, ctx.max],
    [-width / 2, width / 2],
  );
  return parseFloat(getValue(ctx.value).toFixed(2));
}

function getOffset(ctx: StyleContext, percent: number) {
  if (ctx.thumbAlignment === "center") return `${percent}%`;
  const offset = ctx.isVertical
    ? getVerticalThumbOffset(ctx)
    : getHorizontalThumbOffset(ctx);
  return `calc(${percent}% - ${offset}px)`;
}

function getThumbOffset(ctx: StyleContext) {
  let percent = getValuePercent(ctx.value, ctx.min, ctx.max) * 100;
  return getOffset(ctx, percent);
}

function getThumbStyle(ctx: StyleContext): Style {
  const placementProp = ctx.isVertical ? "bottom" : "insetInlineStart";
  return {
    position: "absolute",
    transform: "var(--slider-thumb-transform)",
    [placementProp]: "var(--slider-thumb-offset)",
  };
}

/* -----------------------------------------------------------------------------
 * Range style calculations
 * -----------------------------------------------------------------------------*/

function getRangeOffsets(ctx: StyleContext) {
  const valuePercent = getValuePercent(ctx.value, ctx.min, ctx.max) * 100;
  let start = "0%";
  let end = `${100 - valuePercent}%`;

  if (ctx.origin === "center") {
    const isNegative = valuePercent < 50;
    start = isNegative ? `${valuePercent}%` : "50%";
    end = isNegative ? "50%" : end;
  }

  return { start, end };
}

function getRangeStyle(ctx: StyleContext): Style {
  if (ctx.isVertical) {
    return {
      position: "absolute",
      bottom: "var(--slider-range-start)",
      top: "var(--slider-range-end)",
    };
  }

  return {
    position: "absolute",
    [ctx.isRtl ? "right" : "left"]: "var(--slider-range-start)",
    [ctx.isRtl ? "left" : "right"]: "var(--slider-range-end)",
  };
}

/* -----------------------------------------------------------------------------
 * Control style calculations
 * -----------------------------------------------------------------------------*/

function getControlStyle(): Style {
  return {
    touchAction: "none",
    userSelect: "none",
    position: "relative",
  };
}

/* -----------------------------------------------------------------------------
 * Root style calculations
 * -----------------------------------------------------------------------------*/

function getRootStyle(ctx: StyleContext): Style {
  const range = getRangeOffsets(ctx);
  return {
    "--slider-thumb-transform": ctx.isVertical
      ? "translateY(50%)"
      : ctx.isRtl
      ? "translateX(50%)"
      : "translateX(-50%)",
    "--slider-thumb-offset": getThumbOffset(ctx),
    "--slider-range-start": range.start,
    "--slider-range-end": range.end,
  } as Style;
}

/* -----------------------------------------------------------------------------
 * Label style calculations
 * -----------------------------------------------------------------------------*/

function getLabelStyle(): Style {
  return { userSelect: "none" };
}

/* -----------------------------------------------------------------------------
 * Track style calculations
 * -----------------------------------------------------------------------------*/

function getTrackStyle(): Style {
  return { position: "relative" };
}

/* -----------------------------------------------------------------------------
 * MarkerGroup style calculations
 * -----------------------------------------------------------------------------*/

function getMarkerGroupStyle(): Style {
  return {
    userSelect: "none",
    pointerEvents: "none",
    position: "relative",
  };
}

/* -----------------------------------------------------------------------------
 * Marker style calculations
 * -----------------------------------------------------------------------------*/

function getMarkerStyle(ctx: StyleContext, value: number): Style {
  return {
    position: "absolute",
    pointerEvents: "none",
    [ctx.isHorizontal ? "insetInlineStart" : "bottom"]: getThumbOffset({
      ...ctx,
      value,
    }),
    translate: "var(--tx) var(--ty)",
    "--tx": ctx.isHorizontal ? (ctx.isRtl ? "50%" : "-50%") : "0%",
    "--ty": !ctx.isHorizontal ? "50%" : "0%",
  } as Style;
}

export const styles = {
  getThumbOffset,
  getControlStyle,
  getThumbStyle,
  getRangeStyle,
  getRootStyle,
  getLabelStyle,
  getTrackStyle,
  getMarkerGroupStyle,
  getMarkerStyle,
};
