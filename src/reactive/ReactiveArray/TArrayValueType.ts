import type { TSpecialCaseObject } from "../reactiveProperties/specialCaseObjects.ts";
import type { TReactiveValueType } from "../types/TReactiveValueType.ts";
import type { TPrimitive } from "../types/TPrimitive.ts";

export type TArrayValueType<T> = (
  T extends TPrimitive | TSpecialCaseObject ? T
    : TReactiveValueType<T>
);
