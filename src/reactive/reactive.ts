import { ReactiveArray, ReactivePrimitive, reactiveObject } from "../mod.js";
import { isObject } from "../typeChecks/isObject.js";
import { IReactiveValueType } from "./types/IReactiveRecursive.js";
import { IReactive } from "./types/IReactive.js";
import { isSpecialCaseObject } from "./reactiveObject/specialCaseObjects.js";
import { isReactive } from "../typeChecks/isReactive.js";
import { observe, IObjectObserverCallback, forceUpdate } from "./reactiveObject/reactiveObject.js";
import { isPrimitive } from "../typeChecks/isPrimitive.js";

/**
 * A polymorphic convenience function that will convert any value into a reactive value recursively. `Array`s are converted into `ReactiveArray`s. Most `Object`s get their keys converted into reactive items using the same algorithm (see `reactiveObject.js` for more details). Other values are converted into `ReactivePrimitive`s.
 * 
 * @param initialValue The value to be made reactive
 * @param options.fallback A fallback value to be displayed when the initial value is a pending `Promise`
 * @param options.parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T extends Promise<any>> (
  initialValue: T,
  options: {
    fallback: T,
    parent?: IReactive<any>,
  },
): ReactivePrimitive<T extends Promise<infer V> ? V : never>;
function reactive<T> (
  initialValue: T,
  options?: {
    parent?: IReactive<any>,
  },
): IReactiveValueType<T>;
function reactive<T> (
  initialValue: T,
  options: {
    fallback?: T,
    parent?: IReactive<any>,
  } = {},
) {
  if (isReactive(initialValue)) {
    return initialValue;
  }

  let reactiveEntity: IReactive<unknown>;
  
  if (initialValue instanceof Array) {
    reactiveEntity = new ReactiveArray(...initialValue);
  } else if (initialValue instanceof Promise) {
    reactiveEntity = new ReactivePrimitive(options?.fallback);
    initialValue.then(value => (reactiveEntity as ReactivePrimitive<unknown>).value = value);
  // } else if (isSpecialCaseObject(initialValue)) {
  //   reactiveEntity = new ReactivePrimitive(initialValue);
  } else if (isObject(initialValue)) {
    reactiveEntity = reactiveObject(initialValue);
  } else {
    reactiveEntity = new ReactivePrimitive(initialValue);
  }

  const {parent} = options;
  if (parent) {
    observe(
      reactiveEntity,
      () => forceUpdate(parent),
    );
  }

  return reactiveEntity as IReactive<unknown>;
}

export {reactive};
