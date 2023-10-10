import { defineDomHelpers } from "@zag-js/dom-utils";
import { ContextFrom } from "xstate";
import { checkboxMachine } from "./checkbox.machine";

type Ctx = ContextFrom<typeof checkboxMachine>;

export const dom = defineDomHelpers({
  getRootId: (ctx: Ctx) => `checkbox:${ctx.id}`,
  getLabelId: (ctx: Ctx) => `checkbox:${ctx.id}:label`,
  getControlId: (ctx: Ctx) => `checkbox:${ctx.id}:control`,
  getInputId: (ctx: Ctx) => `checkbox:${ctx.id}:input`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getInputEl: (ctx: Ctx) =>
    dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx)),
});
