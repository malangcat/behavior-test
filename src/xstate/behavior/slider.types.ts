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

type ElementIds = Partial<{
  root: string;
  thumb: string;
  control: string;
  track: string;
  range: string;
  label: string;
  output: string;
  hiddenInput: string;
}>;

export interface PublicContext {
  ids?: ElementIds;
  id: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  orientation: "horizontal" | "vertical";
  dir: "ltr" | "rtl";
  minValue: number;
  maxValue: number;
  step: number;
}

export interface PrivateContext {
  value: number;
  controlRect: Rect | null;
}

export interface Context extends PrivateContext, PublicContext {}

export interface UserDefinedContext extends Omit<Partial<PublicContext>, "id"> {
  id: string;
}
