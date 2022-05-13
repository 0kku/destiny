import type { TReactiveValueCallback } from "./TReactiveValueCallback.ts";

export type TReactiveValueUpdaterOptions<T> = {
  noUpdate: ReadonlyArray<TReactiveValueCallback<T>>,
  force: boolean,
};
