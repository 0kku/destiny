import { ReactivePrimitive } from "../_Destiny.js";
import { toNumber } from "../utils/toNumber.js";
import { reactive } from "./reactive.js";
import { isObject } from "../typeChecks/isObject.js";
import { IArrayValueType } from "./types/IArrayValueType";
import { IReactiveArrayCallback } from "./types/IReactiveArrayCallback";
import { isReactive } from "../typeChecks/isReactive.js";
import { isPrimitive } from "../typeChecks/isPrimitive.js";
import { isSpecialCaseObject } from "./specialCaseObjects.js";

export class ReactiveArray<InputType> {
  [key: number]: IArrayValueType<InputType>;
  #callbacks = new Set<IReactiveArrayCallback<IArrayValueType<InputType>>>();
  #value: IArrayValueType<InputType>[] = [];

  constructor (
    ...array: InputType[]
  ) {
    this.splice(0, 0, ...array);
    return new Proxy(
      this,
      {
        deleteProperty (
          target: ReactiveArray<InputType>,
          property: keyof ReactiveArray<InputType> | string,
        ) {
          const index = toNumber(property);
          if (!Number.isNaN(index)) {
            target.splice(index, 1);
            return true;
          } else return false;
        },

        //@ts-ignore
        get (
          target: ReactiveArray<InputType>,
          property: keyof ReactiveArray<InputType>,
        ) {
          const index = toNumber(property);
          if (!Number.isNaN(index)) { // Was valid number key (i.e. array index)
            return target.get(index);
          } else { // Was a string or symbol key
            const value = target[property];
            return typeof value === "function"
              ? value.bind(target) // Without binding, #private fields break in Proxies
              : value;
          }
        },
  
        set (
          target: ReactiveArray<InputType>,
          property: keyof ReactiveArray<InputType> | string,
          value: InputType,
        ) {
          const index = toNumber(property);
          if (!Number.isNaN(index)) {
            target.set(index, value);
            return true;
          } else {
            return false;
          }
        },
      },
    );
  }

  *[Symbol.iterator]() {
    yield* this.#value;
  }

  async *[Symbol.asyncIterator]() {
    while (1) {
      yield await this._nextUpdate();
    }
  }

  private _nextUpdate () {
    return new Promise<[number, number, ...IArrayValueType<InputType>[]]>(resolve => {
      const cb: IReactiveArrayCallback<IArrayValueType<InputType>> = (...props) => {
        resolve(props);
        this.#callbacks.delete(cb);
      }
      this.#callbacks.add(cb);
    });
  }

  get value () {
    return this.#value.slice(0);
  }

  // set value (
  //   items: ValueType[],
  // ) {
  //   this.splice(
  //     0,
  //     this.#value.length,
  //     ...items,
  //   );
  // }

  setValue (
    items: Array<InputType | IArrayValueType<InputType>>,
  ) {
    this.splice(
      0,
      this.#value.length,
      ...items,
    );
  }

  get (
    index: number,
  ) {
    const i = index < 0
      ? this.#value.length + index
      : index;
    return this.#value[i];
    // return this.pipe(() => this.#value[i]);
  }

  set (
    index: number,
    value: InputType,
  ) {
    if (index > this.#value.length) {
      throw new RangeError("Out of bounds assignment. Sparse arrays are not allowed. Consider using .push() instead.");
    }
    this.splice(index, 1, value);
    return value;
  }

  private _argsForFullUpdate (): Parameters<IReactiveArrayCallback<IArrayValueType<InputType>>> {
    return [0, this.#value.length, ...this.#value];
  }
  
  pipe<
    F extends IReactiveArrayCallback<IArrayValueType<InputType>, ReturnType<F>>,
  > (
    callback: F,
  ) {
    const ref = new ReactivePrimitive(callback(...this._argsForFullUpdate()));
    this.bind((...args) => {
      ref.value = callback(...args);
    }, true);
    return ref;
  }

  bind (
    callback: IReactiveArrayCallback<IArrayValueType<InputType>>,
    noFirstRun = false,
  ) {
    console.trace("cb added", this.#callbacks.size);
    this.#callbacks.add(callback);
    if (!noFirstRun) {
      callback(0, 0, ...this.#value);
    }
    return this;
  }

  unbind (
    callback: IReactiveArrayCallback<IArrayValueType<InputType>>,
  ) {
    this.#callbacks.delete(callback);
  }

  //#region Mutating methods
  // Unless specified otherwise, these methods follow the signature of equivalent Array prototype methods.

  //TODO
  // concat<
  //   U,
  //   K extends ValueType | U
  // > (
  //   ...items: Array<K | K[] | DestinyPrimitive<K> | DestinyArray<K>>
  // ) {
  //   const newArr = new DestinyArray<ValueType | U>(...this);
  //   let cursor = this.#value.length;
  //   this.bind(newArr.splice);
  //   for (const item of items) {
  //     if (item instanceof DestinyArray) {
  //       item.bind(
  //         (
  //           index,
  //           deleteCount,
  //           ...values
  //         ) => newArr.splice(
  //           index + cursor,
  //           deleteCount,
  //           ...values
  //         ),
  //       );
  //       cursor += item.value.length;
  //     } else if (item instanceof DestinyPrimitive) {
  //       item.bind(value => newArr.splice(cursor++, 1, value));
  //     } else if (Array.isArray(item)) {
  //       newArr.splice(cursor, 0, ...item);
  //       cursor += item.length;
  //     } else {
  //       newArr.splice(cursor++, 0, item);
  //     }
  //   }
  //   return newArr;
  // }

  //TODO
  // copyWithin (
  //   target: number,
  //   start: number,
  //   end: number,
  // ) {
  //   this.splice(
  //     target,
  //     end - start,
  //     ...this.#value.slice(start, end),
  //   );
  //   return this;
  // }

  fill (
    ...args: Parameters<Array<InputType>["fill"]>
  ) {
    this.splice(
      0,
      this.#value.length,
      ...Array(this.#value.length).fill(...args),
    );
    return this;
  }

  /**
   * Equivalent to Array.prototype.filter, except that it mutates the array in place.
   */
  mutFilter (
    callback: (value: IArrayValueType<InputType>, index: number, array: IArrayValueType<InputType>[]) => boolean,
  ) {
    this.#value
      .flatMap((v, i, a) =>  callback(v, i, a) ? [] : i)
      .reduce(
        (acc, indexToDelete) => {
          if (!acc.length || acc[0][0] + acc[0][1] !== indexToDelete) {
            acc.unshift([indexToDelete,  1]);
          } else {
            acc[0][1]++;
          }
          return acc;
        },
        [] as [number, number][],
      )
      .forEach(args => {
        this.splice.apply(this, args);
      });
    return this;
  }

  mutMap (
    callback: (value: IArrayValueType<InputType>, index: number, array: IArrayValueType<InputType>[]) => IArrayValueType<InputType>,
  ) {
    this.#value
      .flatMap((v, i, a) => {
        const newValue = callback(v, i, a);
        return newValue === v ? [] : {index: i, value: newValue};
      })
      .reduce(
        (acc, {index, value}) => {
          if (!acc.length || acc[0][0] + acc[0][1] !== index) {
            acc.unshift([index,  1, value]);
          } else {
            acc[0][1]++;
            acc[0].push(value);
          }
          return acc;
        },
        [] as [number, number, ...IArrayValueType<InputType>[]][],
      )
      .forEach(args => {
        this.splice(...args);
      });
    return this;
  }

  pop () {
    const index = this.#value.length - 1;
    const removedItem = this.#value[index];
    this.splice(index, 1);
    return removedItem;
  }

  push (
    ...items: InputType[]
  ) {
    this.splice(this.#value.length, 0, ...items);
    return this.#value.length;
  }

  reverse () {
    this.setValue(this.#value.reverse());
    return this;
  }

  shift () {
    const removedItem = this[0];
    this.splice(0, 1);
    return removedItem;
  }

  sort (
    compareFn?: ((a: IArrayValueType<InputType>, b: IArrayValueType<InputType>) => number),
  ) {
    this.setValue(this.#value.sort(compareFn));
    return this;
  }

  splice (
    start: number,
    deleteCount: number = this.#value.length - start,
    ...items: Array<InputType | IArrayValueType<InputType>>
  ) {
    const reactiveItems = items.map(v => {
      return (
        isReactive(v) || isPrimitive(v) || isSpecialCaseObject(v)
        ? v 
        : reactive(
            v,
            {parent: this},
          )
      ) as IArrayValueType<InputType>;
    });

    const deletedItems = this.#value.splice(start, deleteCount, ...reactiveItems);
    console.trace("cb count", this.#callbacks.size);
    for (const callback of this.#callbacks) {
      queueMicrotask(() => {
        callback(start, deleteCount, ...reactiveItems);
      });
    }
    // Here each callback that was specifically associated with deleted items should be removed, but idk how
    return deletedItems;
  }

  update () {
    console.trace("cb count", this.#callbacks.size);
    for (const callback of this.#callbacks) {
      queueMicrotask(() => {
        callback(0, 0);
      });
    }
  }

  unshift (
    ...items: Array<InputType>
  ) {
    this.splice(0, 0, ...items);
    return this.#value.length;
  }

  //#endregion

  // #region Non-mutating methods that return a new DestinyArray
  // Unless specified otherwise, these behave in a similar manner to the equivalent Array prototype methods, except that they return a reactive DestinyArray instead of a regular Array.

  filter<S extends IArrayValueType<InputType>> (
    callback: (
      value: IArrayValueType<InputType>,
      index: number,
      array: IArrayValueType<InputType>[],
    ) => value is S,
  ): ReactiveArray<S> {
    const newArr: ReactiveArray<S> = new ReactiveArray(...this.#value.filter(callback));
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

  flat (
    depth = 1,
  ) {
    const newArr = new ReactiveArray(...this.#value.flat(depth));
    this.#callbacks.add(() => {
      newArr.setValue(this.#value.flat(depth))
    });
    return newArr;
  }

  // TODO
  // flatMap<U> (
  //   callback: (value: ValueType, index: number, array: ValueType[]) => U | ReadonlyArray<U>,
  // ) {
  //   const newArr = new DestinyArray(...this.#value.flatMap(callback));
  //   this.#callbacks.add(() => {
  //     newArr.value = this.#value.flatMap(callback);
  //   });
  //   return newArr;
  // }

  map<U> (
    callback: (
      value: IArrayValueType<InputType>,
      index: ReactivePrimitive<number>,
      array: this,
    ) => U,
  ): ReactiveArray<U> {
    const cb = (v: IArrayValueType<InputType>, i: number) => {
      return callback(
        v,
        this.pipe((index, deleteCount, ...items) => {
          if (items.length === this.value.length || index > i) {
            return i;
          } else {
            i += items.length - deleteCount;
            return i;
          }
        }),
        this,
      )
    };

    const newArr = new ReactiveArray(...this.#value.map(cb));
    this.#callbacks.add(
      (
        index,
        deleteCount,
        ...values
      ) => newArr.splice(
        index,
        deleteCount,
        ...values.map((v, i) => {
          return cb(v, i + index);
        }),
      ),
    );
    return newArr;
  }

  slice (
    start = 0,
    end = this.#value.length - 1,
  ) {
    const newArr = new ReactiveArray(...this.#value.slice(start, end));
    this.bind((
      index: number,
      deleteCount: number,
      ...values: IArrayValueType<InputType>[]
    ) => newArr.splice(
      index - start,
      deleteCount,
      ...values.slice(0, end - start - index),
    ));
    return newArr;
  }

  /* Methods that return a new DestinyPrimitive */

  indexOf (
    ...args: Parameters<Array<IArrayValueType<InputType>>["indexOf"]>
  ) {
    return this.pipe(() => this.#value.indexOf(...args));
  }

  join (
    ...args: Parameters<Array<IArrayValueType<InputType>>["join"]>
  ) {
    return this.pipe(() => this.#value.join(...args));
  }

  lastIndexOf (
    ...args: Parameters<Array<IArrayValueType<InputType>>["lastIndexOf"]>
  ) {
    return this.pipe(() => this.#value.lastIndexOf(...args));
  }

  every (
    ...args: Parameters<Array<IArrayValueType<InputType>>["every"]>
  ): ReactivePrimitive<boolean> {
    return this.pipe(() => {
      console.log("every updated");
      return this.#value.every(...args)
    });
  }

  some (
    ...args: Parameters<Array<IArrayValueType<InputType>>["some"]>
  ) {
    return this.pipe(() => this.#value.some(...args));
  }

  /**
   * Is true when the callback returns true for some, but not all items in the array.
   */
  exclusiveSome (
    cb: (
      value: IArrayValueType<InputType>,
      index: number,
      array: IArrayValueType<InputType>[]
    ) => boolean,
  ): ReactivePrimitive<boolean> {
    return this.pipe(() => this.#value.some(cb) && !this.#value.every(cb));
  }

  forEach (
    ...args: Parameters<Array<IArrayValueType<InputType>>["forEach"]>
  ) {
    return this.pipe(() => this.#value.forEach(...args));
  }

  reduce (
    ...args: Parameters<Array<IArrayValueType<InputType>>["reduce"]>
  ) {
    return this.pipe(() => this.#value.reduce(...args));
  }

  reduceRight (
    ...args: Parameters<Array<IArrayValueType<InputType>>["reduceRight"]>
  ) {
    return this.pipe(() => this.#value.reduceRight(...args));
  }

  find (
    ...args: Parameters<Array<IArrayValueType<InputType>>["find"]>
  ) {
    return this.pipe(() => this.#value.find(...args));
  }

  findIndex (
    ...args: Parameters<Array<IArrayValueType<InputType>>["findIndex"]>
  ) {
    return this.pipe(() => this.#value.findIndex(...args));
  }

  entries (
    ...args: Parameters<Array<IArrayValueType<InputType>>["entries"]>
  ) {
    return this.pipe(() => this.#value.entries(...args));
  }

  keys (
    ...args: Parameters<Array<IArrayValueType<InputType>>["keys"]>
  ) {
    return this.pipe(() => this.#value.keys(...args));
  }

  values (
    ...args: Parameters<Array<IArrayValueType<InputType>>["values"]>
  ) {
    return this.pipe(() => this.#value.values(...args));
  }

  includes (
    ...args: Parameters<Array<IArrayValueType<InputType>>["includes"]>
  ) {
    return this.pipe(() => this.#value.includes(...args));
  }

  get length () {
    const ref = new ReactivePrimitive(this.#value.length);
    this.bind(() => ref.value = this.#value.length);
    return ref;
  }

  //#endregion
};
