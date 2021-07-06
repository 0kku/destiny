import { IterableWeakMap } from "../../utils/IterableWeakMap.ts";
import type { WeakMultiRef } from "../../utils/WeakMultiRef.ts";
import type { TArrayValueType } from "./TArrayValueType.ts";
import type { TReactiveArrayCallback } from "./TReactiveArrayCallback.ts";
import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.ts";

export const stronglyHeldDependencies = new Map<
  // deno-lint-ignore no-explicit-any
  TReactiveArrayCallback<TArrayValueType<any>>,
  // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
  ReadonlyReactiveArray<any>
>();

export const weaklyHeldDependencies = new IterableWeakMap<
  WeakMultiRef,
  // deno-lint-ignore no-explicit-any
  ReadonlyReactiveArray<any>
>();
