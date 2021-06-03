import type { TReactiveObjectFlag } from "./IReactiveObjectFlag.ts";
import type { TReactiveValueType } from "./IReactiveValueType.ts";

export type TReactiveObject<T extends Record<string, unknown> | unknown> = (
  {
    [P in keyof T]: TReactiveValueType<T[P]>;
  } & TReactiveObjectFlag
);
