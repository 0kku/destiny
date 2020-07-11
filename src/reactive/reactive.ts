import { ReactiveArray, ReactivePrimitive, reactiveObject } from "../mod.js";
import { isObject } from "../typeChecks/isObject.js";
import { IReactiveValueType } from "./types/IReactiveValueType.js";
import { IReactive } from "./types/IReactive.js";
import { IReactiveEntity } from "./types/IReactiveEntity.js";
import { isSpecialCaseObject } from "./reactiveObject/specialCaseObjects.js";
import { isReactive } from "../typeChecks/isReactive.js";

/**
 * A polymorphic convenience function that will convert any value into a reactive value recursively. `Array`s are converted into `ReactiveArray`s. Most `Object`s get their keys converted into reactive items using the same algorithm (see `reactiveObject.ts` for more details). Other values are converted into `ReactivePrimitive`s.
 * 
 * @param initialValue The value to be made reactive
 * @param options.fallback A fallback value to be displayed when the initial value is a pending `Promise`
 * @param options.parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T extends Promise<any>> (
  initialValue: T,
  options: {
    fallback: T,
    parent?: ReactivePrimitive<any> | ReactiveArray<any>,
  },
): ReactivePrimitive<T extends Promise<infer V> ? V : never>;
function reactive<T> (
  initialValue: T,
  options?: {
    parent?: ReactivePrimitive<any> | ReactiveArray<any>,
  },
): IReactiveValueType<T>;
function reactive (
  initialValue: unknown,
  options?: {
    parent?: IReactiveEntity<any>,
  },
): IReactive<unknown>;
function reactive<T> (
  initialValue: T,
  options: {
    fallback?: T,
    parent?: ReactivePrimitive<any> | ReactiveArray<any>,
  } = {},
) {
  if (isReactive(initialValue as unknown)) {
    // console.log(initialValue, "was already reactive");
    return initialValue;
  }
  
  const {parent} = options;
  let ref: IReactiveEntity<unknown>;

  if (isObject(initialValue)) {
    if (Array.isArray(initialValue)) {
      ref = new ReactiveArray(...initialValue);
    } else if (initialValue instanceof Promise) {
      const temp = new ReactivePrimitive(options?.fallback);
      initialValue.then(value => temp.value = value);
      ref = temp as ReactivePrimitive<unknown>;
    } else if (isSpecialCaseObject(initialValue)) {
      ref = new ReactivePrimitive<unknown>(initialValue);
    } else {
      // reactiveObjects don't get callbacks bound to them: the callbacks are attached to each field separately.
      return reactiveObject(initialValue, options.parent);
    }
  } else {
    ref = new ReactivePrimitive<unknown>(initialValue);
  }

  if (parent) {
    ref.bind(() => parent.update());
  }

  return ref;
}

export {reactive};
