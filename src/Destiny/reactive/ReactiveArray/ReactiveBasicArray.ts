/**
 * This module is currently not being used at all. It will be reworked entirely in the near future.
 */

import { ReactivePrimitive } from "../../mod.js";

type IReactiveArrayCallback<T> = (
  index: number,
  deleteCount: number,
  ...values: Array<T>
) => any;

export class DestinyBasicArray<T> {
  #callbacks = new Set<IReactiveArrayCallback<T>>();
  #value = [] as T[];

  constructor (
    ...array: T[]
  ) {
    this.#value = array;
  }

  /**
   * Iterating over instances of this class will go through its values, just like normal Arrays.
   * 
   * TODO: Decide if this should return Iterator<T> or Iterator<DestinyPrimitive<T>>
   */
  *[Symbol.iterator]() {
    yield* this.#value;
  }

  /**
   * Asynchronous iteration will go through updates to instances of this class. This is an alternative to bind().
   * 
   * Examples:
   * 
   * Sending changes to the backend:
   * 
   *    const items = new ReactiveArray();
   *    for await (const update of items) {
   *      fetch("./api", {
   *        body: JSON.stringify(update),
   *      });
   *    }
   * 
   * Logging changes:
   * 
   *    const items = new ReactiveArray();
   *    for await (const [index, deletionCount, ...insertedItems] of items) {
   *      console.table({
   *        index,
   *        deleteCount,
   *        insertedItems,
   *      });
   *    }
   */
  async *[Symbol.asyncIterator]() {
    while (1) {
      yield await this._nextUpdate();
    }
  }

  private _nextUpdate () {
    return new Promise<[number, number, ...T[]]>(resolve => {
      const cb: IReactiveArrayCallback<T> = (...props) => {
        resolve(props);
        this.#callbacks.delete(cb);
      }
      this.#callbacks.add(cb);
    });
  }

  get value (): T[] {
    return this.#value.slice(0);
  }

  set value (
    items: T[],
  ) {
    this.splice(
      0,
      this.#value.length,
      ...items,
    );
  }

  get (
    index: number,
  ): ReactivePrimitive<T> {
    return this.pipe(() => this.#value[index]);
  }

  set (
    index: number,
    value: T,
  ): T {
    this.splice(index, 1, value);
    return value;
  }

  private _argsForFullUpdate (): Parameters<IReactiveArrayCallback<T>> {
    return [0, this.#value.length - 1, ...this.#value];
  }
  
  pipe<
    F extends IReactiveArrayCallback<T>,
  > (
    callback: F,
  ) {
    const ref = new ReactivePrimitive(
      callback(...this._argsForFullUpdate()) as ReturnType<F>,
    );
    this.bind((...args) => ref.value = callback(...args));
    return ref;
  }

  bind (
    callback: IReactiveArrayCallback<T>,
    noFirstRun = false,
  ): this {
    this.#callbacks.add(callback);
    if (!noFirstRun) {
      callback(...this._argsForFullUpdate());
    }
    return this;
  }

  splice (
    start: number,
    deleteCount: number = this.#value.length - start,
    ...items: Array<T>
  ) {
    const deletedItems = this.#value.splice(start, deleteCount, ...items);
    for (const callback of this.#callbacks) {
      callback(start, deleteCount, ...items);
    }
    return deletedItems;
  }

  /**
   * This method exists because TS is dumb and can't figure out constructor types or symbol keys.
   * The return type is incorrect too. The actual type is typeof this.
   */
  private get species(): typeof DestinyBasicArray {
    //@ts-ignore
    return this.constructor[Symbol.species];
  }

  /* 
   * Non-mutating methods that return a new DestinyArray
   * 
   * Unless specified otherwise, these behave in a similar manner to the equivalent Array prototype methods, except that they return a reactive DestinyArray instead of a regular Array.
   */

  filter<S extends T> (
    callback: (value: T, index: number, array: T[]) => value is S,
  ): DestinyBasicArray<S> {
    const newArr = new this.species(...this.#value.filter(callback));
    this.#callbacks.add(
      (
        index,
        deleteCount,
        ...values
      ) => newArr.splice(
        index,
        deleteCount,
        ...values.filter(callback)
      ),
    );
    
    return newArr;
  }

  // flat (
  //   depth = 1,
  // ) {
  //   const newArr = new this.species(...this.#value.flat(depth));
  //   this.#callbacks.add(() => {
  //     newArr.value = this.#value.flat(depth);
  //   });
  //   return newArr;
  // }

  // flatMap<U> (
  //   callback: (value: T, index: number, array: T[]) => U | ReadonlyArray<U>,
  // ) {
  //   const newArr = new this.species(...this.#value.flatMap(callback));
  //   this.#callbacks.add(() => {
  //     newArr.value = this.#value.flatMap(callback);
  //   });
  //   return newArr;
  // }

  map<U> (
    callback: (value: T, index: number, array: T[]) => U,
  ) {
    const newArr = new this.species(...this.#value.map(callback));
    this.#callbacks.add(
      (
        index,
        deleteCount,
        ...values
      ) => newArr.splice(
        index,
        deleteCount,
        ...values.map(callback)
      ),
    );
    return newArr;
  }

  slice (
    start = 0,
    end = this.#value.length - 1,
  ) {
    const newArr = new this.species(...this.#value.slice(start, end));
    this.bind((
      index: number,
      deleteCount: number,
      ...values: T[]
    ) => newArr.splice(
      index - start,
      deleteCount,
      ...values.slice(0, end - start - index),
    ));
    return newArr;
  }

  /* Methods that return a new DestinyPrimitive */

  indexOf (
    ...args: Parameters<Array<T>["indexOf"]>
  ): ReactivePrimitive<ReturnType<Array<T>["indexOf"]>> {
    return this.pipe(() => this.#value.indexOf(...args));
  }

  join (
    ...args: Parameters<Array<T>["join"]>
  ): ReactivePrimitive<ReturnType<Array<T>["join"]>> {
    return this.pipe(() => this.#value.join(...args));
  }

  lastIndexOf (
    ...args: Parameters<Array<T>["lastIndexOf"]>
  ): ReactivePrimitive<ReturnType<Array<T>["lastIndexOf"]>> {
    return this.pipe(() => this.#value.lastIndexOf(...args));
  }

  every (
    ...args: Parameters<Array<T>["every"]>
  ): ReactivePrimitive<ReturnType<Array<T>["every"]>> {
    return this.pipe(() => this.#value.every(...args));
  }

  some (
    ...args: Parameters<Array<T>["some"]>
  ): ReactivePrimitive<ReturnType<Array<T>["some"]>> {
    return this.pipe(() => this.#value.some(...args));
  }

  forEach (
    ...args: Parameters<Array<T>["forEach"]>
  ): void {
    this.pipe(() => this.#value.forEach(...args));
  }

  reduce (
    ...args: Parameters<Array<T>["reduce"]>
  ): ReactivePrimitive<ReturnType<Array<T>["reduce"]>> {
    return this.pipe(() => this.#value.reduce(...args));
  }

  reduceRight (
    ...args: Parameters<Array<T>["reduceRight"]>
  ): ReactivePrimitive<ReturnType<Array<T>["reduceRight"]>> {
    return this.pipe(() => this.#value.reduceRight(...args));
  }

  find (
    ...args: Parameters<Array<T>["find"]>
  ): ReactivePrimitive<T | undefined> {
    return this.pipe(() => this.#value.find(...args));
  }

  findIndex (
    ...args: Parameters<Array<T>["findIndex"]>
  ): ReactivePrimitive<number> {
    return this.pipe(() => this.#value.findIndex(...args));
  }

  entries () {
    return this.map((v, i) => [i, v] as [number, T]);
  }

  keys () {
    return this.map((_, i) => i);
  }

  values () {
    return this.map(v => v);
  }

  includes (
    ...args: Parameters<Array<T>["includes"]>
  ) {
    return this.pipe(() => this.#value.includes(...args));
  }

  #length?: ReactivePrimitive<number>;
  get length (): ReactivePrimitive<number> {
    if (!this.#length) {
      this.#length = new ReactivePrimitive(this.#value.length);
      this.bind(() => this.#length!.value = this.#value.length);
    }
    
    return this.#length;
  }
};
