import { IPrimitive } from "./IPrimitive.js";
import { ISpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import { IReactiveValueType } from "./IReactiveValueType.js";

export type IArrayValueType<T> = 
  T extends IPrimitive | ISpecialCaseObject ? T :
  IReactiveValueType<T>
;
