import { ReactiveArray } from "./ReactiveArray";

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
  valueOf () {
    return this.value;
  }

  /**
   * When the object is attempted to be cast to a primitive, the current value of `this.value` is used as a hint. Obviously, if you're trying to cast a `ReactivePrimitive<string>` into a `number`, it'll just cast `this.value` from a `string` to a `number`.
   */
  [Symbol.toPrimitive] () {
    return this.value;
  }

  get [Symbol.toStringTag]() {
    return `Destiny<${typeof this.#value}>`;
  }

  /**
   * Instances of this class can be iterated over asynchronously; it will iterate over updates to the `value`. You can use this feature using `for-await-of`.
   */
  async *[Symbol.asyncIterator]() {
    while (1) {
      yield await this._nextUpdate();
    }
  }

  /**
   * Returns a Promise which will resolve the next time the `value` is updated.
   */
  private _nextUpdate () {
    return new Promise<T> (resolve => {
      const cb = (v: T) => {
        resolve(v);
        this.#callbacks.delete(cb);
      }
      this.#callbacks.add(cb);
    });
  }

  /**
   * Adds a callback to be called whenever the `value` of the `ReacativePrimitive` is updated.
   * @param callback the function to be called on updates
   */
  bind (
    callback: (newValue: T) => any,
  ) {
    this.#callbacks.add(callback);
    callback(this.value);
    return this;
  }

  /**
   * Forces an update event to be dispatched.
   */
  update () {
    this.set();
  }
  
  /**
   * Can be used to functionally update the value.
   * @param value New value to be set
   * @param noUpdate One or more callback methods you don't want to be called on this update. This can be useful for example when responding to DOM events: you wouldn't want to update the DOM with the new value on the same element that caused the udpate in the first place.
   */
  set (
  	value: T = this.#value,
    ...noUpdate: Array<(newValue: T) => any>
  ) {
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
  get value() {
    return this.#value;
  }

  /**
   * Creates a new `ReactivePrimitive` from a callback and n other ReactivePrimitive(s) and/or ReactiveArray(s).
   * @param updater A callback function that is called when any of the reactive input items are updated. The return value of this function determines the value of the returned `ReactivePrimitive`.
   * @param refs One or more `ReactivePrimitive`s or `ReactiveArray`s which are to be piped into a new one.
   */
  static from<
    T,
    Callback extends (...values: (ReactivePrimitive<T> | ReactiveArray<T>)[]) => any,
  > (
    updater: Callback,
    ...refs: (ReactivePrimitive<T> | ReactiveArray<T>)[]
  ): ReactivePrimitive<ReturnType<Callback>> {
    const newRef = new ReactivePrimitive<ReturnType<Callback>>(updater(...refs));
    refs.forEach((ref, i) => 
      ref.bind(() => {
        queueMicrotask(() => {
          newRef.value = updater(...refs);
        });
      }
    ));
    return newRef;
  }

  /**
   * Creates a new `ReactivePrimitive` which is dependent on the `ReactivePrimitive` it's called on, and is updated as the original one is updated. The value of the original is tranformed by a callback function whose return value determines the value of the resulting `ReactivePrimitive`.
   * @param callback A function which will be called whenever the original `ReactivePrimitive` is updated, and whose return value is assigned to the output `ReactivePrimitive`
   */
  pipe <K> (
    callback: (value: ReactivePrimitive<T>) => K,
  ): ReactivePrimitive<K> {
    return ReactivePrimitive.from(
      callback as (value: ReactivePrimitive<T> | ReactiveArray<T>) => K,
      this,
    );
  }
}

// const a = new Ref(3);
// const b = new Ref(6);
// const c = Ref.from(
//   ([a, b]) => a.value + b.value,
//   a,
//   b,
// );
// console.log(a.value, b.value, c.value); //3, 6, 9
// a.value++;
// b.value = 38;
// console.log(a.value, b.value, c.value); //4, 38, 42
