import type { TReactiveObjectFlag } from "./IReactiveObjectFlag.js";
import type { TReactiveValueType } from "./IReactiveValueType.js";

export type TReactiveObject<T extends Record<string, unknown> | unknown> = (
  {
    [P in keyof T]: TReactiveValueType<T[P]>;
  } & TReactiveObjectFlag
);
