import { primitive } from "./primitive";
import { ISpecialCaseObject } from "../reactiveObject/specialCaseObjects";
import { IReactiveValueType } from "./IReactiveRecursive";

export type IArrayValueType<T> = 
  T extends primitive | ISpecialCaseObject ? T :
  IReactiveValueType<T>
;
