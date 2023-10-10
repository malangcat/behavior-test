import { useMachine } from "@xstate/react";
import { normalizeProps } from "@zag-js/react";
import { useEffect, useId, useRef } from "react";
import { connect } from "./checkbox.connect";
import { checkboxMachine } from "./checkbox.machine";
import { UserDefinedContext } from "./checkbox.types";

interface CheckboxProps extends Omit<UserDefinedContext, "id"> {
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function useCheckbox(props: CheckboxProps) {
  const id = useId();
  const [state, send] = useMachine(() => checkboxMachine({ id }));

  const api = connect(state, send, normalizeProps);

  const prevValue = useRef<boolean>(props.defaultValue ?? false);

  useEffect(() => {
    api.setContext({
      disabled: props.disabled,
      readonly: props.readonly,
      indeterminate: props.indeterminate,
    });
  }, [props.disabled, props.readonly, props.indeterminate]);

  useEffect(() => {
    if (props.value === undefined) return;
    if (props.value === prevValue.current) return;
    api.setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (api.isSelected === prevValue.current) return;
    props.onChange?.(api.isSelected);
    prevValue.current = api.isSelected;
  }, [api.isSelected]);

  return api;
}
