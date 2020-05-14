import { reactive } from "../reactive.js";
import { IReactive } from "../types/IReactive.js";
import { IReactiveObject } from "../types/IReactiveObject.js";

/**
 * Takes an object, and turns each of its keys reactive recursively: `Object` values are run through this same function, `Array` values are converted to `ReactiveArray`s and other values are turned into `ReactivePrimitive`s. Some object types are except from this, as specified in `specialCaseObjects`, however, a better solution needs to be found in due time.
 * @param input The object whose keys are to be made reactive
 * @param parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function reactiveObject<T extends object> (
  input: T,
  parent?: IReactive<unknown>,
): IReactiveObject<T> {
  return Object.fromEntries(
    Object
    .entries(input)
    .map(([k, v]) => [
      k,
      reactive(
        v,
        {parent}
      ),
    ]),
  ) as IReactiveObject<T>;
}
