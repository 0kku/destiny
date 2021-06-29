import type { TReactiveValueCallback } from "./TReactiveValueCallback.js";

export type TReactiveValueUpdaterOptions<T> = {
  noUpdate: ReadonlyArray<TReactiveValueCallback<T>>,
  force: boolean,
};
