import { IterableWeakMap } from "../../utils/IterableWeakMap.js";
import type { WeakMultiRef } from "../../utils/WeakMultiRef.js";
import type { TArrayValueType } from "./TArrayValueType.js";
import type { TReactiveArrayCallback } from "./TReactiveArrayCallback.js";
import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";

export const stronglyHeldDependencies = new Map<
  TReactiveArrayCallback<TArrayValueType<any>>,
  ReadonlyReactiveArray<any>
>();

export const weaklyHeldDependencies = new IterableWeakMap<
  WeakMultiRef,
  ReadonlyReactiveArray<any>
>();
