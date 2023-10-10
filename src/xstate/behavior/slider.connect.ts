import {
  dataAttr,
  getEventPoint,
  getNativeEvent,
  isLeftClick,
  isModifiedEvent,
} from "@zag-js/dom-utils";
import type { NormalizeProps, PropTypes } from "@zag-js/types";
import React from "react";
import { InterpreterFrom, StateFrom } from "xstate";
import { sliderMachine } from "./slider.machine";
import { dom } from "./slider.dom";

export function connect<T extends PropTypes>(
  state: StateFrom<typeof sliderMachine>,
  send: InterpreterFrom<typeof sliderMachine>["send"],
  normalize: NormalizeProps<T>,
) {
  const {
    value,
    isDisabled,
    isReadOnly,
    orientation,
    dir,
    minValue,
    maxValue,
  } = state.context;
  const isFocused = state.matches("focused");
  const isInteractive = !isDisabled && !isReadOnly;

  const stateProps = {
    "data-disabled": dataAttr(isDisabled),
    "data-focus": dataAttr(isFocused),
    "data-orientation": orientation,
    dir: dir,
  };

  return {
    value,
    setValue: (value: number) => {
      send({ type: "SET_VALUE", value });
    },
    setContext: (ctx: Partial<typeof state.context>) => {
      send({ type: "SYNC_PUBLIC_CONTEXT", value: ctx });
    },
    stateProps,
    rootProps: normalize.element({
      ...stateProps,
      id: dom.getRootId(state.context),
      "data-part": "root",
    }),
    controlProps: normalize.element({
      ...stateProps,
      id: dom.getControlId(state.context),
      "data-part": "control",
      onPointerDown(event: React.PointerEvent) {
        if (!isInteractive) return;

        const evt = getNativeEvent(event);
        if (!isLeftClick(evt) || isModifiedEvent(evt)) return;

        const point = getEventPoint(evt);
        send({ type: "POINTER_DOWN", point });

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
        send({ type: "POINTER_MOVE", point });
      },
      onPointerUp(event: React.PointerEvent) {
        const target = event.target as HTMLElement;
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId);
          send({ type: "POINTER_UP" });
        }
      },
    }),
    trackProps: normalize.element({
      id: dom.getTrackId(state.context),
      "data-part": "track",
      ...stateProps,
    }),
    rangeProps: normalize.element({
      id: dom.getRangeId(state.context),
      "data-part": "range",
      ...stateProps,
      style: {
        position: "absolute" as const,
        [dir === "rtl" ? "right" : "left"]: 0,
        [dir === "rtl" ? "left" : "right"]:
          (1 - (value - minValue) / (maxValue - minValue)) * 100 + "%",
      },
    }),
    thumbProps: normalize.element({
      id: dom.getThumbId(state.context),
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
