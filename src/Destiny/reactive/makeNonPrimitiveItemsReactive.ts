import { IArrayValueType } from "./types/IReactiveRecursive";
import { ReactiveArray } from "../_Destiny.js";
import { isReactive } from "../typeChecks/isReactive.js";
import { isPrimitive } from "../typeChecks/isPrimitive.js";
import { isSpecialCaseObject } from "./specialCaseObjects.js";
import { reactive } from "./reactive.js";

export function makeNonPrimitiveItemsReactive<InputType> (
  items: Array<InputType | IArrayValueType<InputType>>,
  parent: ReactiveArray<InputType>,
): IArrayValueType<InputType>[] {
  return items.map(v => {
    return (
      isReactive(v) || isPrimitive(v) || isSpecialCaseObject(v)
      ? v 
      : reactive(
          v,
          {parent},
        )
    ) as IArrayValueType<InputType>;
  });
}
