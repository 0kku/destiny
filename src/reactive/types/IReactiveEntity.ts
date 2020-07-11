import { ReactiveArray, ReactivePrimitive } from "../../mod.js";

export type IReactiveEntity<T> =
  ReactivePrimitive<T> |
  ReactiveArray<T>
;
