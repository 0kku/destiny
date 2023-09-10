import { isObject } from "../../../../typeChecks/isObject.js";
import { describeType } from "../../../../utils/describeType.js";
import { deferredElements } from "../../../deferredElements.js";

/**
 * `destiny:ref` prop allows you to to give a `ReactiveValue` to
 * the templater, which will then store the created element into
 * it once render is complete.
 * 
 * Example usage:
 * ```js
 * const ref = new ReactiveValue;
 *
 * sideEffect(() => {
 *   if (!element.value) return;
 *   console.log(element.value.textContent); // "Hello!";
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
  if (!hasValueField(value)) {
    throw new TypeError(`Attribute value for destiny:ref must be an object that has a "value" field, but it was ${describeType(value)} in \n${element.outerHTML}`);
  }
  queueMicrotask(() => {
    value.value = element;
  });

  deferredElements.set(
    element,
    () => value.value = undefined,
  );
}

function hasValueField (
  input: unknown,
): input is { value: unknown } {
  return isObject(input) && "value" in input;
}
