import { IterableWeakMap } from "../../utils/IterableWeakMap.ts";
import type { WeakMultiRef } from "../../utils/WeakMultiRef.ts";
import type { TReactiveValueCallback } from "./TReactiveValueCallback.ts";
import type { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.ts";

export const stronglyHeldDependencies = new Map<
  TReactiveValueCallback<any>,
  ReadonlyReactiveValue<any>
>();

export const weaklyHeldDependencies = new IterableWeakMap<
  WeakMultiRef,
  ReadonlyReactiveValue<any>
>();
