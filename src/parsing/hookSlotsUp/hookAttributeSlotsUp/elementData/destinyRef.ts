import { Ref } from "../../../../mod.ts";
import { isObject } from "../../../../typeChecks/isObject.ts";

/**
 * `destiny:ref` prop allows you to to give a `ReactivePrimitive` to
 * the templater, which will then store the created element into
 * it once render is complete.
 * 
 * Example usage:
 * ```js
 * const ref = new DestinyPrimitive;
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
  value: unknown,
  element: HTMLElement,
): void {
  if (!(value instanceof Ref)) {
    throw new TypeError(`Attribute value for destiny:ref must be a Ref, but it was [${
      isObject(value)
      ? `${value.constructor.name} (Object)`
      : `${String(value)} (${typeof value})`
    }] in \n${element.outerHTML}`);
  }
  queueMicrotask(() => {
    value.value = element;
  });
}
