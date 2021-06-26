import { ReadonlyReactiveArray, ReadonlyReactiveValue } from "../mod.js";
import { reactivePropertiesFlag } from "../reactive/reactiveProperties/reactivePropertiesFlag.js";
import type { TReactive } from "../reactive/types/TReactive.js";

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
