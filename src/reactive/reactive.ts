import { ReactiveValue } from "./ReactiveValue/_ReactiveValue.ts";
import { ReactiveArray } from "./ReactiveArray/_ReactiveArray.ts";
import { makeReactiveProperties } from "./reactiveProperties/makeReactiveProperties.ts";
import { isSpecialCaseObject } from "./reactiveProperties/specialCaseObjects.ts";
import { isReactive } from "../typeChecks/isReactive.ts";
import { isObject } from "../typeChecks/isObject.ts";
import type { TReactiveValueType } from "./types/TReactiveValueType.ts";
import type { TReactiveEntity } from "./types/TReactiveEntity.ts";
import type { TReactive } from "./types/TReactive.ts";
import type { ReadonlyReactiveArray } from "./ReactiveArray/_ReadonlyReactiveArray.ts";

/**
 * A polymorphic convenience function that will convert any value into a reactive entity recursively. `Array`s are converted into `ReactiveArray`s. `Object`s whose prototype is `Object` get their keys converted into reactive items using the same algorithm `ReactiveArray`s use (see `makeReactiveProperties.ts` for more details). Other values are converted into `ReactiveValue`s.
 * 
 * @param initialValue The value to be made reactive
 * @param options.fallback A fallback value to be displayed when the initial value is a pending `Promise`
 * @param options.parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T extends Promise<unknown>, K = unknown> (
  initialValue: T,
  options: {
    fallback: T extends Promise<infer V> ? V : never,
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K>,
  },
): ReactiveValue<T extends Promise<infer V> ? V : never>;
function reactive<T, K = unknown> (
  initialValue: T,
  options?: {
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K>,
  },
): TReactiveValueType<T>;
function reactive<K = unknown> (
  initialValue: unknown,
  options?: {
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K>,
  },
): TReactive<unknown>;
function reactive<T, K = unknown> (
  initialValue: T,
  options: {
    fallback?: T,
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K>,
  } = {},
): unknown {
  if (isReactive(initialValue as unknown)) {
    return initialValue;
  }
  
  const {parent} = options;
  let ref: TReactiveEntity<unknown>;

  if (isObject(initialValue)) {
    if (Array.isArray(initialValue)) {
      ref = new ReactiveArray(...initialValue);
    } else if (initialValue instanceof Promise) {
      const temp = new ReactiveValue(options.fallback);
      void initialValue.then(value => temp.value = value as T);
      ref = temp as ReactiveValue<unknown>;
    } else if (isSpecialCaseObject(initialValue)) {
      ref = new ReactiveValue<unknown>(initialValue);
    } else {
      // objects passed to makeReactiveProperties don't get callbacks bound to them: the callbacks are attached to each field separately.
      return makeReactiveProperties(initialValue, options.parent);
    }
  } else {
    ref = new ReactiveValue<unknown>(initialValue);
  }

  if (parent) {
    ref.bind(
      () => parent.update(),
    );
  }

  return ref;
}

export {reactive};
