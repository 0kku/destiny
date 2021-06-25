import type { ReadonlyReactiveArray, ReadonlyReactiveValue } from "../../mod.js";

export type TReactiveEntity<T> = (
  | ReadonlyReactiveValue<T>
  | ReadonlyReactiveArray<T>
);
