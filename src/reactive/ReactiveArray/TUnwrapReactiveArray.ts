import type { ReadonlyReactiveArray } from "./_ReactiveArray.js";

export type TUnwrapReactiveArray<Input> = (
  Input extends ReadonlyReactiveArray<infer V>
  ? V
  : Input
);
