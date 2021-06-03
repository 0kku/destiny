import type { ReadonlyReactiveArray } from "./_ReactiveArray.ts";

export type TUnwrapReactiveArray<Input> = (
  Input extends ReadonlyReactiveArray<infer V>
  ? V
  : Input
);
