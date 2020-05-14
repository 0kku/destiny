import { ReactiveArray, ReactivePrimitive } from "../../mod.js";
import { IReactiveObject } from "./IReactiveObject";
import { primitive } from "./primitive.js";
import { ISpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import { IReactive } from "./IReactive.js";

export type IArrayValueType<T> = 
  T extends primitive | ISpecialCaseObject ? T :
  IReactiveValueType<T>
;

export type IReactiveValueType<T> =
  T extends IReactive<any> ? T :
  T extends ISpecialCaseObject ? ReactivePrimitive<T> :
  T extends Promise<infer V> ? ReactivePrimitive<V | undefined> :
  T extends any[] ? ReactiveArray<T[number]> :
  T extends object ? IReactiveObject<T> :
  T extends boolean ? ReactivePrimitive<boolean> :
  ReactivePrimitive<T>
;
