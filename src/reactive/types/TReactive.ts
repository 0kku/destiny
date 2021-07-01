import type { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.js";
import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.js";
import type { TReactiveProperties } from "../reactiveProperties/TReactiveProperties.js";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactiveValue<T>
  | TReactiveProperties<T>
);
