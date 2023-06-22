import { ReactiveValue } from "./ReactiveValue/_ReactiveValue.js";
import { ReactiveArray } from "./ReactiveArray/_ReactiveArray.js";
import { reactiveProperties } from "./reactiveProperties/_reactiveProperties.js";
import { isSpecialCaseObject } from "./reactiveProperties/specialCaseObjects.js";
import { isReactive } from "../typeChecks/isReactive.js";
import { isObject } from "../typeChecks/isObject.js";
import type { TReactiveValueType } from "./types/TReactiveValueType.js";
import type { TReactiveEntity } from "./types/TReactiveEntity.js";
import type { ReadonlyReactiveArray } from "./ReactiveArray/_ReadonlyReactiveArray.js";

/**
 * Converts the input value into a reactive entity recursively. `Array`s are converted into `ReactiveArray`s. `Object`s whose prototype is `Object` get their keys converted into reactive items by calling `reactive()` on each. Other values are converted into `ReactiveValue`s.
 * 
 * Example usage:
 * ```ts
 * const item = reactive("foo"); // ReactiveValue<string>
 * const arr = reactive([1, 2, 3]); // ReactiveArray<number>
 * const obj = reactive({foo: 42, bar: [1, 2, 3]}); // { foo: ReactiveValue<number>, bar: ReactiveArray<number> }
 * ```
 * 
 * @param initialValue The value to be made reactive
 * @param options.parent Another reactive entity to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T, K = unknown> (
  initialValue: T,
  options?: {
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K> | undefined,
  },
): TReactiveValueType<T>;
/**
 * When no arguments are passed, `ReactiveValue<T | undefined>` is returned, with the initial value `undefined`. Set the generic parameter to avoid it becoming `unknown`. Pass in at least one argument as the initial value to avoid it becoming potentially undefined.  
 * 
 * Example usage: 
 * ```ts
 * const item = reactive<string>();
 * 
 * item.value = "foo";
 * ```
 */
function reactive<T> (): ReactiveValue<T | undefined>;
/**
 * When a `Promise` is provided as the first argument, a new `ReactiveValue` is returned. The initial value is set to `options.fallback` or `undefined` if not provided. Note that even if the Promise yields an array or a POJO object, the resulting value is merely assigned as the value of the ReactiveValue, and it won't convert to a ReactiveArray or anything of the like.
 * 
 * Example usage: 
 * ```ts
 * const item = reactive(
 *  fetch(url)
 *    .then(r => r.text())
 *    .catch(() => "Error loading resource"),
 *  { fallback: "Loading…" },
 * ); // ReactiveValue<string>
 * ```
 * 
 * @param promise A Promise whose eventual value will be assigned as the value of the resulting ReactiveValue when resolved.
 * @param options.fallback A fallback value to be displayed when the initial value is pending
 * @param options.parent Another reactive entity to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T, V = T, K = unknown> (
  promise: Promise<T>,
  options: {
    fallback?: V,
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K> | undefined,
  },
): ReactiveValue<T | V>;
/**
 * A polymorphic convenience function that will convert any value into a reactive entity recursively. `Array`s are converted into `ReactiveArray`s. `Object`s whose prototype is `Object` get their keys converted into reactive items using the same algorithm `ReactiveArray`s use (see `reactiveProperties.ts` for more details). Other values are converted into `ReactiveValue`s.
 * 
 * @param initialValue The value to be made reactive
 * @param options.fallback A fallback value to be displayed when the initial value is a pending `Promise`
 * @param options.parent Another reactive entity to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T, K = unknown> (
  initialValue: T | undefined = undefined,
  options: {
    fallback?: T,
    parent?: ReactiveValue<K> | ReadonlyReactiveArray<K> | undefined,
  } = {},
): unknown {
  if (isReactive(initialValue)) {
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
      // objects passed to reactiveProperties don't get callbacks bound to them: the callbacks are attached to each field separately.
      return reactiveProperties(initialValue, parent);
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
