import { doOrBind } from "../doOrBind.js";
import type { TElementData } from "../elementData/TElementData.js";

/**
 * `prop:<PropertyName>` takes in any property and assigns it to the element in JS.
 * 
 * For example, to assign a Date object to a date input (`input.valueAsDate = new Date`), you can do:
 * ```html
 * <input type=date prop:valueAsDate=${new Date} />
 * ```
 */
export function prop (
  props: TElementData["prop"],
  element: HTMLElement,
): void {
  for (const [key, value] of props) {
    doOrBind(
      element,
      key,
      value,
      //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS
      (item: unknown) => element[key] = item,
    );
  }
}
