/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { TValueProps } from "../../_hookSlotsUp.js";

/**
 * `call:<ElementMethod>` takes an array of arguments to be passed to
 * the method being called, or a single argument to be called with.
 * 
 * Note that method names need to use kebab-case instead of camelCase
 * because HTML is case-insensitive. The library automatically converts
 * kebab-cased function names into camelCase. For example, to call 
 * "requestSubmit", call "request-submit".
 * 
 * Note that like all namespaced attributes, input is not optional and
 * must be slotted with `${}` for performance reasons. To call something
 * without arguments, pass in an empty array.
 * 
 * Example usage:
 * 
 * ```html
 * <form call:request-submit=${[]}></form>
 * ```
 * 
 * @param argument.element element the attribute is on
 * @param argument.attributeName name of the attribute, without the namespace
 * @param argument.value the value that was slotted in
 */
export const call = (
  {
    element,
    attributeName,
    valueSlot,
  }: TValueProps,
): void => {
  if (Array.isArray(valueSlot)) {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element[attributeName](...valueSlot);
  } else {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element[attributeName](valueSlot);
  }
};
