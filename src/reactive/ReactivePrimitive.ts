import { computed, computeFunction } from "./computed.js";

/**
 * `ReactivePrimitive`s are reactive values that contain a single value which can be updated and whose updates can be listened to.
 */
export class ReactivePrimitive<T> {
  /** The current value of the `ReactivePrimitive`. */
  #value: T;

  /** All the callbacks added to the `ReactivePrimitive`, which are to be called when the `value` updates. */
  #callbacks: Set<(value: T) => void> = new Set;

  /**
   * @param initialValue the value to initialize the ReactivePrimitive with
   */
  constructor (
    initialValue: T,
  ) {
    this.#value = initialValue;
  }

  /**
   * Same as `this.value`. The current value of the `ReactivePrimitive`.
   */
  valueOf (): T {
    return this.value;
  }

  /**
   * When the object is attempted to be cast to a primitive, the current value of `this.value` is used as a hint. Obviously, if you're trying to cast a `ReactivePrimitive<string>` into a `number`, it'll just cast `this.value` from a `string` to a `number`.
   */
  [Symbol.toPrimitive] (): T {
    return this.value;
  }

  /**
   * When the object is attempted to be serialized using JSON.serialize(), the current value of `this.value` is returned.
   */
  toJSON (): T {
    return this.value;
  }

  get [Symbol.toStringTag] (): string {
    return `ReactivePrimitive<${typeof this.#value}>`;
  }

  /**
   * Instances of this class can be iterated over asynchronously; it will iterate over updates to the `value`. You can use this feature using `for-await-of`.
   */
  async *[Symbol.asyncIterator] (): AsyncIterable<T> {
    while (true) {
      yield await this.#nextUpdate();
    }
  }

  /**
   * Returns a Promise which will resolve the next time the `value` is updated.
   */
  #nextUpdate (): Promise<T> {
    return new Promise<T>(resolve => {
      const cb = (v: T) => {
        resolve(v);
        this.#callbacks.delete(cb);
      };
      this.#callbacks.add(cb);
    });
  }

  /**
   * Adds a callback to be called whenever the `value` of the `ReacativePrimitive` is updated.
   * @param callback the function to be called on updates
   */
  bind (
    callback: (newValue: T) => void,
    noFirstCall = false,
  ): this {
    this.#callbacks.add(callback);
    if (!noFirstCall) callback(this.value);
    return this;
  }

  /**
   * Forces an update event to be dispatched.
   */
  update (): this {
    this.set(this.#value);

    return this;
  }
  
  /**
   * Can be used to functionally update the value.
   * @param value New value to be set
   * @param noUpdate One or more callback methods you don't want to be called on this update. This can be useful for example when responding to DOM events: you wouldn't want to update the DOM with the new value on the same element that caused the udpate in the first place.
   */
  set (
    value: T,
    ...noUpdate: Array<(newValue: T) => void>
  ): this {
    if (value !== this.#value) {
      this.#value = value;
      [...this.#callbacks.values()]
        .filter(cb => !noUpdate.includes(cb))
        .forEach(cb => cb(value));
    }
    return this;
  }

  /** The current `value` of the `ReactivePrimitive` */
  set value (
    value: T,
  ) {
    this.set(value);
  }

  get value (): T {
    if (computeFunction) {
      this.#callbacks.add(computeFunction);
    }

    return this.#value;
  }

  /**
   * Creates a new `ReactivePrimitive` which is dependent on the `ReactivePrimitive` it's called on, and is updated as the original one is updated. The value of the original is tranformed by a callback function whose return value determines the value of the resulting `ReactivePrimitive`.
   * @param callback A function which will be called whenever the original `ReactivePrimitive` is updated, and whose return value is assigned to the output `ReactivePrimitive`
   */
  pipe <K> (
    callback: (value: T) => K,
  ): Readonly<ReactivePrimitive<K>> {
    return computed(() => callback(this.value));
  }

  truthy<T> (
    valueWhenTruthy: T,
    valueWhenFalsy?: undefined,
  ): Readonly<ReactivePrimitive<T | undefined>>
  truthy<T, K> (
    valueWhenTruthy: T,
    valueWhenFalsy: K,
  ): Readonly<ReactivePrimitive<T | K>>
  truthy<T, K> (
    valueWhenTruthy: T,
    valueWhenFalsy: K,
  ): Readonly<ReactivePrimitive<T | K>> {
    return this.pipe(v => v ? valueWhenTruthy : valueWhenFalsy);
  }

  falsy<T> (
    valueWhenFalsy: T,
    valueWhenTruthy?: undefined,
  ): Readonly<ReactivePrimitive<T | undefined>>
  falsy<T, K> (
    valueWhenFalsy: T,
    valueWhenTruthy: K,
  ): Readonly<ReactivePrimitive<T | K>>
  falsy<T, K> (
    valueWhenFalsy: T,
    valueWhenTruthy: K,
  ): Readonly<ReactivePrimitive<T | K>> {
    return this.pipe(v => v ? valueWhenTruthy : valueWhenFalsy);
  }
}
