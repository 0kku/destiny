import { ReactiveArray } from "../mod.js";

type TUnwrap<T> = (
  T extends ReactivePrimitive<infer U> ? U :
  T extends ReactiveArray<infer U>     ? U :
  never
);
// type TUnwrapAll<T> = {
//   [K in keyof T]: TUnwrap<T[K]>
// };

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

  get [Symbol.toStringTag] (): string {
    return `Destiny<${typeof this.#value}>`;
  }

  /**
   * Instances of this class can be iterated over asynchronously; it will iterate over updates to the `value`. You can use this feature using `for-await-of`.
   */
  async *[Symbol.asyncIterator] (): AsyncIterable<T> {
    while (true) {
      yield await this._nextUpdate();
    }
  }

  /**
   * Returns a Promise which will resolve the next time the `value` is updated.
   */
  private _nextUpdate (): Promise<T> {
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
    if (!noFirstCall) callback(this.#value);
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
    return this.#value;
  }

  /**
   * Creates a new `ReactivePrimitive` from a callback and n other ReactivePrimitive(s) and/or ReactiveArray(s).
   * @param updater A callback function that is called when any of the reactive input items are updated. The return value of this function determines the value of the returned `ReactivePrimitive`.
   * @param refs One or more `ReactivePrimitive`s or `ReactiveArray`s which are to be piped into a new one.
   */
  static from<
    TParams extends Array<ReactivePrimitive<any> | ReactiveArray<any>>,
    TReturn,
  > (
    updater: (...values: {
      [K in keyof TParams]: TUnwrap<TParams[K]>;
    }) => TReturn,
    ...refs: TParams
  ): Readonly<ReactivePrimitive<TReturn>> {
    type TUnwrappedParams = Parameters<typeof updater>;

    const currentValue = () => updater(
      ...refs.map(
        // This is fine. The type is not known and isn't a concern at this step.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        v => v.value,
      ) as TUnwrappedParams,
    );

    const newRef = new ReactivePrimitive(currentValue());
    refs.forEach(
      ref => ref.bind(
        () => queueMicrotask(
          () => newRef.value = currentValue(),
        ),
        true,
      ),
    );
    return newRef;
  }

  /**
   * Creates a new `ReactivePrimitive` which is dependent on the `ReactivePrimitive` it's called on, and is updated as the original one is updated. The value of the original is tranformed by a callback function whose return value determines the value of the resulting `ReactivePrimitive`.
   * @param callback A function which will be called whenever the original `ReactivePrimitive` is updated, and whose return value is assigned to the output `ReactivePrimitive`
   */
  pipe <K> (
    callback: (value: T) => K,
  ): Readonly<ReactivePrimitive<K>> {
    return ReactivePrimitive.from(
      callback,
      this,
    );
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

  ternary<A> (
    condition: (newValue: T) => boolean, 
    yes: A,
    no?: undefined,
  ): Readonly<ReactivePrimitive<A | undefined>>
  ternary<A, B> (
    condition: (newValue: T) => boolean, 
    yes: A,
    no: B,
  ): Readonly<ReactivePrimitive<A | B>> {
    return this.pipe(v => condition(v) ? yes : no);
  }
}

// const a = new ReactivePrimitive(3);
// const b = new ReactivePrimitive("6");
// const d = new ReactiveArray(["7", "8"]);
// const c = ReactivePrimitive.from(
//   (a, b, d) => a + b,
//   a,
//   b,
//   d
// );
// console.log(a.value, b.value, c.value); //3, 6, 9
// a.value++;
// b.value = "38";
// console.log(a.value, b.value, c.value); //4, 38, 42
