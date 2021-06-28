import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";

export type TUnwrapReactiveArray<Input> = (
  Input extends ReadonlyReactiveArray<infer V>
  ? V
  : Input
);
