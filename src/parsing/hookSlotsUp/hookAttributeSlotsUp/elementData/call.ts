import { doOrBind } from "../doOrBind.js";
import type { TElementData } from "../TElementData.js";

/**
 * `call:<ElementMethod>` takes an array of arguments to be passed to
 * the method being called, or a single argument to be called with.
 * 
 * Note that like all namespaced attributes, input is not optional and
 * must be slotted with `${}` for performance reasons. To call something
 * without arguments, pass in an empty array.
 * 
 * Example usage:
 * 
 * ```html
 * <form call:requestSubmit=${[]}></form>
 * ```
 * 
 * @param argument.element element the attribute is on
 * @param argument.attributeName name of the attribute, without the namespace
 * @param argument.value the value that was slotted in
 */
export function call (
  methodCalls: TElementData["call"],
  element: HTMLElement,
): void {
  for (const [key, value] of methodCalls) {
    doOrBind(
      element,
      key,
      value,
      value => {
        if (typeof element[key as keyof typeof element] === "function") {
          if (Array.isArray(value)) {
            //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            element[key](...value);
          } else {
            //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            element[key](value);
          }
        }
      }
    );
  }
}
