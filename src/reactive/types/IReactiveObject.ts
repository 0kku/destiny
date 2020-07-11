import { IReactiveValueType } from "./IReactiveValueType.js";
import { IReactiveObjectFlag } from "./IReactiveObjectFlag.js";

export type IReactiveObject<T extends object | unknown> = 
  T extends object
  ? {
      [P in keyof T]: T[P] extends Function ? T[P] : IReactiveValueType<T[P]>;
    } & IReactiveObjectFlag
  : IReactiveObjectFlag
;
