import { ReactivePrimitive } from "./ReactivePrimitive.js";

export const computeFunction: {
  current: VoidFunction | undefined,
} = {
  current: undefined,
};

/**
 * Takes a callback and returns a new readonly `ReactivePrimitive` whose value is updated with the return value of the callback whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that computes the value
 */
export function computed<T> (
  callback: () => T,
): Readonly<ReactivePrimitive<T>> {
  computeFunction.current = fn;
  const reactor = new ReactivePrimitive(callback());
  computeFunction.current = undefined;

  function fn () {
    computeFunction.current = fn;
    reactor.value = callback();
    computeFunction.current = undefined;
  }

  return reactor;
}
