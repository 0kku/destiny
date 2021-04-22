import { composeTemplateString } from "../utils/composeTemplateString.js";
import { ReactivePrimitive } from "./ReactivePrimitive.js";

export let computeFunction: VoidFunction | undefined;

/**
 * Takes a callback and returns a new readonly `ReactivePrimitive` whose value is updated with the return value of the callback whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that computes the value
 */
export function computed (
  callback: TemplateStringsArray,
  ...props: Array<unknown>
): Readonly<ReactivePrimitive<string>>;
export function computed<T> (
  callback: () => T,
): Readonly<ReactivePrimitive<T>>;
export function computed<T> (
  callback: (() => T) | TemplateStringsArray,
  ...props: Array<unknown>
): Readonly<ReactivePrimitive<string>> | Readonly<ReactivePrimitive<T>> {
  if ("raw" in callback) {
    return computed(() => composeTemplateString(callback, props));
  }
  const cb = callback;
  computeFunction = fn;
  const reactor = new ReactivePrimitive(cb());
  computeFunction = undefined;

  function fn () {
    computeFunction = fn;
    const newValue = cb();
    computeFunction = undefined;
    reactor.value = newValue;
  }

  return reactor;
}
