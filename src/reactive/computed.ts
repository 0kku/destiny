import { ReactivePrimitive } from "./ReactivePrimitive.js";

export const computeFunction: {
  current: undefined | (() => void),
} = {
  current: undefined,
};

export function computed<T> (
  callback: () => T,
): ReactivePrimitive<T> {
  const reactor = new ReactivePrimitive<T | undefined>(undefined);

  const fn = () => {
    const previous = computeFunction.current;
    computeFunction.current = fn;

    reactor.value = callback();

    computeFunction.current = previous;
  };

  fn();

  return reactor as ReactivePrimitive<T>;
}