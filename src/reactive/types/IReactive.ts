import type { ReactiveArray, ReadonlyReactivePrimitive } from "../../mod.js";
import type { TReactiveObject } from "./IReactiveObject.js";

export type TReactive<T> = (
  | ReactiveArray<T>
  | ReadonlyReactivePrimitive<T>
  | TReactiveObject<T>
);
