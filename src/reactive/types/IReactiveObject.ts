import type { TReactiveObjectFlag } from "./IReactiveObjectFlag.js";
import type { TReactiveValueType } from "./IReactiveValueType.js";

export type TReactiveObject<T extends Record<string, unknown> | unknown> = (
  T extends Record<string, unknown>
  ? {
      [P in keyof T]: T[P] extends (() => void) ? T[P] : TReactiveValueType<T[P]>;
    } & TReactiveObjectFlag
  : TReactiveObjectFlag
);
