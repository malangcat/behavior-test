// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    decrement: "ARROW_LEFT";
    deleteRectCache: "POINTER_UP";
    increment: "ARROW_RIGHT";
    setPointerValue: "POINTER_DOWN" | "POINTER_MOVE";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isInteractive:
      | "ARROW_LEFT"
      | "ARROW_RIGHT"
      | "FOCUS"
      | "POINTER_DOWN"
      | "THUMB_POINTER_DOWN";
  };
  eventsCausingServices: {};
  matchesStates: "dragging" | "focused" | "idle";
  tags: never;
}
