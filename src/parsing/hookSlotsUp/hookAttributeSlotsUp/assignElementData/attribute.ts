import { doOrBind } from "../doOrBind.js";
import type { TElementData } from "../elementData/TElementData.js";

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
  attributes: TElementData["attribute"],
  element: HTMLElement,
): void {
  for (const [key, value] of attributes) {
    doOrBind(
      element,
      key,
      value,
      value => element.setAttribute(key, String(value)),
    );
  }
}
