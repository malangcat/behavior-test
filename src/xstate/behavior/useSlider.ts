import { useMachine } from "@xstate/react";
import { normalizeProps } from "@zag-js/react";
import { connect } from "./slider.connect";
import { sliderMachine } from "./slider.machine";
import { useEffect, useId, useRef } from "react";
import { UserDefinedContext } from "./slider.types";

export interface UseSliderProps extends Omit<UserDefinedContext, "id"> {
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export function useSlider(props: UseSliderProps) {
  const id = useId();
  const [state, send] = useMachine(() =>
    sliderMachine({
      id,
      dir: "ltr",
      isDisabled: false,
      isReadOnly: false,
      maxValue: 100,
      minValue: 0,
      orientation: "horizontal",
      step: 1,
    }),
  );

  const api = connect(state, send, normalizeProps);

  useEffect(() => {
    api.setContext({
      dir: props.dir,
      isDisabled: props.isDisabled,
      isReadOnly: props.isReadOnly,
      maxValue: props.maxValue,
      minValue: props.minValue,
      step: props.step,
      orientation: props.orientation,
    });
  }, [
    props.dir,
    props.isDisabled,
    props.isReadOnly,
    props.maxValue,
    props.minValue,
    props.step,
    props.orientation,
  ]);

  const prevValue = useRef<number>(props.defaultValue ?? 0);

  useEffect(() => {
    if (props.value === undefined) return;
    if (props.value === prevValue.current) return;
    api.setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (api.value === prevValue.current) return;
    props.onChange?.(api.value);
    prevValue.current = api.value;
  }, [api.value]);

  return api;
}
