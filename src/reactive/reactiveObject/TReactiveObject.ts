import type { TReactiveObjectFlag } from "./TReactiveObjectFlag.js";
import type { TReactiveValueType } from "../types/TReactiveValueType.js";

export type TReactiveObject<T extends Record<string, unknown> | unknown> = (
  {
    readonly [P in keyof T]: TReactiveValueType<T[P]>;
  } & TReactiveObjectFlag
);
