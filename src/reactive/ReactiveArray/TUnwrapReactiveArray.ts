import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.ts";

export type TUnwrapReactiveArray<Input> = (
  Input extends ReadonlyReactiveArray<infer V> ? V
    : Input
);
