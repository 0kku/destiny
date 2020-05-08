import { ReactiveArray } from "./ReactiveArray";

export class ReactivePrimitive<T> {
  #value: T;
  callbacks = new Set<(value: T) => void>();

  constructor (
    initialValue: T,
  ) {
    this.#value = initialValue;
  }

  valueOf () {
    return this.value;
  }

  [Symbol.toPrimitive] () {
    return this.value;
  }

  get [Symbol.toStringTag]() {
    return `Destiny<${typeof this.#value}>`;
  }

  async *[Symbol.asyncIterator]() {
    while (1) {
      yield await this._nextUpdate();
    }
  }

  private _nextUpdate () {
    return new Promise<T> (resolve => {
      const cb = (v: T) => {
        resolve(v);
        this.callbacks.delete(cb);
      }
      this.callbacks.add(cb);
    });
  }

  bind (
    cb: (newValue: T) => any,
  ) {
    this.callbacks.add(cb);
    cb(this.value);
    return this;
  }

  update () {
    this.set();
  }
  
  set (
  	value: T = this.#value,
    ...noUpdate: Array<(newValue: T) => any>
  ) {
    if (value !== this.#value) {
      this.#value = value;
      [...this.callbacks.values()]
        .filter(cb => !noUpdate.includes(cb))
        .forEach(cb => cb(value));
    }
  }

  set value (
    value: T,
  ) {
    this.set(value);
  }

  get value() {
    return this.#value;
  }

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

  pipe <K> (
    cb: (value: ReactivePrimitive<T>) => K,
  ): ReactivePrimitive<K> {
    return ReactivePrimitive.from(
      cb as (value: ReactivePrimitive<T> | ReactiveArray<T>) => K,
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
