import { doOrBind } from "../doOrBind.js";
import type { TElementData } from "../TElementData.js";

/**
 * `prop:<PropertyName>` takes in any property and assigns it to
 * the element in JS.
 * 
 * Note that property names need to use kebab-case because HTML
 * is case-insensitive. The library will automatically convert
 * properties to camelCase. For example, to assign a Date object
 * to a date input (`input.valueAsDate = new Date`), you can do:
 * ```html
 * <inpyt type=date prop:value-as-date=${new Date}>
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
