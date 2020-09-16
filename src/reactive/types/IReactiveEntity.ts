import type { ReactiveArray, ReactivePrimitive } from "../../mod.js";

export type TReactiveEntity<T> = (
  | ReactivePrimitive<T>
  | ReactiveArray<T>
);
