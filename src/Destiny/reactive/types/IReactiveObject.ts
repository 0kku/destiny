import { IReactiveValueType } from "./IReactiveRecursive.js";

export type IReactiveObject<T extends object> = {
  [P in keyof T]: IReactiveValueType<T[P]>;
};
