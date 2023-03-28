import type { TReactiveValueUpdaterOptions } from "./TReactiveValueUpdaterOptions.ts";

export type TReactiveValueUpdater<T> = (
  value: T,
  options?: Partial<TReactiveValueUpdaterOptions<T>>,
) => void;
