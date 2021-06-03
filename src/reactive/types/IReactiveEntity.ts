import type { ReadonlyReactiveArray, ReactivePrimitive } from "../../mod.ts";

export type TReactiveEntity<T> = (
  | ReactivePrimitive<T>
  | ReadonlyReactiveArray<T>
);
