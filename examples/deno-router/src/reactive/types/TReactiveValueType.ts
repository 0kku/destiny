import type { ReactiveArray } from "../ReactiveArray/_ReactiveArray.ts";
import type { TSpecialCaseObject } from "../reactiveProperties/specialCaseObjects.ts";
import type { TReactiveProperties } from "../reactiveProperties/TReactiveProperties.ts";
import type { ReactiveValue } from "../ReactiveValue/_ReactiveValue.ts";
import type { TReactive } from "./TReactive.ts";

export type TReactiveValueType<T> = (
  T extends TReactive<unknown> ? T :
  T extends TSpecialCaseObject ? ReactiveValue<T> :
  T extends Promise<infer V> ? ReactiveValue<V | undefined> :
  T extends ReadonlyArray<infer V> ? ReactiveArray<V> :
  T extends Readonly<Record<string, unknown>> ? TReactiveProperties<T> :
  T extends boolean ? ReactiveValue<boolean> :
  ReactiveValue<T>
);
