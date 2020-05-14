import { IReactive } from "../reactive/types/IReactive.js";
import { ReactiveArray, ReactivePrimitive } from "../mod.js";

/**
 * Checks if a given value is a reactive value; I.E. an instance of ReactivePrimitive or ReactiveArray.
 * @param input The value to be checked
 */
export function isReactive (
  input: unknown,
): input is IReactive<unknown> {
  return [
    ReactiveArray,
    ReactivePrimitive,
  ].some(constr => input instanceof constr);
}
