export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Rect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

export interface State {
  value: number;
  interaction: "idle" | "dragging" | "focused";
}

export type WritableState = Pick<State, "value">;

export interface Context {
  isDisabled: boolean;
  isReadOnly: boolean;
  orientation: "horizontal" | "vertical";
  dir: "ltr" | "rtl";
  minValue: number;
  maxValue: number;
  step: number;
}

export interface SliderStateProps
  extends Partial<WritableState>,
    Partial<Context> {}

export interface SliderProps extends SliderStateProps {
  onValueChange?: (value: number) => void;
  onInteractionChange?: (interaction: State["interaction"]) => void;
}
