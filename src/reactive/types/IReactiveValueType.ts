import { ReactiveArray, ReactivePrimitive } from "../../mod.js";
import { TReactiveObject } from "./IReactiveObject.js";
import { TSpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import { TReactive } from "./IReactive.js";

export type TReactiveValueType<T> = (
  T extends TReactive<any> ? T :
  T extends TSpecialCaseObject ? ReactivePrimitive<T> :
  T extends Promise<infer V> ? ReactivePrimitive<V | undefined> :
  T extends Array<infer V> ? ReactiveArray<V> :
  T extends Record<string, unknown> ? TReactiveObject<T> :
  T extends boolean ? ReactivePrimitive<boolean> :
  ReactivePrimitive<T>
);
