import type { TReactivePropertiesFlag } from "./TReactivePropertiesFlag.ts";
import type { TReactiveValueType } from "../types/TReactiveValueType.ts";

export type TMakeReactiveProperties<T extends Record<string, unknown> | unknown> = (
  {
    readonly [P in keyof T]: TReactiveValueType<T[P]>;
  } & TReactivePropertiesFlag
);
