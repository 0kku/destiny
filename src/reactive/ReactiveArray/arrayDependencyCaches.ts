import { IterableWeakMap } from "../../utils/IterableWeakMap.ts";
import type { WeakMultiRef } from "../../utils/WeakMultiRef.ts";
import type { TArrayValueType } from "./TArrayValueType.ts";
import type { TReactiveArrayCallback } from "./TReactiveArrayCallback.ts";
import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.ts";

export const stronglyHeldDependencies = new Map<
  TReactiveArrayCallback<TArrayValueType<any>>,
  ReadonlyReactiveArray<any>
>();

export const weaklyHeldDependencies = new IterableWeakMap<
  WeakMultiRef,
  ReadonlyReactiveArray<any>
>();
