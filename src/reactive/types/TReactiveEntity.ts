import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.js";
import type { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.js";

export type TReactiveEntity<T> = (
  | ReadonlyReactiveValue<T>
  | ReadonlyReactiveArray<T>
);
