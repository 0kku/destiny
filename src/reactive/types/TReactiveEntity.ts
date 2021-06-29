import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.ts";
import type { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.ts";

export type TReactiveEntity<T> = (
  | ReadonlyReactiveValue<T>
  | ReadonlyReactiveArray<T>
);
