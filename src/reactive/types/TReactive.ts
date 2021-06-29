import type { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.ts";
import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.ts";
import type { TMakeReactiveProperties } from "../reactiveProperties/TMakeReactiveProperties.ts";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactiveValue<T>
  | TMakeReactiveProperties<T>
);
