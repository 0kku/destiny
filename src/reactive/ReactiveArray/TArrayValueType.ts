import type { TSpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import type { TReactiveValueType } from "../types/TReactiveValueType.js";
import type { TPrimitive } from "../../typeChecks/TPrimitive.js";

export type TArrayValueType<T> = (
  T extends TPrimitive | TSpecialCaseObject
  ? T
  : TReactiveValueType<T>
);
