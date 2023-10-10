import { assign, createMachine } from "xstate";
import { Context, Point, UserDefinedContext } from "./slider.types";
import { compact, getValueFromPoint } from "./slider.utils";
import { dom } from "./slider.dom";

export function sliderMachine(ctx: UserDefinedContext) {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QGMAWZkGsBGB7AHgMQDKAogCoD6AagIIAyAqqQNoAMAuoqAA66wBLAC4DcAO24h8iAMwAOAGwA6AOwAWAJwyArACYAjPoUKZuttoA0IAJ6J9bFUpnyV27TI1y2uvWoC+flZoGDgEJACaAHIAwpQACowAQvQAkrHRAPKR5KQAGuTsXEggfIIi4pLSCM7KGhoKZjL6BhoqGvpWtgjNAUHoWHj4SgIQADZghHEZKdmkAEqUACIZAOqRhZKlwqISxVX6atpK2nLaDjX6J6YynYi6KsqKaipyGprPurpyvSDBAwTDMYTcgACUYAFlEvFprMFss1htiltyrtQPtDsdTucZApLnJrrdqipdEpGto1GpXvdKT8-qEhiNxoQAGIZaKMYiI3j8bYVPZ2DEnM4qC5XXQ3GyIPRsJQaNxsXFuA6tfyBX79elKCAAJwAhlAoAIxFBJjCcgtwRlqKxOJseSjKogFBoSTI1LjnM4VPocQpCWp7LL9Bo2BTg8HQ6daRrBkoAGa4ZAAV1gkFNM3NS1W61tSPtO0dCDOaiUBxkbEMDweijk-pdSgUcgDnwO2nq9WjIVjCeTqYghGSjDmXJK+b5aLur1UejklzddTqun9KhldQ8DlDZ3JOICarEuAgcEkdMGdrKBf5CAAtB1Jd0pwoVK57G0FOZI53-gygWfeaipIgzz+o+ShyC8LxqKGpjiiKn6ajq+qGsav4OpexIymwbB1HIZgrnUxKEtohiktoT51Cca4VnB3aJimkAoReE7VO0Ti4QGhg4s8EpdERRxviuOH1KRxL6LufhAA */
      id: "checkbox",
      tsTypes: {} as import("./slider.machine.typegen").Typegen0,
      schema: {} as {
        context: Context;
        events:
          | { type: "SET_VALUE"; value: number }
          | { type: "SYNC_PUBLIC_CONTEXT"; value: Partial<UserDefinedContext> }
          | { type: "THUMB_POINTER_DOWN" }
          | { type: "POINTER_DOWN"; point: Point }
          | { type: "POINTER_MOVE"; point: Point }
          | { type: "POINTER_UP" }
          | { type: "BLUR" }
          | { type: "FOCUS" }
          | { type: "ARROW_LEFT" }
          | { type: "ARROW_RIGHT" };
      },

      context: {
        ...ctx,
        value: 0,
        controlRect: null,
        dir: "ltr",
        orientation: "horizontal",
        minValue: 0,
        maxValue: 100,
        step: 1,
        isDisabled: false,
        isReadOnly: false,
      },

      on: {
        SET_VALUE: {
          actions: assign((_, event) => {
            return {
              value: event.value,
            };
          }),
        },
        SYNC_PUBLIC_CONTEXT: {
          actions: assign((_, event) => {
            return compact(event.value);
          }),
        },
      },

      initial: "idle",

      states: {
        idle: {
          on: {
            POINTER_DOWN: {
              cond: "isInteractive",
              actions: ["setPointerValue"],
              target: "dragging",
            },
            THUMB_POINTER_DOWN: {
              cond: "isInteractive",
              target: "dragging",
            },
            FOCUS: {
              cond: "isInteractive",
              target: "focused",
            },
          },
        },
        dragging: {
          on: {
            POINTER_MOVE: {
              actions: ["setPointerValue"],
            },
            POINTER_UP: {
              target: "idle",
              actions: ["deleteRectCache"],
            },
          },
        },
        focused: {
          on: {
            POINTER_DOWN: {
              cond: "isInteractive",
              actions: ["setPointerValue"],
              target: "dragging",
            },
            BLUR: {
              target: "idle",
            },
            ARROW_LEFT: {
              cond: "isInteractive",
              actions: ["decrement"],
            },
            ARROW_RIGHT: {
              cond: "isInteractive",
              actions: ["increment"],
            },
          },
        },
      },
    },
    {
      actions: {
        setPointerValue: assign((ctx, event) => {
          const controlRect =
            ctx.controlRect || dom.getControlEl(ctx)!.getBoundingClientRect();
          const value = getValueFromPoint(event.point, controlRect, ctx);
          return {
            value,
            controlRect,
          };
        }),
        deleteRectCache: assign(() => ({ controlRect: null })),
        increment: assign((context) => ({
          value: context.value + context.step,
        })),
        decrement: assign((context) => ({
          value: context.value - context.step,
        })),
      },
      guards: {
        isInteractive: (context) => !context.isDisabled && !context.isReadOnly,
      },
    },
  );
}
