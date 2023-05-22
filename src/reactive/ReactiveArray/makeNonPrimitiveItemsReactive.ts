import { reactive } from "../reactive.js";
import { isSpecialCaseObject } from "../reactiveProperties/specialCaseObjects.js";
import { isReactive } from "../../typeChecks/isReactive.js";
import { isObject } from "../../typeChecks/isObject.js";
import type { TArrayValueType } from "./TArrayValueType.js";
import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";

/**
 * Converts a given array of values into a reactive entity recursively if it's not to be treated as a primitive. I.E. `Array`s and most `Object`s will be converted, but primitive values will not. This is useful for `ReactiveArrays`, whose direct children are managed directly by the class itself, but whose deeply nested descendants need to be tracked separately.
 * @param items The items to be converted
 * @param parent Another reactive entity to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function makeNonPrimitiveItemsReactive <InputType> (
  items: Array<InputType | TArrayValueType<InputType>>,
  parent: ReadonlyReactiveArray<InputType>,
): Array<TArrayValueType<InputType>> {
  const foo = items.map(
    (v: unknown) => makeNonPrimitiveItemReactive(v, parent as ReadonlyReactiveArray<unknown>)
  );
  return foo as Array<TArrayValueType<InputType>>; 
}

export function makeNonPrimitiveItemReactive <InputType> (
  item: InputType,
  parent: ReadonlyReactiveArray<unknown>,
): TArrayValueType<InputType> {
  return (
    isReactive(item) || !isObject(item) || isSpecialCaseObject(item)
    ? item
    : reactive<unknown>(
        item,
        {parent: parent},
      )
  ) as TArrayValueType<InputType>;
}
