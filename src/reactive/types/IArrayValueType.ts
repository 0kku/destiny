import type { TSpecialCaseObject } from "../reactiveObject/specialCaseObjects.ts";
import type { TReactiveValueType } from "./IReactiveValueType.ts";
import type { TPrimitive } from "./IPrimitive.ts";

export type TArrayValueType<T> = (
  T extends TPrimitive | TSpecialCaseObject
  ? T
  : TReactiveValueType<T>
);
