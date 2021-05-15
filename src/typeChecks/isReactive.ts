import { ReadonlyReactiveArray, ReadonlyReactivePrimitive } from "../mod.js";
import { reactiveObjectFlag } from "../reactive/reactiveObject/reactiveObjectFlag.js";
import type { TReactive } from "../reactive/types/IReactive.js";

/**
 * Checks if a given value is a reactive value; I.E. an instance of `ReadonlyReactivePrimitive` or `ReadonlyReactiveArray`, or a `reactiveObject` which is flagged by the `reacativeObjecetFlag` symbol.
 * 
 * @param input The value to be checked
 */
export function isReactive (
  input: unknown,
): input is TReactive<unknown> {
  return [
    ReadonlyReactiveArray,
    ReadonlyReactivePrimitive,
  ].some(constr => input instanceof constr) || (
    !!input &&
    typeof input === "object" &&
    reactiveObjectFlag in input!
  );
}
