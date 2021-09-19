import { IterableWeakMap } from "../../utils/IterableWeakMap.js";
import { WeakMultiRef } from "../../utils/WeakMultiRef.js";
import { computedConsumer } from "../computed.js";
import { concatIterators } from "../../utils/concatIterators.js";
import { PassReactiveValue } from "./PassReactiveValue.js";
import { internalSetReactiveValue } from "./internalSetReactiveValue.js";
import { stronglyHeldDependencies, weaklyHeldDependencies } from "./valueDependencyCaches.js";
import type { TReactiveValueCallback } from "./TReactiveValueCallback.js";
import type { TReactiveValueUpdaterOptions } from "./TReactiveValueUpdaterOptions.js";
import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReadonlyReactiveArray.js";


export class ReadonlyReactiveValue<T> {
  /** The current value of the `ReactiveValue`. */
  #value: T;

  /** All the callbacks added to the `ReactiveValue`, which are to be called when the `value` updates. */
  readonly #callbacks: Set<TReactiveValueCallback<T>> = new Set;

  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly #consumers = new IterableWeakMap<object, TReactiveValueCallback<T>>();

  readonly dependencies = new Map<ReadonlyReactiveValue<any> | ReadonlyReactiveArray<any>, VoidFunction>();

  constructor (
    initialValue: T,
  ) {
    this.#value = initialValue;
    internalSetReactiveValue.set(
      this,
      (...args) => this.#set(...args),
    );
  }
  
  /**
   * Can be used to functionally update the value.
   * @param value New value to be set
   * @param noUpdate One or more callback methods you don't want to be called on this update. This can be useful for example when responding to DOM events: you wouldn't want to update the DOM with the new value on the same element that caused the udpate in the first place.
   */
  #set (
    value: T,
    options?: Partial<TReactiveValueUpdaterOptions<T>>,
  ): this {
    const {
      noUpdate,
      force,
    }: TReactiveValueUpdaterOptions<T> = {
      noUpdate: [],
      force: false,
      ...options,
    };
    if (force || !Object.is(value, this.#value)) {
      this.#value = value;

      const callbacks = concatIterators(
        this.#callbacks.values(),
        this.#consumers.values(),
      );
      for (const callback of callbacks) {
        if (!noUpdate.includes(callback)) {
          callback(value);
        }
      }
    }
    return this;
  }

  /**
   * Same as `this.value`. The current value of the `ReactiveValue`.
   */
  valueOf (): T {
    return this.value;
  }

  /**
   * When the object is attempted to be cast to a primitive, the current value of `this.value` is used as a hint. Obviously, if you're trying to cast a `ReactiveValue<string>` into a `number`, it'll just cast `this.value` from a `string` to a `number`. Trying to cast `ReactiveValue<object>` to a primitive will throw.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Symbol.toPrimitive] (): T extends object ? never : T {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return this.value as T extends object ? never : T;
  }

  /**
   * When the object is attempted to be serialized using JSON.serialize(), the current value of `this.value` is returned.
   */
  toJSON (): T {
    return this.value;
  }

  get [Symbol.toStringTag] (): string {
    return `${this.constructor.name}<${typeof this.#value}>`;
  }

  /**
   * Instances of this class can be iterated over asynchronously; it will iterate over updates to the `value`. You can use this feature using `for-await-of`.
   */
  async *[Symbol.asyncIterator] (): AsyncIterable<T> {
    while (true) {
      yield await this.nextUpdate;
    }
  }

  /**
   * Returns a Promise which will resolve the next time the `value` is updated.
   */
  get nextUpdate (): Promise<T> {
    return new Promise<T>(resolve => {
      const cb = (v: T) => {
        resolve(v);
        this.#callbacks.delete(cb);
      };
      this.#callbacks.add(cb);
    });
  }

  /**
   * Adds a callback to be called whenever the `value` of the `ReacativeValue` is updated.
   * @param callback the function to be called on updates
   * @param options.noFirstRun   Set to true and the callback won't be fired right after being added.
   * @param options.dependencies  An array of objects that are modified by the callback provided. The callback will be garbage collected if all the provided objects are collected. If no dependencies are provided, the callback will never be automatically garbage collected and you have to unbind it yourself to avoid leaking memory.
   */
  bind (
    callback: TReactiveValueCallback<T>,
    options: {
      noFirstRun?:  boolean,
      // eslint-disable-next-line @typescript-eslint/ban-types
      dependents?: ReadonlyArray<object>,
    } = {},
  ): this {
    if (!options.noFirstRun) callback(this.value);

    if (options.dependents?.length) {
      const key = new WeakMultiRef(options.dependents);
      this.#consumers.set(key, callback);
      weaklyHeldDependencies.set(key, this);
    } else {
      this.#callbacks.add(callback);
      stronglyHeldDependencies.set(callback, this);
    }

    return this;
  }

  unbind (
    callback: TReactiveValueCallback<T>,
  ): this {
    this.#callbacks.delete(callback);
    stronglyHeldDependencies.delete(callback);

    return this;
  }

  /** The current value of the ReadonlyReactiveValue. */
  get value (): T {
    if (computedConsumer) {
      const {fn, consumer} = computedConsumer;
      consumer.dependencies.set(this, fn);
      this.#consumers.set(
        consumer, 
        fn,
      );
    }

    return this.#value;
  }

  /**
   * Creates a new `ReactiveValue` which is dependent on the `ReactiveValue` it's called on, and is updated as the original one is updated. The value of the original is tranformed by a callback function whose return value determines the value of the resulting `ReactiveValue`.
   * @param callback A function which will be called whenever the original `ReactiveValue` is updated, and whose return value is assigned to the output `ReactiveValue`
   */
  pipe <K> (
    callback: (value: T) => K,
  ): ReadonlyReactiveValue<K> {
    const reactor = new ReadonlyReactiveValue(callback(this.#value));
    const fn = () => internalSetReactiveValue.get(reactor)(callback(this.#value));
    reactor.dependencies.set(this, fn);
    this.#consumers.set(
      reactor,
      fn,
    );
    return reactor;
  }

  truthy<T> (
    valueWhenTruthy: T,
    valueWhenFalsy?: undefined,
  ): ReadonlyReactiveValue<T | undefined>
  truthy<T, K> (
    valueWhenTruthy: T,
    valueWhenFalsy: K,
  ): ReadonlyReactiveValue<T | K>
  truthy<T, K> (
    valueWhenTruthy: T,
    valueWhenFalsy: K,
  ): ReadonlyReactiveValue<T | K> {
    return this.pipe(v => v ? valueWhenTruthy : valueWhenFalsy);
  }

  falsy<T> (
    valueWhenFalsy: T,
    valueWhenTruthy?: undefined,
  ): ReadonlyReactiveValue<T | undefined>
  falsy<T, K> (
    valueWhenFalsy: T,
    valueWhenTruthy: K,
  ): ReadonlyReactiveValue<T | K>
  falsy<T, K> (
    valueWhenFalsy: T,
    valueWhenTruthy: K,
  ): ReadonlyReactiveValue<T | K> {
    return this.pipe(v => v ? valueWhenTruthy : valueWhenFalsy);
  }

  /**
   * Returns a reference to the reactive value, which can be used to pass it as a prop to a template without binding or unboxing. The reference gets unwrapped by the tempalte automatically, and you will receive the ReactiveValue itself on the other side.
   */
  get pass (): PassReactiveValue<T> {
    return new PassReactiveValue(this);
  }
}
