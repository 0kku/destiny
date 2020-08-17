import { TPrimitive } from "./IPrimitive.js";
import { TSpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import { TReactiveValueType } from "./IReactiveValueType.js";

export type TArrayValueType<T> = (
  T extends TPrimitive | TSpecialCaseObject
  ? T
  : TReactiveValueType<T>
);
