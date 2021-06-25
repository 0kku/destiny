import type { ReadonlyReactiveArray, ReadonlyReactiveValue } from "../../mod.js";
import type { TReactiveObject } from "../reactiveObject/TReactiveObject.js";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactiveValue<T>
  | TReactiveObject<T>
);
