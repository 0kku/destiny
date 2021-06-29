
import { ReadonlyReactiveValue } from "../reactive/ReactiveValue/_ReadonlyReactiveValue.ts";
import { ReadonlyReactiveArray } from "../reactive/ReactiveArray/_ReadonlyReactiveArray.ts";
import { reactivePropertiesFlag } from "../reactive/reactiveProperties/reactivePropertiesFlag.ts";
import type { TReactive } from "../reactive/types/TReactive.ts";

/**
 * Checks if a given value is a reactive entity; I.E. an instance of `ReadonlyReactiveValue` or `ReadonlyReactiveArray`, or an object returned by `makeReactiveProperties()` which is flagged by the `reactivePropertiesFlag` symbol.
 * 
 * @param input The value to be checked
 */
export function isReactive (
  input: unknown,
): input is TReactive<unknown> {
  return [
    ReadonlyReactiveArray,
    ReadonlyReactiveValue,
  ].some(constr => input instanceof constr) || (
    !!input &&
    typeof input === "object" &&
    reactivePropertiesFlag in input!
  );
}
