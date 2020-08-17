import { TValueProps } from "../../_hookSlotsUp.js";
import { stringifyValue } from "../../stringifyValue.js";

/**
 * Handler for normal non-namespaced attributes. Behaves like normal HTML.
 * 
 * Example usage: 
 * ```html
 * <div style="color: red;">I'm red!</div>
 * <!-- adds a style attribute to the element like you'd expect. -->
 * ```
 */
export function attribute (
  {
    element,
    attributeName,
    valueStart,
    valueSlot,
    valueEnd,
  }: TValueProps,
): void {
  element.setAttribute(
    attributeName,
    `${valueStart}${stringifyValue(valueSlot)}${valueEnd}`,
  );
}
