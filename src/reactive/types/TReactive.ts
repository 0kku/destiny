import type { ReadonlyReactiveArray, ReadonlyReactiveValue } from "../../mod.js";
import type { TMakeReactiveProperties } from "../reactiveProperties/TMakeReactiveProperties.js";

export type TReactive<T> = (
  | ReadonlyReactiveArray<T>
  | ReadonlyReactiveValue<T>
  | TMakeReactiveProperties<T>
);
