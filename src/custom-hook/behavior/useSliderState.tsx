import { createStateHook, stateIn } from "./core";
import { Context, State } from "./slider.types";

export const useSliderState = createStateHook<Context, State>(
  {
    states: {
      value: {
        type: "infinite",
        initial: 0,
        writable: true,
        on: {
          POINTER_DOWN: {
            target: (evt) => evt.value,
          },
          POINTER_MOVE: {
            guard: stateIn({
              interaction: "dragging",
            }),
            target: (evt) => evt.value,
          },
          ARROW_LEFT: {
            guard: stateIn({
              interaction: "focused",
            }),
            target: (evt, { state, ctx }) => state - ctx.step,
          },
          ARROW_RIGHT: {
            guard: stateIn({
              interaction: "focused",
            }),
            target: (evt, { state, ctx }) => state + ctx.step,
          },
        },
      },
      interaction: {
        type: "finite",
        initial: "idle",
        states: {
          idle: {
            on: {
              THUMB_POINTER_DOWN: {
                target: "dragging",
              },
              POINTER_DOWN: {
                target: "dragging",
              },
              FOCUS: {
                target: "focused",
              },
            },
          },
          dragging: {
            on: {
              POINTER_UP: {
                target: "focused",
              },
            },
          },
          focused: {
            on: {
              THUMB_POINTER_DOWN: {
                target: "dragging",
              },
              POINTER_DOWN: {
                target: "dragging",
              },
              BLUR: {
                target: "idle",
              },
            },
          },
        },
      },
    },
  },
  {},
);
