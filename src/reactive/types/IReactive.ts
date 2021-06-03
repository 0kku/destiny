import type { ReadonlyReactiveArray, ReadonlyReactivePrimitive } from "../../mod.ts";
import type { TReactiveObject } from "./IReactiveObject.ts";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactivePrimitive<T>
  | TReactiveObject<T>
);
