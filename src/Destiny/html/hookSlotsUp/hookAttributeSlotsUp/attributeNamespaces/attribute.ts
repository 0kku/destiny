import { IValueProps } from "../../_hookSlotsUp.js";
import { stringifyValue } from "../../stringifyValue.js";

/**
 * Handler for normal non-namespaced attributes. Behaves like normal HTML.
 * 
 * Example usage: 
 * 
 *    <div style="color: red;">I'm red!</div>
 *    <!-- adds a style attribute to the element like you'd expect. -->
 */
export function attribute (
  {
    element,
    attributeName,
    valueStart,
    valueSlot,
    valueEnd,
  }: IValueProps,
) {
  element.setAttribute(
    attributeName,
    `${valueStart}${stringifyValue(valueSlot)}${valueEnd}`,
  );
}
