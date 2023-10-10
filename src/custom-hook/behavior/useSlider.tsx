import {
  dataAttr,
  getEventPoint,
  getNativeEvent,
  isLeftClick,
  isModifiedEvent,
} from "@zag-js/dom-utils";
import React, { RefObject, useEffect } from "react";
import { element } from "./core";
import { Context, Point, Rect, SliderProps } from "./slider.types";
import { useSliderState } from "./useSliderState";

export function useSlider(
  props: SliderProps,
  controlRef: RefObject<HTMLElement>,
  thumbRef: RefObject<HTMLElement>,
) {
  const ctx: Context = {
    dir: "ltr",
    isDisabled: false,
    isReadOnly: false,
    maxValue: 100,
    minValue: 0,
    orientation: "horizontal",
    step: 1,
    ...props,
  };
  const [state, send] = useSliderState(
    ctx,
    {
      value: props.value,
    },
    {
      value: props.onValueChange,
    },
  );

  useEffect(() => {
    if (state.interaction === "focused" || state.interaction === "dragging") {
      thumbRef.current?.focus();
    }
  }, [state.interaction]);

  const controlRectRef = React.useRef<Rect | null>(null);

  const { isDisabled, isReadOnly, orientation, dir, minValue, maxValue, step } =
    ctx;
  const { value, interaction } = state;
  const isInteractive = !isDisabled && !isReadOnly;

  const stateProps = {
    "data-disabled": dataAttr(isDisabled),
    "data-focus": dataAttr(interaction === "focused"),
    "data-orientation": orientation,
    dir: dir,
  };

  return {
    stateProps,
    rootProps: element({
      ...stateProps,
      "data-part": "root",
    }),
    controlProps: element({
      ...stateProps,
      "data-part": "control",
      onPointerDown(event: React.PointerEvent) {
        if (!isInteractive) return;

        const evt = getNativeEvent(event);
        if (!isLeftClick(evt) || isModifiedEvent(evt)) return;

        const point = getEventPoint(evt);
        const controlRect =
          controlRectRef.current || controlRef.current!.getBoundingClientRect();
        controlRectRef.current = controlRect;
        const value = getValueFromPoint(point, controlRect, ctx);
        send({ type: "POINTER_DOWN", value });

        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);

        event.preventDefault();
        event.stopPropagation();
      },
      onPointerMove(event: React.PointerEvent) {
        if (!isInteractive) return;

        const target = event.target as HTMLElement;
        if (!target.hasPointerCapture(event.pointerId)) return;

        const evt = getNativeEvent(event);
        const point = getEventPoint(evt);
        const controlRect =
          controlRectRef.current || controlRef.current!.getBoundingClientRect();
        controlRectRef.current = controlRect;
        const value = getValueFromPoint(point, controlRect, ctx);
        send({ type: "POINTER_MOVE", value });
      },
      onPointerUp(event: React.PointerEvent) {
        const target = event.target as HTMLElement;
        if (target.hasPointerCapture(event.pointerId)) {
          controlRectRef.current = null;
          target.releasePointerCapture(event.pointerId);
          send({ type: "POINTER_UP" });
        }
      },
    }),
    trackProps: element({
      "data-part": "track",
      ...stateProps,
    }),
    rangeProps: element({
      "data-part": "range",
      ...stateProps,
      style: {
        position: "absolute" as const,
        [dir === "rtl" ? "right" : "left"]: 0,
        [dir === "rtl" ? "left" : "right"]:
          (1 - (value - minValue) / (maxValue - minValue)) * 100 + "%",
      },
    }),
    thumbProps: element({
      "data-part": "thumb",
      ...stateProps,
      draggable: false,
      role: "slider",
      tabIndex: isDisabled ? undefined : 0,
      onPointerDown(event: React.PointerEvent) {
        if (!isInteractive) return;
        send({ type: "THUMB_POINTER_DOWN" });

        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);

        event.stopPropagation();
      },
      onFocus() {
        send({ type: "FOCUS" });
      },
      onBlur() {
        send({ type: "BLUR" });
      },
      onKeyDown(event: React.KeyboardEvent) {
        if (event.key === "ArrowLeft") {
          send({ type: "ARROW_LEFT" });
          event.preventDefault();
          event.stopPropagation();
        }
        if (event.key === "ArrowRight") {
          send({ type: "ARROW_RIGHT" });
          event.preventDefault();
          event.stopPropagation();
        }
      },
      style: {
        [orientation === "horizontal" ? "left" : "top"]:
          ((value - minValue) / (maxValue - minValue)) * 100 + "%",
      },
    }),
    hiddenInputProps: {
      hidden: true,
    },
    markerGroupProps: {},
    getMarkerProps: () => {},
  };
}

function getValueFromPoint(point: Point, controlRect: Rect, context: Context) {
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
