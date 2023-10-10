import * as React from "react";
import { useCheckbox } from "./useCheckbox";

const Checkbox: React.FC<
  React.PropsWithChildren<{
    value: boolean;
    onChange: (value: boolean) => void;
  }>
> = ({ value, onChange, children }) => {
  const api = useCheckbox({
    value,
    onChange,
  });

  return (
    <label {...api.rootProps}>
      <div {...api.controlProps}>
        {api.isIndeterminate ? "-" : api.isSelected && "Y"}
      </div>
      <span {...api.labelProps}>{children}</span>
      <input {...api.inputProps} />
    </label>
  );
};

export default Checkbox;
