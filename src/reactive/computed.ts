import { ReactiveArray, type ReadonlyReactiveArray } from "../mod.js";
import { composeTemplateString } from "../utils/composeTemplateString.js";
import { WeakMultiRef } from "../utils/WeakMultiRef.js";
import { ReactiveValue } from "./ReactiveValue/_ReactiveValue.js";
import type { ReadonlyReactiveValue } from "./ReactiveValue/_ReadonlyReactiveValue.js";

export let computedConsumer: {
  fn: VoidFunction,
  consumer: ReadonlyReactiveValue<any> | ReadonlyReactiveArray<any>,
} | undefined;

const hold = new WeakMap<ReactiveValue<any> | ReactiveArray<any> | WeakMultiRef, VoidFunction>();

type TComputedOptions = {
  dependents?: ReadonlyArray<object>,
};

/**
 * Takes a callback and returns a new `ReadonlyReactiveValue` whose value is updated with the return value of the callback whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that computes the value
 */
export function computed<T> (
  callback: () => T,
  options?: TComputedOptions,
): ReadonlyReactiveValue<T>;
export function computed (
  callback: TemplateStringsArray,
  ...props: Array<unknown>
): ReadonlyReactiveValue<string>;
export function computed<T> (
  callback: (() => T) | TemplateStringsArray,
  ...props: Array<unknown> | [TComputedOptions]
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

  const [options] = props as [TComputedOptions?];
  if (options?.dependents?.length) {
    hold.set(new WeakMultiRef([consumer, ...options.dependents]), fn);
  } else {
    hold.set(consumer, fn);
  }

  return consumer.readonly;
}

/**
 * Takes a callback and returns a new `ReadonlyReactiveArray` whose items are replaced with the return values (i.e. an iterable of values such as an array) of the callback whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that computes the values
 */
export function computedArray<T> (
  callback: () => Iterable<T>,
  options?: TComputedOptions,
): ReadonlyReactiveArray<T> {
  const consumer = new ReactiveArray<T>();
  fn();

  function fn () {
    computedConsumer = {fn, consumer};
    const newValue = callback();
    computedConsumer = undefined;
    consumer.value = newValue;
  }

  if (options?.dependents?.length) {
    hold.set(new WeakMultiRef([consumer, ...options.dependents]), fn);
  } else {
    hold.set(consumer, fn);
  }

  return consumer.readonly;
}
