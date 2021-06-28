import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.js";
import type { ReadonlyReactiveValue } from "../ReactiveValue/ReactiveValue.js";

export type TReactiveEntity<T> = (
  | ReadonlyReactiveValue<T>
  | ReadonlyReactiveArray<T>
);
