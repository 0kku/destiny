import type { ReadonlyReactiveValue } from "../ReactiveValue/ReactiveValue.js";
import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.js";
import type { TMakeReactiveProperties } from "../reactiveProperties/TMakeReactiveProperties.js";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactiveValue<T>
  | TMakeReactiveProperties<T>
);
