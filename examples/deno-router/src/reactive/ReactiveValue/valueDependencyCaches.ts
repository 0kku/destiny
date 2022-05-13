import { IterableWeakMap } from "../../utils/IterableWeakMap.ts";
import type { WeakMultiRef } from "../../utils/WeakMultiRef.ts";
import type { TReactiveValueCallback } from "./TReactiveValueCallback.ts";
import type { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.ts";

export const stronglyHeldDependencies = new Map<
  // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
  TReactiveValueCallback<any>,
  // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
  ReadonlyReactiveValue<any>
>();

export const weaklyHeldDependencies = new IterableWeakMap<
  WeakMultiRef,
  // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
  ReadonlyReactiveValue<any>
>();
