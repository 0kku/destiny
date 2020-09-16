import type { ReactiveArray, ReactivePrimitive } from "../../mod.js";
import type { TReactiveObject } from "./IReactiveObject.js";

export type TReactive<T> = (
  | ReactiveArray<T>
  | ReactivePrimitive<T>
  | TReactiveObject<T>
);
