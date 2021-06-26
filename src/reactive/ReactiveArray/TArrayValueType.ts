import type { TSpecialCaseObject } from "../reactiveProperties/specialCaseObjects.js";
import type { TReactiveValueType } from "../types/TReactiveValueType.js";
import type { TPrimitive } from "../types/TPrimitive.js";

export type TArrayValueType<T> = (
  T extends TPrimitive | TSpecialCaseObject
  ? T
  : TReactiveValueType<T>
);
