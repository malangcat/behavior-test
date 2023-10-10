import type { Context as Ctx } from "./slider.types";

export const dom = {
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `slider:${ctx.id}`,
  getThumbId: (ctx: Ctx) => ctx.ids?.thumb ?? `slider:${ctx.id}:thumb`,
  getControlId: (ctx: Ctx) => ctx.ids?.control ?? `slider:${ctx.id}:control`,
  getHiddenInputId: (ctx: Ctx) =>
    ctx.ids?.hiddenInput ?? `slider:${ctx.id}:input`,
  getOutputId: (ctx: Ctx) => ctx.ids?.output ?? `slider:${ctx.id}:output`,
  getTrackId: (ctx: Ctx) => ctx.ids?.track ?? `slider:${ctx.id}track`,
  getRangeId: (ctx: Ctx) => ctx.ids?.track ?? `slider:${ctx.id}:range`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `slider:${ctx.id}:label`,
  getMarkerId: (ctx: Ctx, value: number) => `slider:${ctx.id}:marker:${value}`,

  getRootEl: (ctx: Ctx) => document.getElementById(dom.getRootId(ctx)),
  getThumbEl: (ctx: Ctx) => document.getElementById(dom.getThumbId(ctx)),
  getControlEl: (ctx: Ctx) => document.getElementById(dom.getControlId(ctx)),
  getHiddenInputEl: (ctx: Ctx) =>
    document.getElementById(dom.getHiddenInputId(ctx)) as HTMLInputElement,
};
