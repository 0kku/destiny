import { IArrayValueType } from "../types/IArrayValueType.js";
import { ReactiveArray } from "../../mod.js";
import { isReactive } from "../../typeChecks/isReactive.js";
import { isSpecialCaseObject } from "../reactiveObject/specialCaseObjects.js";
import { reactive } from "../reactive.js";
import { isObject } from "../../typeChecks/isObject.js";

/**
 * Converts a given array of values into a reactive value recursively if it's not to be treated as a primitive. I.E. `Array`s and most `Object`s will be converted, but primitive values will not. This is useful for `ReactiveArrays`, whose direct children are managed directly by the class itself, but whose deeply nested descendants need to be tracked separately.
 * @param items The items to be converted
 * @param parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function makeNonPrimitiveItemsReactive<InputType> (
  items: Array<InputType | IArrayValueType<InputType>>,
  parent: ReactiveArray<InputType>,
): IArrayValueType<InputType>[] {
  return items.map((v: unknown) => {
    return (
      // Without casting to unknown, TSC crashes. IDK why.
      isReactive(v) || !isObject(v as unknown) || isSpecialCaseObject(v)
      ? v
      : reactive(
          v,
          {parent},
        )
    ) as IArrayValueType<InputType>;
  });
}
