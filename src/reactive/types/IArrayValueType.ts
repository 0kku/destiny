import type { TSpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import type { TReactiveValueType } from "./IReactiveValueType.js";
import type { TPrimitive } from "./IPrimitive.js";

export type TArrayValueType<T> = (
  T extends TPrimitive | TSpecialCaseObject
  ? T
  : TReactiveValueType<T>
);
