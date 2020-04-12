import { IReactiveObject } from "./IReactiveObject";
import { ReactiveArray } from "../ReactiveArray";
import { primitive } from "./primitive";
import { ISpecialCaseObject } from "../specialCaseObjects";
import { IReactive } from "./IReactive";
import { IReactiveValueType } from "./IReactiveRecursive";

// export type IArrayValueType<T> = 
//   T extends primitive | ISpecialCaseObject | IReactive<any> ? T :
//   T extends DocumentFragment ? T :
//   T extends Array<any> ? ReactiveArray<T[number]> :
//   T extends object ? IReactiveObject<T> :
//   T
// ;
export type IArrayValueType<T> = 
  T extends primitive | ISpecialCaseObject ? T :
  IReactiveValueType<T>
;
