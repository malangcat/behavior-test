import { ariaAttr, dataAttr, visuallyHiddenStyle } from "@zag-js/dom-utils";
import type { NormalizeProps, PropTypes } from "@zag-js/types";
import { InterpreterFrom, StateFrom } from "xstate";
import { dom } from "./checkbox.dom";
import { checkboxMachine } from "./checkbox.machine";
import { UserDefinedContext } from "./checkbox.types";

export function connect<T extends PropTypes>(
  state: StateFrom<typeof checkboxMachine>,
  send: InterpreterFrom<typeof checkboxMachine>["send"],
  normalize: NormalizeProps<T>,
) {
  const isSelected = state.matches("selected.yes");

  const isDisabled = state.context.disabled;
  const isReadOnly = state.context.readonly;
  const isIndeterminate = state.context.indeterminate;
  const isInteractive = !isDisabled && !isReadOnly;

  return {
    isSelected,
    isIndeterminate,
    setValue(selected: boolean) {
      send({ type: "SET_SELECTED", value: selected });
    },
    setContext(ctx: Partial<UserDefinedContext>) {
      send({ type: "SYNC_PUBLIC_CONTEXT", value: ctx });
    },

    rootProps: normalize.label({
      "data-part": "root",
      id: dom.getRootId(state.context),
      htmlFor: dom.getInputId(state.context),
      "data-indeterminate": dataAttr(isIndeterminate),
    }),

    labelProps: normalize.element({
      "data-part": "label",
      id: dom.getLabelId(state.context),
      "data-readonly": dataAttr(isReadOnly),
      "data-disabled": dataAttr(isDisabled),
      "data-selected": dataAttr(isSelected),
      "data-indeterminate": dataAttr(isIndeterminate),
      onPointerDown(event) {
        if (!isInteractive) return;
        event.preventDefault();
      },
    }),

    controlProps: normalize.element({
      "data-part": "control",
      id: dom.getControlId(state.context),
      "data-disabled": dataAttr(isDisabled),
      "data-indeterminate": dataAttr(isIndeterminate),
      "data-selected": dataAttr(isSelected),
      "data-readonly": dataAttr(isReadOnly),
      "aria-hidden": true,
    }),

    inputProps: normalize.input({
      "data-part": "input",
      id: dom.getInputId(state.context),
      type: "checkbox",
      checked: isSelected,
      disabled: isDisabled,
      "data-disabled": dataAttr(isDisabled),
      readOnly: isReadOnly,
      "aria-readonly": ariaAttr(isReadOnly),
      style: visuallyHiddenStyle,
      onChange() {
        send({ type: "TOGGLE" });
      },
    }),
  };
}
