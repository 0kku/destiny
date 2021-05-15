import type { ReadonlyReactiveArray, ReadonlyReactivePrimitive } from "../../mod.js";
import type { TReactiveObject } from "./IReactiveObject.js";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactivePrimitive<T>
  | TReactiveObject<T>
);
