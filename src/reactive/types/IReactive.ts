import { ReactiveArray, ReactivePrimitive } from "../../mod.js";
import { IReactiveObject } from "./IReactiveObject.js";

export type IReactive<T> = (
  ReactiveArray<T> |
  ReactivePrimitive<T> |
  IReactiveObject<T>
);
