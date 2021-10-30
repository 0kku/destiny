import { Ref } from "../../../../componentLogic/Ref.js";
import { ReactiveValue } from "../../../../reactive/ReactiveValue/_ReactiveValue.js";
import { isObject } from "../../../../typeChecks/isObject.js";

/**
 * `destiny:ref` prop allows you to to give a `ReactiveValue` to
 * the templater, which will then store the created element into
 * it once render is complete.
 * 
 * Example usage:
 * ```js
 * const ref = new ReactiveValue;
 *
 * ref.pipe(element => {
 *   console.log(element.innerHTML); // "Hello!";
 * });
 *
 * html`
 *   <div destiny:ref=${ref}>Hello!</div>
 * `;
 * ```
 */
export function destinyRef (
  element: HTMLElement,
  value: unknown,
): void {
  if (!((value instanceof ReactiveValue) || (value instanceof Ref))) {
    throw new TypeError(`Attribute value for destiny:ref must be a ReactiveValue, but it was [${
      isObject(value)
      ? `${value.constructor.name} (Object)`
      : `${String(value)} (${typeof value})`
    }] in \n${element.outerHTML}`);
  }
  queueMicrotask(() => {
    value.value = element;
  });
}
