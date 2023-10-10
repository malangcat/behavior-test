interface SliderVariant {
  
}

type SliderVariantMap = {
  [key in keyof SliderVariant]: Array<SliderVariant[key]>;
};

export type SliderVariantProps = Partial<SliderVariant>;

export type SliderSlotName = "root" | "control" | "track" | "range" | "thumb" | "markerGroup" | "marker" | "tick";

export const sliderVariantMap: SliderVariantMap;

export function slider(
  props: SliderVariantProps,
): Record<SliderSlotName, string>;