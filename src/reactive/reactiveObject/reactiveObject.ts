import { reactive } from "../reactive.js";
import { IReactive } from "../types/IReactive.js";
import { IReactiveObject } from "../types/IReactiveObject.js";
import { isReactive } from "../../typeChecks/isReactive.js";
import { ReactivePrimitive } from "../../mod.js";
import { ReactiveArray } from "../ReactiveArray/_ReactiveArray.js";
import { IReactiveArrayCallback } from "../types/IReactiveArrayCallback.js";

/**
 * Takes an object, and turns each of its keys reactive recursively: `Object` values are run through this same function, `Array` values are converted to `ReactiveArray`s and other values are turned into `ReactivePrimitive`s. Some object types are except from this, as specified in `specialCaseObjects`, however, a better solution needs to be found in due time.
 * @param input The object whose keys are to be made reactive
 * @param parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function _reactiveObject<T extends object> (
  input: T,
  parent?: IReactive<unknown>,
): IReactiveObject<T> {
  return Object.fromEntries(
    Object
    .entries(input)
    .map(([k, v]) => [
      k,
      reactive(
        v,
        {parent}
      ),
    ]),
  ) as IReactiveObject<T>;
}





type ObserverMap = {
  get<T extends object>(key: T): ObjectObserver<T> | undefined;
  set<T extends object>(key: T, value: ObjectObserver<T>): ObserverMap;
  has(key: unknown): boolean;
  delete(key: unknown): boolean;
};

export const observedObjects = new WeakMap as ObserverMap;

export type IObjectObserverCallback<T extends object> = (
  property: keyof T,
  value: T[keyof T],
  target: T,
) => void;

class ObjectObserver<T extends object> {
  #target: T;
  #callbacks: Set<IObjectObserverCallback<T>> = new Set;

  constructor (
    target: T,
  ) {
    this.#target = target;
  }

    /**
   * Adds a listener to the object, which is called when the object is modified in some capacity.
   * @param callback The function to be called when the object is modified. It's called with `(property, value, target)`.
   * @param noFirstRun Default: false. Determines whether the callback function should be called once when the listener is first added.
   */
  bind (
    callback: IObjectObserverCallback<T>,
    noFirstRun = false,
  ): this {
    this.#callbacks.add(callback);
    if (!noFirstRun) {
      for (const property of Object.keys(this.#target) as Array<keyof T>) {
        callback(
          property,
          this.#target[property],
          this.#target,
        );
      }
    }

    return this;
  }

  /**
   * Removes a listener that was added using `ObjectObserver::bind()`.
   * @param callback The callback function to be unbound (removed from the object's update callbacks). Similar to EventListeners, it needs to be a reference to the same callaback function that was previously added.
   */
  unbind (
    callback: IObjectObserverCallback<T>,
  ): this {
    this.#callbacks.delete(callback);
    return this;
  }

  dispatch (
    property: keyof T,
    value: T[keyof T],
  ) {
    this._dispatchUpdateEvents(property, value);
  }

  update () {
    for (const property of Object.keys(this.#target) as Array<keyof T>) {
      this._dispatchUpdateEvents(property);
    }
  }

  private _dispatchUpdateEvents (
    property: keyof T,
    value = this.#target[property],
  ) {
    for (const callback of this.#callbacks) {
      queueMicrotask(() => {
        callback(property, value, this.#target);
      });
    }
  }
}

export function reactiveObject<T extends object> (
  input: T,
) {
  const proxy = new Proxy(input, {
    set (
      target,
      property: keyof T,
      value: T[keyof T],
    ) {
      const observer = observedObjects.get(target);
      if (!observer) throw new Error("Internal memory error. This should never happen.");
      target[property] = value;
      observer.dispatch(property, value);

      return true;
    },
  });

  const observer = new ObjectObserver(input);
  observedObjects.set(proxy, observer);

  return proxy;
}

function getObserver<T extends object> (
  object: T,
) {
  const observer = observedObjects.get(object);
  if (!observer) throw new Error(`Object "${object}" not observable.`);

  return observer;
}

export function observe<
  K,
  T extends ReactivePrimitive<K>,
> (
  input: T,
  callback: (value: K) => void,
): T
export function observe<
  K,
  T extends ReactiveArray<K>,
> (
  input: T,
  callback: IReactiveArrayCallback<K>,
): T
export function observe<
  T extends object,
> (
  input: T,
  callback: IObjectObserverCallback<T>,
): T
export function observe<
  T extends IReactive<unknown>,
  V = (
    T extends ReactivePrimitive<infer K> ? K :
    T extends ReactiveArray<infer K>     ? K :
    never
  ),
> (
  input: T,
  callback: (
    T extends ReactivePrimitive<unknown> ? (value: V) => void :
    T extends ReactiveArray<unknown>     ? IReactiveArrayCallback<V> :
    IObjectObserverCallback<T>
  ),
) {
  if(input instanceof ReactivePrimitive || input instanceof ReactiveArray) {
    input.bind(
      callback as (value: V) => void | IReactiveArrayCallback<V>,
    );
  } else {
    getObserver(input).bind(callback as IObjectObserverCallback<T>);
  }

  return input;
}

export function unobserve<
  K,
  T extends ReactivePrimitive<K>,
> (
  input: T,
  callback: (value: K) => void,
): T
export function unobserve<
  K,
  T extends ReactiveArray<K>,
> (
  input: T,
  callback: IReactiveArrayCallback<K>,
): T
export function unobserve<
  T extends object,
> (
  input: T,
  callback: IObjectObserverCallback<T>,
): T
export function unobserve<
  T extends IReactive<unknown>,
  V = (
    T extends ReactivePrimitive<infer K> ? K :
    T extends ReactiveArray<infer K>     ? K :
    never
  ),
> (
  input: T,
  callback: (
    T extends ReactivePrimitive<unknown> ? (value: V) => void :
    T extends ReactiveArray<unknown>     ? IReactiveArrayCallback<V> :
    IObjectObserverCallback<T>
  ),
) {
  if(input instanceof ReactivePrimitive || input instanceof ReactiveArray) {
    input.bind(
      callback as (value: V) => void | IReactiveArrayCallback<V>,
    );
  } else {
    getObserver(input).bind(callback as IObjectObserverCallback<T>);
  }

  return input;
}

export function forceUpdate<
  T extends IReactive<unknown>,
> (
  input: T,
): T {
  if(input instanceof ReactivePrimitive || input instanceof ReactiveArray) {
    input.update();
  } else {
    getObserver(input).update();
  }

  return input;
}

export function pipe<
  T extends IReactive<unknown>
>(
  input: T,
) {

}







// type F = typeof foo["lastIndex"];


// export function unobserve<T extends object> (
//   input: T | IReactive<unknown>,
//   callback: 
//     T extends ReactivePrimitive<infer K> ? (value: K) => void :
//     T extends ReactiveArray<infer K>     ? IReactiveArrayCallback<K> :
//     IObjectObserverCallback<T>,
// ) {
//   if(isReactive(input)) {
//     input.bind(
//       callback as (value: unknown) => void | IReactiveArrayCallback<unknown>,
//     );
//   } else {
//     getObserver(input).unbind(callback as IObjectObserverCallback<T>);
//   }

//   return input;
// }

// export function forceUpdate<T extends object> (
//   input: T | IReactive<unknown>,
// ) {
//   if(isReactive(input)) {
//     input.update();
//   } else {
//     getObserver(input).update();
//   }

//   return input;
// }
