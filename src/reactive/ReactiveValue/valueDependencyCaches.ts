import { IterableWeakMap } from "../../utils/IterableWeakMap.js";
import type { WeakMultiRef } from "../../utils/WeakMultiRef.js";
import type { TReactiveValueCallback } from "./TReactiveValueCallback.js";
import type { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.js";

export const stronglyHeldDependencies = new Map<
  TReactiveValueCallback<any>,
  ReadonlyReactiveValue<any>
>();

export const weaklyHeldDependencies = new IterableWeakMap<
  WeakMultiRef,
  ReadonlyReactiveValue<any>
>();
