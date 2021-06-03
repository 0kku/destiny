import { composeTemplateString } from "../utils/composeTemplateString.ts";
import { ReactivePrimitive, ReadonlyReactivePrimitive } from "./ReactivePrimitive.ts";

export let computedConsumer: {
  fn: VoidFunction,
  consumer: ReadonlyReactivePrimitive<any>,
} | undefined;

const hold = new WeakMap<ReactivePrimitive<any>, VoidFunction>();

/**
 * Takes a callback and returns a new readonly `ReactivePrimitive` whose value is updated with the return value of the callback whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that computes the value
 */
export function computed (
  callback: TemplateStringsArray,
  ...props: Array<unknown>
): ReadonlyReactivePrimitive<string>;
export function computed<T> (
  callback: () => T,
): ReadonlyReactivePrimitive<T>;
export function computed<T> (
  callback: (() => T) | TemplateStringsArray,
  ...props: Array<unknown>
): ReadonlyReactivePrimitive<string> | ReadonlyReactivePrimitive<T> {
  if ("raw" in callback) {
    return computed(() => composeTemplateString(callback, props));
  }
  const cb = callback;
  const consumer = new ReactivePrimitive<T>(undefined as unknown as T);
  fn();

  function fn () {
    computedConsumer = {fn, consumer};
    const newValue = cb();
    computedConsumer = undefined;
    consumer.value = newValue;
  }

  hold.set(consumer, fn);

  return consumer.readonly;
}
