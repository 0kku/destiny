import type { ReactiveArray, ReactiveValue } from "../../mod.js";
import type { TSpecialCaseObject } from "../reactiveProperties/specialCaseObjects.js";
import type { TMakeReactiveProperties } from "../reactiveProperties/TMakeReactiveProperties.js";
import type { TReactive } from "./TReactive.js";

export type TReactiveValueType<T> = (
  T extends TReactive<unknown> ? T :
  T extends TSpecialCaseObject ? ReactiveValue<T> :
  T extends Promise<infer V> ? ReactiveValue<V | undefined> :
  T extends ReadonlyArray<infer V> ? ReactiveArray<V> :
  T extends Readonly<Record<string, unknown>> ? TMakeReactiveProperties<T> :
  T extends boolean ? ReactiveValue<boolean> :
  ReactiveValue<T>
);
