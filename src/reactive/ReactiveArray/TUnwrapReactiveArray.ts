import type { ReactiveArray } from "./_ReactiveArray.js";

export type TUnwrapReactiveArray<Input> = (
  Input extends Readonly<ReactiveArray<infer V>>
  ? V
  : Input
);
