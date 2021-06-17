import type { ReactiveArray, ReactiveValue } from "../../mod.js";
import type { TSpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import type { TReactiveObject } from "./IReactiveObject.js";
import type { TReactive } from "./IReactive.js";

export type TReactiveValueType<T> = (
  T extends TReactive<unknown> ? T :
  T extends TSpecialCaseObject ? ReactiveValue<T> :
  T extends Promise<infer V> ? ReactiveValue<V | undefined> :
  T extends Array<infer V> ? ReactiveArray<V> :
  T extends Record<string, unknown> ? TReactiveObject<T> :
  T extends boolean ? ReactiveValue<boolean> :
  ReactiveValue<T>
);
