import { ReactivePrimitive } from "../_Destiny.js";
import { toNumber } from "../utils/toNumber.js";
import { reactive } from "./reactive.js";
import { IArrayValueType } from "./types/IArrayValueType";
import { IReactiveArrayCallback } from "./types/IReactiveArrayCallback";
import { isReactive } from "../typeChecks/isReactive.js";
import { isPrimitive } from "../typeChecks/isPrimitive.js";
import { isSpecialCaseObject } from "./specialCaseObjects.js";

export class ReactiveArray<InputType> {
  [key: number]: IArrayValueType<InputType>;
  #value: IArrayValueType<InputType>[] = [];
  #indices: ReactivePrimitive<number>[] = [];
  #callbacks: Set<IReactiveArrayCallback<IArrayValueType<InputType>>> = new Set;
  #length: ReactivePrimitive<number> = (() => {
    const ref = new ReactivePrimitive(this.#value.length);
    this.bind(() => ref.value = this.#value.length);
    return ref;
  })();

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

  get length () {
    return this.#length;
  }

  get value () {
    return this.#value.slice(0);
  }

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

  /**
   * Works similar to `Array::fill()`, except inserted values are made recursively reactive. The section identified by start and end is filled with `value`. **Note** that inserted object values are not cloned, which may cause unintended behavior.

   * @param value  value to fill array section with
   * @param start  index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array.
   * @param end    index to stop filling the array at. If end is negative, it is treated as length+end.
   */
  fill (
    value: InputType | IArrayValueType<InputType>,
    start = 0,
    end = this.#value.length,
  ) {
    const length = end - start;
    this.splice(
      start,
      length,
      ...Array.from({length}, () => value),
    );
    return this;
  }

  /**
   * Equivalent to Array::filter(), except that it mutates the array in place. Removes the elements of the array that don't meet the condition specified in the callback function.
   *
   * @param callback The filter method calls the callback function once for each element in the array to determine if it should be removed.
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

  /**
   * Similar to `Array::map`, except that it mutates the array in place. Calls a defined callback function on each element of an array, and assigns the resulting element if it's different from the old one.
   *
   * @param callback The map method calls the callback function one time for each element in the array.
   */
  mutMap (
    callback: (value: IArrayValueType<InputType>, index: number, array: IArrayValueType<InputType>[]) => IArrayValueType<InputType>,
  ) {
    this.#value
      .flatMap((v, i, a) => {
        const newValue = callback(v, i, a);
        return newValue === v
          ? []
          : {index: i, value: newValue}
        ;
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

  /**
   * Works just like `Array::pop()`. Removes the last element from an array and returns it.
   */
  pop () {
    return this.splice(-1, 1)[0];
  }

  /**
   * Similar to `Array::push()`. Appends new element(s) to an array, and returns the new length of the array as a reactive number.
   */
  push (
    ...items: InputType[]
  ) {
    this.splice(this.#value.length, 0, ...items);
    return this.length;
  }

  /**
   * Works just like `Array::reverse()`. Reverses the elements of the array in place.
   */
  reverse () {
    this.setValue(this.#value.reverse());
    return this;
  }

  /**
   * Works just like `Array.shift()`. Removes the first element from an array and returns it.
   */
  shift () {
    return this.splice(0, 1)[0];
  }

  /**
   * Works just like `Array::sort()`. Sorts the array.
   * 
   * @param compareFn  Specifies a function that defines the sort order. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the array elements are converted to strings, then sorted according to each character's Unicode code point value.
   */
  sort (
    compareFn?: ((a: IArrayValueType<InputType>, b: IArrayValueType<InputType>) => number),
  ) {
    this.setValue(this.#value.sort(compareFn));
    return this;
  }

  /**
   * Similar to `Array::splice()`. Added items are implicitly made recursively reactive.
   * @param start        Where to start modifying the array
   * @param deleteCount  How many items to remove
   * @param items        Items to add to the array
   */
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
    }) as IArrayValueType<InputType>[]; // Fix for TS3.8, shouldn't be needed in 3.9

    const deletedItems = this.#value.splice(start, deleteCount, ...reactiveItems);

    const shiftedBy = items.length - deleteCount;
    if (shiftedBy) {
      for (let i = start + deleteCount; i < this.#indices.length; i++) {
        this.#indices[i].value += shiftedBy;
      }
    }

    const removedIndices = this.#indices.splice(
      start,
      deleteCount,
      ...items.map((_, i) => new ReactivePrimitive(i + start)),
    );
    for (const removedIndex of removedIndices) {
      removedIndex.value = -1;
    }

    for (const callback of this.#callbacks) {
      queueMicrotask(() => {
        callback(start, deleteCount, ...reactiveItems);
      });
    }
    
    return deletedItems;
  }

  /**
   * Force the the array to dispatch events to its callback. The event will simply say `0` items were removed at index `0`, with `0` items added. No equivalent on native Array prototype.
   */
  update () {
    for (const callback of this.#callbacks) {
      queueMicrotask(() => {
        callback(0, 0);
      });
    }
  }

  /**
   * Similar to `Array::unshift()`. Returns the new length after the item(s) have been inserted.
   */
  unshift (
    ...items: Array<InputType>
  ) {
    this.splice(0, 0, ...items);
    return this.length;
  }

  //#endregion

  // #region Non-mutating methods that return a new DestinyArray
  // Unless specified otherwise, these behave in a similar manner to the equivalent Array prototype methods, except that they return a reactive DestinyArray instead of a regular Array.

  /**
   * Similar to `Array::filter()`, except that it returns a readonly ReactiveArray, which is updated as the originating array is mutated. If you don't want this begavior, use `ReactiveArray.prototype.value.filter()` instead.
   */
  filter<S extends IArrayValueType<InputType>> (
    callback: (
      value: IArrayValueType<InputType>,
      index: number,
      array: IArrayValueType<InputType>[],
    ) => value is S,
  ): Readonly<ReactiveArray<S>> {
    const newArr: ReactiveArray<S> = new ReactiveArray(
      ...this.#value.filter(callback),
    );
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

  // TODO
  // flat (
  //   depth = 1,
  // ) {
  //   const newArr = new ReactiveArray(
  //     ...this.#value.flat(depth),
  //   );
  //   this.#callbacks.add(
  //     () => newArr.setValue(
  //       this.#value.flat(depth),
  //     ),
  //   );
  //   return newArr;
  // }

  // TODO
  // flatMap<U> (
  //   callback: (
  //     value: IArrayValueType<InputType>,
  //     index: ReactivePrimitive<number>,
  //     array: IArrayValueType<InputType>[],
  //   ) => U | ReadonlyArray<U>,
  // ) {
  //   const newArr = new ReactiveArray(
  //     ...this.#value.flatMap(callback)
  //   );
  //   this.pipe(() => {
  //     newArr.setValue(
  //       this.#value.flatMap(callback),
  //     );
  //   });
  //   return newArr;
  // }

  /**
   * Similar to `Array::map()`, except that it returns a readonly ReactiveArray, which gets gets updated with mapped values as the originating array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.map()` instead.
   */
  map<U> (
    callback: (
      value: IArrayValueType<InputType>,
      index: ReactivePrimitive<number>,
      array: this,
    ) => U,
  ): Readonly<ReactiveArray<U>> {
    const cb = (
      v: IArrayValueType<InputType>,
      i: number
    ) => callback(
      v,
      this.#indices[i],
      this,
    );

    const newArr = new ReactiveArray(
      ...this.#value.map(cb),
    );
    this.#callbacks.add(
      (
        index,
        deleteCount,
        ...values
      ) => newArr.splice(
        index,
        deleteCount,
        ...values.map(
          (v, i) => cb(v, i + index),
        ),
      ),
    );
    return newArr as Readonly<ReactiveArray<U>>;
  }

  /**
   * Returns a new reactive array with all the values of the array it's called on, without any of its callbacks. The new array is not tied to the original one in any capacity. This is a custom method, and an equivalent is not available in native Arrays.
   */
  clone () {
    return new ReactiveArray(...this.#value);
  }

  /**
   * Similar to `Array::slice()`, except that it returns a readonly ReactiveArray, whose values are bound to the orignating array. Furthermore, if the orignating array gets items inserted or removed in the range of the spliced section (inclusive), those items will get inserted to the returned array as well. If you don't want this behavior, use `ReactiveArray.prototype.value.slice()` instead.
   * 
   * **Note:** `ReactiveArray::slice(0)` is not a suitable way to clone a reactive array. The output array is readonly, and values from the original array are piped into it. Use `ReactiveArray::clone()` instead.
   */
  slice (
    start = 0,
    end = this.#value.length - 1,
  ) {
    const newArr = new ReactiveArray(
      ...this.#value.slice(start, end),
    );
    this.bind((
      index: number,
      deleteCount: number,
      ...values: IArrayValueType<InputType>[]
    ) => newArr.splice(
      index - start,
      deleteCount,
      ...values.slice(0, end - start - index),
    ));
    return newArr as Readonly<typeof newArr>;
  }

  /**
   * Similar to `Array::indexOf()`, except that it returns a readonly `ReactivePrimitive<number>`, which is updated as the array changes. The array is not searched again when the array changes. If nothing is found, `Readonly<ReactivePrimitive<-1>>` is returned, and it will never change. If something _is_ found, the index of that specific item will be kept up to date even when items are added or removed in a way that changes its index. If you don't want this behavior, use `ReactiveArray.prototype.value.indexOf()` instead. 
   * 
   * **NOTE:** _This method should **not** be used for checking if an array includes something: use `ReactiveArray::includes()` instead._
   */
  indexOf (
    ...args: Parameters<Array<IArrayValueType<InputType>>["indexOf"]>
  ): Readonly<ReactivePrimitive<number>> {
    const index = this.#value.indexOf(...args);
    return index === -1
      ? new ReactivePrimitive(-1)
      : this.#indices[index];
  }

  /**
   * Similar to `Array::lastIndexOf()`, except that it returns a readonly `ReactivePrimitive<number>`, which is updated as the array changes. The array is not searched again when the array changes. If nothing is found, `Readonly<ReactivePrimitive<-1>>` is returned, and it will never change. If something _is_ found, the index of that specific item will be kept up to date even when items are added or removed in a way that changes its index. If you don't want this behavior, use `ReactiveArray.prototype.value.lastIndexOf()` instead.
   */
  lastIndexOf (
    ...args: Parameters<Array<IArrayValueType<InputType>>["lastIndexOf"]>
  ): Readonly<ReactivePrimitive<number>> {
    const index = this.#value.lastIndexOf(...args);
    return index === -1
      ? new ReactivePrimitive(-1)
      : this.#indices[index];
  }

  /**
   * Similar to `Array::join()`, except that it returns a readonly `ReactivePrimitive<string>`, which is updated as the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.join()` instead.
   */
  join (
    ...args: Parameters<Array<IArrayValueType<InputType>>["join"]>
  ): Readonly<ReactivePrimitive<string>> {
    return this.pipe(
      () => this.#value.join(...args),
    );
  }

  /**
   * Similar to `Array::every()`, except that it returns a readonly `ReactivePrimitive<boolean>`, which is updated as the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.every()` instead.
   */
  every (
    ...args: Parameters<Array<IArrayValueType<InputType>>["every"]>
  ): Readonly<ReactivePrimitive<boolean>> {
    return this.pipe(
      () => this.#value.every(...args),
    );
  }

  /**
   * Similar to `Array::some()`, except that it returns a readonly `ReactivePrimitive<boolean>`, which is updated as the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.some()` instead.
   */
  some (
    ...args: Parameters<Array<IArrayValueType<InputType>>["some"]>
  ): Readonly<ReactivePrimitive<boolean>> {
    return this.pipe(
      () => this.#value.some(...args),
    );
  }

  /**
   * Returns a readonly `ReactivePrimitive<boolean>`, which is set to true when the callback returns true for some, but not all items in the array. Is updated as the array updates. This is a custom method, and a non-reactive variant is not available on the native Array prototype.
   */
  exclusiveSome (
    cb: (
      value: IArrayValueType<InputType>,
      index: number,
      array: IArrayValueType<InputType>[],
    ) => boolean,
  ): Readonly<ReactivePrimitive<boolean>> {
    return this.pipe(
      () => {
        const mappedValues = this.#value.map(cb);
        return (
          mappedValues.includes(false) &&
          mappedValues.includes(true)
        );
      },
    );
  }

  /**
   * Behaves akin to `Array::forEach()`, except will call the callback on newly added items as they're added. If you don't want this behavior, use `ReactiveArray.prototype.value.forEach()` instead.
   */
  forEach (
    ...args: Parameters<Array<IArrayValueType<InputType>>["forEach"]>
  ) {
    this.#value.forEach(...args);
    this.bind(
      (
        _index,
        _deleteCount,
        ...addedItems
      ) => addedItems.forEach(...args),
    );
  }

  /**
   * Similar to `Array::reduce()`, except that its return value is a readonly ReactivePrimitive and will be reevaluated every time the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.reduce()` for a non-reactive result.
   */
  reduce (
    ...args: Parameters<Array<IArrayValueType<InputType>>["reduce"]>
  ): Readonly<ReactivePrimitive<ReturnType<Array<IArrayValueType<InputType>>["reduce"]>>> {
    return this.pipe(() => this.#value.reduce(...args));
  }

  /**
   * Similar to `Array::reduceRight()`, except that its return value is a readonly ReactivePrimitive and will be reevaluated every time the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.reduceRight()` for a non-reactive result.
   */
  reduceRight (
    ...args: Parameters<Array<IArrayValueType<InputType>>["reduceRight"]>
  ): Readonly<ReactivePrimitive<ReturnType<Array<IArrayValueType<InputType>>["reduceRight"]>>> {
    return this.pipe(() => this.#value.reduceRight(...args));
  }

  /**
   * Works just like `Array::find()`. Doesn't return a reactive value.
   */
  find (
    ...args: Parameters<Array<IArrayValueType<InputType>>["find"]>
  ) {
    return this.#value.find(...args);
  }

  /**
   * Similar to `Array::findIndex`, except that it returns a `ReactivePrimitive<number>` whose value is updated if the index of the item changes as other items are added or removed from the array. The array is not searched again as it's mutated, however. If nothing is found, `Readonly<ReactivePrimitive<-1>>` is returned, and its value will never be updated. If you don't want this behavior, use `ReactiveArray.prototype.value.findIndex()` instead.
   */
  findIndex (
    ...args: Parameters<Array<IArrayValueType<InputType>>["findIndex"]>
  ) {
    const index = this.#value.findIndex(...args);

    return index === -1
      ? new ReactivePrimitive(-1)
      : this.#indices[index];
  }

  /**
   * Works similar to `Array::entries()`. The difference is that it returns a readonly ReactiveArray containing the entries and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.entries()` for a writable non-reactive array instead.
   */
  entries () {
    const array = new ReactiveArray(...this.#value.entries());
    this.bind((index, deleteCount, ...addedItems) => {
      array.splice(index, deleteCount, ...addedItems.entries());
    }, true);
    return array as Readonly<typeof array>;
  }

  /**
   * Works similar to `Array::keys()`. The difference is that it returns a readonly ReactiveArray containing the keys and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.keys()` for a writable non-reactive array instead.
   */
  keys () {
    const array = new ReactiveArray(...this.#value.keys());
    this.bind((index, deleteCount, ...addedItems) => {
      array.splice(index, deleteCount, ...addedItems.keys());
    }, true);
    return array as Readonly<typeof array>;
  }

  /**
   * Works similar to `Array::values()`. The difference is that it returns a readonly ReactiveArray containing the values and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.values()` for a writable non-reactive array instead.
   */
  values () {
    const array = new ReactiveArray(...this.#value.values());
    this.bind((index, deleteCount, ...addedItems) => {
      array.splice(index, deleteCount, ...addedItems.values());
    }, true);
    return array as Readonly<typeof array>;
  }

  /**
   * Works similar to `Array::includes()`. The difference is that it returns a readonly `ReactivePrimitive<boolean>` containing the result and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.includes()` for a plain boolean instead.
   */
  includes (
    ...args: Parameters<Array<IArrayValueType<InputType>>["includes"]>
  ): Readonly<ReactivePrimitive<boolean>> {
    return this.pipe(
      () => this.#value.includes(...args),
    );
  }

  //#endregion
};
