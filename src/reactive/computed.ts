import { composeTemplateString } from "../utils/composeTemplateString.ts";
import { ReactiveValue } from "./ReactiveValue/_ReactiveValue.ts";
import type { ReadonlyReactiveValue } from "./ReactiveValue/_ReadonlyReactiveValue.ts";

export let computedConsumer: {
  fn: VoidFunction,
  consumer: ReadonlyReactiveValue<any>,
} | undefined;

const hold = new WeakMap<ReactiveValue<any>, VoidFunction>();

/**
 * Takes a callback and returns a new `ReadonlyReactiveValue` whose value is updated with the return value of the callback whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that computes the value
 */
export function computed (
  callback: TemplateStringsArray,
  ...props: Array<unknown>
): ReadonlyReactiveValue<string>;
export function computed<T> (
  callback: () => T,
): ReadonlyReactiveValue<T>;
export function computed<T> (
  callback: (() => T) | TemplateStringsArray,
  ...props: Array<unknown>
): ReadonlyReactiveValue<string> | ReadonlyReactiveValue<T> {
  if ("raw" in callback) {
    return computed(() => composeTemplateString(callback, props));
  }
  const cb = callback;
  const consumer = new ReactiveValue<T>(undefined as unknown as T);
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
