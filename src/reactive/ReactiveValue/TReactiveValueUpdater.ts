import type { TReactiveValueUpdaterOptions } from "./TReactiveValueUpdaterOptions.js";

export type TReactiveValueUpdater<T> = (
  value: T,
  options?: Partial<TReactiveValueUpdaterOptions<T>>,
) => void;
