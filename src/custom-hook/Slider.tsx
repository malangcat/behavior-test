import type { Ref } from "react";
import React from "react";
import { SliderProps } from "./behavior/slider.types";
import { useSlider } from "./behavior/useSlider";
import { slider } from "../style/slider";

const Slider = (props: SliderProps, ref: Ref<HTMLDivElement>) => {
  const controlRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const api = useSlider(props, controlRef, thumbRef);
  const classNames = slider({});

  return (
    <div ref={ref} {...api.rootProps} className={classNames.root}>
      <div
        ref={controlRef}
        {...api.controlProps}
        className={classNames.control}
      >
        <div {...api.trackProps} className={classNames.track}>
          <div {...api.rangeProps} className={classNames.range} />
        </div>
        <div ref={thumbRef} {...api.thumbProps} className={classNames.thumb}>
          <input {...api.hiddenInputProps} />
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _Slider = React.forwardRef(Slider);
export { _Slider as Slider };
