import type { ReadonlyReactiveArray, ReactiveValue } from "../../mod.js";

export type TReactiveEntity<T> = (
  | ReactiveValue<T>
  | ReadonlyReactiveArray<T>
);
