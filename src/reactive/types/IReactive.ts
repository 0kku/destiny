import { ReactiveArray, ReactivePrimitive } from "../../mod.js";
import { TReactiveObject } from "./IReactiveObject.js";

export type TReactive<T> = (
  | ReactiveArray<T>
  | ReactivePrimitive<T>
  | TReactiveObject<T>
);
