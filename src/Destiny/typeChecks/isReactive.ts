import { IReactive } from "../reactive/types/IReactive.js";
import { ReactiveArray, ReactivePrimitive } from "../_Destiny.js";

export function isReactive (
  input: unknown,
): input is IReactive<unknown> {
  return [
    ReactiveArray,
    ReactivePrimitive,
  ].some(constr => input instanceof constr);
}
