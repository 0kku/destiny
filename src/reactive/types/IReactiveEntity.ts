import type { ReadonlyReactiveArray, ReactivePrimitive } from "../../mod.js";

export type TReactiveEntity<T> = (
  | ReactivePrimitive<T>
  | ReadonlyReactiveArray<T>
);
