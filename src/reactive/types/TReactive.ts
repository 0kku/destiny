import type { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.ts";
import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.ts";
import type { TReactiveProperties } from "../reactiveProperties/TReactiveProperties.ts";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactiveValue<T>
  | TReactiveProperties<T>
);
