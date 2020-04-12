import { ReactiveArray, ReactivePrimitive } from "../../_Destiny.js";
import { IReactiveObject } from "./IReactiveObject";
import { primitive } from "./primitive.js";
import { ISpecialCaseObject } from "../specialCaseObjects.js";
import { IReactive } from "./IReactive.js";

// export type IReactiveRecursive<T> = 
//   T extends object ? IReactiveObject<T> :
//   T extends Array<any> ? ReactiveArray<T[keyof T]>:
//   T extends boolean ? ReactivePrimitive<boolean> :
//   ReactivePrimitive<T>
// ;

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