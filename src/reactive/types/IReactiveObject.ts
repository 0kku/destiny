import { TReactiveValueType } from "./IReactiveValueType.js";
import { TReactiveObjectFlag } from "./IReactiveObjectFlag.js";

export type TReactiveObject<T extends Record<string, unknown> | unknown> = (
  T extends Record<string, unknown>
  ? {
      [P in keyof T]: T[P] extends (() => void) ? T[P] : TReactiveValueType<T[P]>;
    } & TReactiveObjectFlag
  : TReactiveObjectFlag
);
