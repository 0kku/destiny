import type { TReactivePropertiesFlag } from "./TReactivePropertiesFlag.js";
import type { TReactiveValueType } from "../types/TReactiveValueType.js";

export type TReactiveProperties<T extends Record<string, unknown> | unknown> = (
  {
    readonly [P in keyof T]: TReactiveValueType<T[P]>;
  } & TReactivePropertiesFlag
);
