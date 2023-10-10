import { createClassName } from "./className.mjs";

const sliderSlotNames = [
  [
    "root",
    "slider__root"
  ],
  [
    "control",
    "slider__control"
  ],
  [
    "track",
    "slider__track"
  ],
  [
    "range",
    "slider__range"
  ],
  [
    "thumb",
    "slider__thumb"
  ],
  [
    "markerGroup",
    "slider__markerGroup"
  ],
  [
    "marker",
    "slider__marker"
  ],
  [
    "tick",
    "slider__tick"
  ]
];

const defaultVariant = {};

export const sliderVariantMap = {};

export const sliderVariantKeys = Object.keys(sliderVariantMap);

export function slider(props) {
  return Object.fromEntries(
    sliderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }),
      ];
    }),
  );
}