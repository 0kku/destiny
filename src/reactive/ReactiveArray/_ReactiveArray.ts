import { ReactivePrimitive } from "../../mod.js";
import { makeNonPrimitiveItemsReactive } from "./makeNonPrimitiveItemsReactive.js";
import { NotImplementedError } from "../../utils/NotImplementedError.js";
import { updateFilteredArray } from "./updateFilteredArray.js";
import { Indexable } from "./Indexable.js";
import type { TReactiveArrayCallback } from "../types/IReactiveArrayCallback.js";
import type { TArrayValueType } from "../types/IArrayValueType.js";
import type { TReactiveEntity } from "../types/IReactiveEntity.js";
import { computed, computeFunction } from "../computed.js";

type TArrayUpdateArguments<T> = [
  startEditingAt: number, 
  deleteCount: number,
  ...newElements: Array<T>
];

export type TMaskEntry = {
  index: number,
  show: boolean,
};

export type TMask = Array<TMaskEntry>;

/**
 * `ReactiveArray`s are reactive values that contain multiple values which can be updated and whose updates can be listened to. In general, `ReactiveArray`s behave very similar to native `Array`s. The main difference is, that most primitive values are given as `ReactivePrimitive`s and any immutable methods will return a new readonly `ReactiveArray`, whose values are tied to the original `ReactiveArray`. The class also provides a few custom convenience methods.
 */
export class ReactiveArray<InputType> extends Indexable<InputType> {
  /** An Array containing the current values of the ReactiveArray */
  readonly #__value: Array<TArrayValueType<InputType>>;
  /** A getter for an Array containing the current values of the ReactiveArray. Notifies computed values when it's being accessed. */
  get #value (): Array<TArrayValueType<InputType>> {
    if (computeFunction.current) {
      this.#callbacks.add(computeFunction.current);
    }

    return this.#__value;
  }

  /** An Array containing ReactivePrimitives for each index of the ReactiveArray */
  readonly #indices: Array<ReactivePrimitive<number>>;

  /** A Set containing all the callbacks to be called whenever the ReactiveArray is updated */
  readonly #callbacks: Set<TReactiveArrayCallback<TArrayValueType<InputType>>> = new Set;

  /** Size of the ReactiveArray as a ReactivePrimitive */
  readonly #length: Readonly<ReactivePrimitive<number>>;

  constructor (
    ...input: Array<InputType>
  ) {
    super();

    this.#__value = makeNonPrimitiveItemsReactive(
      input,
      this,
    );
    this.#length = computed(() => this.#value.length);
    this.#indices = input.map(
      (_, i) => new ReactivePrimitive(i),
    );
  }

  /**
   * Iterates over the values of the array, similar to how regular Arrays can be iterated over.
   */
  *[Symbol.iterator] (): Iterable<TArrayValueType<InputType>> {
    yield* this.#value;
  }

  /**
   * Iterates over the updates to the array. Can be used with for-await-of.
   */
  async *[Symbol.asyncIterator] (): AsyncIterable<TArrayUpdateArguments<TArrayValueType<InputType>>> {
    while (true) {
      yield await this.#nextUpdate();
    }
  }

  /**
   * Returns a promise that resolves when the next update fires, with the values the event fired with.
   */
  #nextUpdate (): Promise<TArrayUpdateArguments<TArrayValueType<InputType>>> {
    return new Promise<[number, number, ...Array<TArrayValueType<InputType>>]>(resolve => {
      const cb: TReactiveArrayCallback<TArrayValueType<InputType>> = (...props) => {
        resolve(props);
        this.#callbacks.delete(cb);
      };
      this.#callbacks.add(cb);
    });
  }

  /**
   * The length of the ReactiveArray, as a ReactivePrimitive which updates as the array is modified.
   */
  get length (): Readonly<ReactivePrimitive<number>> {
    return this.#length;
  }

  /**
   * Returns the current values of the ReactiveArray as a regular Array.
   */
  get value (): Array<TArrayValueType<InputType>> {
    return this.#value.slice(0);
  }

  /**
   * Replaces all the current values of the array with values of the provided array.
   * 
   * @param items array of items to replace the current ones with.
   */
  set value (
    items: ReadonlyArray<InputType | TArrayValueType<InputType>>,
  ) {
    this.splice(
      0,
      this.#value.length,
      ...items,
    );
  }

  /**
   * An alternative to using backet syntax `arr[index]` to access values. Bracket notation requires the Proxy, which slows down propety accesses, while this doesn't.
   * 
   * @param index index at which you want to access a value
   */
  get (
    index: number,
  ): TArrayValueType<InputType> {
    const i = (
      index < 0
      ? this.#value.length + index
      : index
    );

    return this.#value[i];
  }

  /**
   * An alternative to using backet syntax `arr[index] = value` to set values. Bracket notation requires the Proxy, which slows down propety accesses, while this doesn't.
   * 
   * @param index index at which you want to set a value
   * @param value value you want to set at the specified index
   */
  set (
    index: number,
    value: InputType,
  ): this {
    this.splice(index, 1, value);

    return this;
  }

  /**
   * Returns the arguments that a full, forced, update would for a callback. I.E. first item in the array is the index (`0`), second argument is delte count (current array length), and 3...n are the items currently in the array.
   */
  #argsForFullUpdate (): Parameters<TReactiveArrayCallback<TArrayValueType<InputType>>> {
    return [0, this.#value.length, ...this.#value];
  }
  
  /**
   * Creates a new ReactivePrimitive which is bound to the array it's called on. The value of the ReactivePrimitive is determined by the callback function provided, and is called every time theh array updates to update the value of the returned ReactivePrimitive.
   * 
   * @param callback The function to be called when the array is updated. It's called with `(startIndex, deleteCount, ...addedItems)`.
   */
  pipe<
    F extends TReactiveArrayCallback<TArrayValueType<InputType>, ReturnType<F>>,
  > (
    callback: F,
  ): Readonly<ReactivePrimitive<ReturnType<F>>> {
    const ref = new ReactivePrimitive(callback(...this.#argsForFullUpdate()));
    this.bind((...args) => {
      ref.value = callback(...args);
    }, true);
    return ref;
  }

  /**
   * Adds a listener to the array, which is called when the array is modified in some capacity.
   * 
   * @param callback The function to be called when the array is updated. It's called with `(startIndex, deleteCount, ...addedItems)`.
   * @param noFirstRun Default: false. Determines whether the callback function should be called once when the listener is first added.
   */
  bind (
    callback: TReactiveArrayCallback<TArrayValueType<InputType>>,
    noFirstRun = false,
  ): this {
    this.#callbacks.add(callback);
    if (!noFirstRun) {
      callback(0, 0, ...this.#value);
    }
    return this;
  }

  /**
   * Removes a listener that was added using `ReactiveArray::bind()`.
   * 
   * @param callback The callback function to be unbound (removed from the array's update callbacks). Similar to EventListeners, it needs to be a reference to the same callaback function that was previously added.
   */
  unbind (
    callback: TReactiveArrayCallback<TArrayValueType<InputType>>,
  ): this {
    this.#callbacks.delete(callback);
    return this;
  }

  //#region Mutating methods
  // Unless specified otherwise, these methods follow the signature of equivalent Array prototype methods.

  /**
   * Conbines the array with one or more other arrays, or other values.
   * 
   * Similar to `Array::concat()`, except that it returns a readonly ReactiveArray. It accepts arrays, ReactiveArrays, ReactivePrimitives, or other items as parameters. Any ReactiveArrays or ReactivePrimitives will be tracked, and the resulting ReacativeArray will be updated whenever they get updated.
   * 
   * @param items The items to be tacked onto the original array.
   */
  concat<
    U,
    K extends TArrayValueType<InputType> | U,
  > (
    ...items: Array<K | Array<K> | ReactivePrimitive<K> | ReactiveArray<K>>
  ): Readonly<ReactiveArray<U | TArrayValueType<InputType>>> {
    const newArr = this.clone() as ReactiveArray<TArrayValueType<InputType> | U>;
    this.bind(newArr.splice.bind(newArr));
    const lengthTally: Array<{value: number}> = [
      this.length,
    ];
    function currentOffset (
      cutoff: number,
      index = 0,
    ) {
      let tally = index;
      for (let i = 0; i < cutoff; i++) {
        tally += lengthTally[i].value;
      }
      return tally;
    }
    for (const [i, item] of items.entries()) {
      if (item instanceof ReactiveArray) {
        item.bind(
          (
            index,
            deleteCount,
            ...values
          ) => newArr.splice(
            currentOffset(i, index),
            deleteCount,
            ...values
          ),
        );
        lengthTally.push(item.length);
      } else if (item instanceof ReactivePrimitive) {
        item.bind(
          value => newArr.splice(
            currentOffset(i),
            1,
            value,
          ),
        );
        lengthTally.push({
          value: 1,
        });
      } else if (Array.isArray(item)) {
        newArr.splice(
          currentOffset(i),
          0,
          ...item,
        );
        lengthTally.push({
          value: item.length,
        });
      } else {
        newArr.splice(
          currentOffset(i),
          0,
          item,
        );
        lengthTally.push({
          value: 1,
        });
      }
    }
    return newArr;
  }

  /**
   * Works just like `Array::copyWithin()`. Returns the this object after shallow-copying a section of the array identified by start and end to the same array starting at position target
   * 
   * @param target Index where to start copying to. If target is negative, it is treated as length+target where length is the length of the array.
   * @param start Where to start copying from. If start is negative, it is treated as length+start. Default: `0`. 
   * @param end Where to stop copying from. If end is negative, it is treated as length+end. Default: `this.length.value`
   */
  copyWithin (
    target: number,
    start = 0,
    end = this.#value.length,
  ): this {
    const {length} = this.#value;
    target = (target + length) % length;
    start = (start + length) % length;
    end = (end + length) % length;
    const deleteCount = Math.min(
      length - start,
      end - start,
    );
    this.splice(
      target,
      deleteCount,
      ...this.#value.slice(
        start,
        deleteCount + start,
      ),
    );
    return this;
  }

  /**
   * Works similar to `Array::fill()`, except inserted values are made recursively reactive. The section identified by start and end is filled with `value`. **Note** that inserted object values are not cloned, which may cause unintended behavior.
   * 
   * @param value  value to fill array section with
   * @param start  index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array.
   * @param end    index to stop filling the array at. If end is negative, it is treated as length+end.
   */
  fill (
    value: InputType | TArrayValueType<InputType>,
    start = 0,
    end = this.#value.length,
  ): this {
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
    callback: (value: TArrayValueType<InputType>, index: number, array: Array<TArrayValueType<InputType>>) => boolean,
  ): this {
    this.#value
      .flatMap((v, i, a) =>  callback(v, i, a) ? [] : i)
      .reduce<Array<[number, number]>>(
        (acc, indexToDelete) => {
          if (!acc.length || acc[0][0] + acc[0][1] !== indexToDelete) {
            acc.unshift([indexToDelete,  1]);
          } else {
            acc[0][1]++;
          }
          return acc;
        },
        [],
      )
      .forEach(args => {
        this.splice(...args);
      });
    return this;
  }

  /**
   * Similar to `Array::map`, except that it mutates the array in place. Calls a defined callback function on each element of an array, and assigns the resulting element if it's different from the old one.
   *
   * @param callback The map method calls the callback function one time for each element in the array.
   */
  mutMap (
    callback: (value: TArrayValueType<InputType>, index: number, array: Array<TArrayValueType<InputType>>) => TArrayValueType<InputType>,
  ): this {
    this.#value
      .flatMap((v, i, a) => {
        const newValue = callback(v, i, a);
        return newValue === v
          ? []
          : {index: i, value: newValue}
        ;
      })
      .reduce<Array<[number, number, ...Array<TArrayValueType<InputType>>]>>(
        (acc, {index, value}) => {
          if (!acc.length || acc[0][0] + acc[0][1] !== index) {
            acc.unshift([index, 1, value]);
          } else {
            acc[0][1]++;
            acc[0].push(value);
          }
          return acc;
        },
        [],
      )
      .forEach(args => {
        this.splice(...args);
      });
    return this;
  }

  /**
   * Works just like `Array::pop()`. Removes the last element from an array and returns it.
   */
  pop (): TArrayValueType<InputType> {
    return this.splice(-1, 1)[0];
  }

  /**
   * Similar to `Array::push()`. Appends new element(s) to an array, and returns the new length of the array as a reactive number.
   */
  push (
    ...items: Array<InputType>
  ): Readonly<ReactivePrimitive<number>> {
    this.splice(this.#value.length, 0, ...items);

    return this.length;
  }

  /**
   * Works just like `Array::reverse()`. Reverses the elements of the array in place.
   */
  reverse (): this {
    this.value = this.#value.reverse();

    return this;
  }

  /**
   * Works just like `Array.shift()`. Removes the first element from an array and returns it.
   */
  shift (): TArrayValueType<InputType> {
    return this.splice(0, 1)[0];
  }

  /**
   * Works just like `Array::sort()`. Sorts the array.
   * 
   * @param compareFn  Specifies a function that defines the sort order. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the array elements are converted to strings, then sorted according to each character's Unicode code point value.
   */
  sort (
    compareFn?: ((a: TArrayValueType<InputType>, b: TArrayValueType<InputType>) => number),
  ): this {
    this.value = this.#value.sort(compareFn);

    return this;
  }

  /**
   * Similar to `Array::splice()`. Added items are implicitly made recursively reactive.
   * 
   * @param start        Where to start modifying the array
   * @param deleteCount  How many items to remove
   * @param items        Items to add to the array
   */
  splice (
    start: number,
    deleteCount: number = this.#value.length - start,
    ...items: Array<InputType | TArrayValueType<InputType>>
  ): Array<TArrayValueType<InputType>> {
    if (start > this.#value.length) {
      throw new RangeError(`Out of bounds assignment: tried to assign to index ${start}, but array length was only ${this.#value.length}. Sparse arrays are not allowed. Consider using .push() instead.`);
    }
    
    this.#adjustIndices(start, deleteCount, items);
    const reactiveItems = makeNonPrimitiveItemsReactive(items, this);
    const deletedItems = this.#value.splice(start, deleteCount, ...reactiveItems);
    this.#dispatchUpdateEvents(start, deleteCount, reactiveItems);
    
    return deletedItems;
  }

  #dispatchUpdateEvents (
    start: number,
    deleteCount: number,
    newItems: Array<TArrayValueType<InputType>> = [],
  ): void {
    for (const callback of this.#callbacks) {
      callback(start, deleteCount, ...newItems);
    }
  }

  /**
   * Updates the indices of each item whose index changed due to the update. Indices of removed items will become `-1`. Also inserts in new indices as `ReactivePrimitive<number>` for any added items.
   * 
   * @param start Index at which the ReactiveArray started changing
   * @param deleteCount How many items were deleted
   * @param items Items that were added
   */
  #adjustIndices (
    start: number,
    deleteCount: number,
    items: Array<InputType | TArrayValueType<InputType>>,
  ): void {
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
  }

  /**
   * Force the the array to dispatch events to its callback. The event will simply say `0` items were removed at index `0`, with `0` items added. No equivalent on native Array prototype.
   */
  update (): this {
    this.#dispatchUpdateEvents(0, 0);

    return this;
  }

  /**
   * Similar to `Array::unshift()`. Returns the new length after the item(s) have been inserted.
   */
  unshift (
    ...items: Array<InputType>
  ): Readonly<ReactivePrimitive<number>> {
    this.splice(0, 0, ...items);
    return this.length;
  }

  //#endregion

  // #region Non-mutating methods that return a new ReaectiveArray
  // Unless specified otherwise, these behave in a similar manner to the equivalent Array prototype methods, except that they return a reactive ReaectiveArray instead of a regular Array.

  /**
   * Similar to `Array::filter()`, except that it returns a readonly ReactiveArray, which is updated as the originating array is mutated. If you don't want this begavior, use `ReactiveArray.prototype.value.filter()` instead.
   */
  filter (
    callback: (
      value: TArrayValueType<InputType>,
      index: number,
      array: Array<TArrayValueType<InputType>>,
    ) => boolean,
    dependencies: ReadonlyArray<TReactiveEntity<any>> = [],
  ): Readonly<ReactiveArray<TArrayValueType<InputType>>> {
    
    const filteredArray: ReactiveArray<TArrayValueType<InputType>> = new ReactiveArray;

    const maskArray: TMask = [];

    dependencies.forEach(dependency => {
      dependency.bind(() => updateFilteredArray(
        callback,
        this.#value,
        filteredArray,
        maskArray,
      ), true);
    });

    this.bind((start, deletes, ...items) => {
      if (deletes === 0 && items.length === 0) {
        updateFilteredArray(
          callback,
          this.#value,
          filteredArray,
          maskArray,
        );
      }

      const lastInMask = maskArray.slice(0, start).reverse().find(v => v.show);
      const newItems: Array<TArrayValueType<InputType>> = [];
      let currentIndex = (lastInMask?.index ?? -1);
      const deletedMaskEntries =
        deletes
        ? maskArray.splice(start, deletes)
        : []
      ;
      for (const [i, item] of items.entries()) {
        const sourceIndex = start + i;
        const showThis = callback(item, sourceIndex, this.#value);
        if (showThis) {
          currentIndex++;
        }
        const current = {
          index: currentIndex,
          show: showThis,
        };
        maskArray.splice(sourceIndex, 0, current);
        if (showThis) {
          newItems.push(item);
        }
      }

      const deletedItemCount = deletedMaskEntries.filter(v => v.show).length;
      if (newItems.length || deletedItemCount) {
        filteredArray.splice(
          (lastInMask?.index ?? -1) + 1,
          deletedItemCount,
          ...newItems,
        );
      }
      const shiftTailBy = newItems.length - deletedItemCount;
      if (shiftTailBy) {
        for (let i = start + items.length; i < maskArray.length; i++) {
          maskArray[i].index += shiftTailBy;
        }
      }
    });
    
    return filteredArray;
  }

  // TODO
  flat (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    _depth = 1,
  ): never {
    throw new NotImplementedError("See https://github.com/0kku/destiny/issues/1");
    // const newArr = new ReactiveArray(
    //   ...this.#value.flat(depth),
    // );
    // this.#callbacks.add(
    //   () => newArr.setValue(
    //     this.#value.flat(depth),
    //   ),
    // );
    // return newArr;
  }

  // TODO
  flatMap<U> (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    _callback: (
      value: TArrayValueType<InputType>,
      index: ReactivePrimitive<number>,
      array: Array<TArrayValueType<InputType>>,
    ) => U | ReadonlyArray<U>,
  ): never {
    throw new NotImplementedError("See https://github.com/0kku/destiny/issues/1");
    // const newArr = new ReactiveArray(
    //   ...this.#value.flatMap(callback)
    // );
    // this.pipe(() => {
    //   newArr.setValue(
    //     this.#value.flatMap(callback),
    //   );
    // });
    // return newArr;
  }

  /**
   * Similar to `Array::map()`, except that it returns a readonly ReactiveArray, which gets gets updated with mapped values as the originating array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.map()` instead.
   */
  map<U> (
    callback: (
      value: TArrayValueType<InputType>,
      index: ReactivePrimitive<number>,
      array: this,
    ) => U,
  ): Readonly<ReactiveArray<U>> {
    const cb = (
      v: TArrayValueType<InputType>,
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
  clone (): ReactiveArray<TArrayValueType<InputType>> {
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
  ): Readonly<ReactiveArray<TArrayValueType<InputType>>> {
    const newArr = new ReactiveArray(
      ...this.#value.slice(start, end),
    );
    this.bind((
      index: number,
      deleteCount: number,
      ...values: Array<TArrayValueType<InputType>>
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
    ...args: Parameters<Array<TArrayValueType<InputType>>["indexOf"]>
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
    ...args: Parameters<Array<TArrayValueType<InputType>>["lastIndexOf"]>
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
    ...args: Parameters<Array<TArrayValueType<InputType>>["join"]>
  ): Readonly<ReactivePrimitive<string>> {
    return this.pipe(
      () => this.#value.join(...args),
    );
  }

  /**
   * Similar to `Array::every()`, except that it returns a readonly `ReactivePrimitive<boolean>`, which is updated as the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.every()` instead.
   */
  every (
    ...args: Parameters<Array<TArrayValueType<InputType>>["every"]>
  ): Readonly<ReactivePrimitive<boolean>> {
    return this.pipe(
      () => this.#value.every(...args),
    );
  }

  /**
   * Similar to `Array::some()`, except that it returns a readonly `ReactivePrimitive<boolean>`, which is updated as the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.some()` instead.
   */
  some (
    ...args: Parameters<Array<TArrayValueType<InputType>>["some"]>
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
      value: TArrayValueType<InputType>,
      index: number,
      array: Array<TArrayValueType<InputType>>,
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
    ...args: Parameters<Array<TArrayValueType<InputType>>["forEach"]>
  ): void {
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
    ...args: Parameters<Array<TArrayValueType<InputType>>["reduce"]>
  ): Readonly<ReactivePrimitive<ReturnType<Array<TArrayValueType<InputType>>["reduce"]>>> {
    return this.pipe(() => this.#value.reduce(...args));
  }

  /**
   * Similar to `Array::reduceRight()`, except that its return value is a readonly ReactivePrimitive and will be reevaluated every time the array changes. If you don't want this behavior, use `ReactiveArray.prototype.value.reduceRight()` for a non-reactive result.
   */
  reduceRight (
    ...args: Parameters<Array<TArrayValueType<InputType>>["reduceRight"]>
  ): Readonly<ReactivePrimitive<ReturnType<Array<TArrayValueType<InputType>>["reduceRight"]>>> {
    return this.pipe(() => this.#value.reduceRight(...args));
  }

  /**
   * Works just like `Array::find()`. Doesn't return a reactive value.
   */
  find (
    ...args: Parameters<Array<TArrayValueType<InputType>>["find"]>
  ): ReturnType<Array<TArrayValueType<InputType>>["find"]> {
    return this.#value.find(...args);
  }

  /**
   * Similar to `Array::findIndex`, except that it returns a `ReactivePrimitive<number>` whose value is updated if the index of the item changes as other items are added or removed from the array. The array is not searched again as it's mutated, however. If nothing is found, `Readonly<ReactivePrimitive<-1>>` is returned, and its value will never be updated. If you don't want this behavior, use `ReactiveArray.prototype.value.findIndex()` instead.
   */
  findIndex (
    ...args: Parameters<Array<TArrayValueType<InputType>>["findIndex"]>
  ): Readonly<ReactivePrimitive<ReturnType<Array<TArrayValueType<InputType>>["findIndex"]>>> {
    const index = this.#value.findIndex(...args);

    return index === -1
      ? new ReactivePrimitive(-1)
      : this.#indices[index];
  }

  /**
   * Works similar to `Array::entries()`. The difference is that it returns a readonly ReactiveArray containing the entries and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.entries()` for a writable non-reactive array instead.
   */
  entries (): Readonly<ReactiveArray<[
    index: number,
    value: TArrayValueType<InputType>,
  ]>> {
    const array = new ReactiveArray(...this.#value.entries());
    this.bind((index, deleteCount, ...addedItems) => {
      array.splice(index, deleteCount, ...addedItems.entries());
    }, true);

    return array as Readonly<typeof array>;
  }

  /**
   * Works similar to `Array::keys()`. The difference is that it returns a readonly ReactiveArray containing the keys and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.keys()` for a writable non-reactive array instead.
   */
  keys (): Readonly<ReactiveArray<number>> {
    const array = new ReactiveArray(...this.#value.keys());
    this.bind((index, deleteCount, ...addedItems) => {
      array.splice(index, deleteCount, ...addedItems.keys());
    }, true);

    return array as Readonly<typeof array>;
  }

  /**
   * Works similar to `Array::values()`. The difference is that it returns a readonly ReactiveArray containing the values and is updated as the original array is updated. If you don't want this behavior, use `ReactiveArray.prototype.value.values()` for a writable non-reactive array instead.
   */
  values (): Readonly<ReactiveArray<TArrayValueType<InputType>>> {
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
    ...args: Parameters<Array<TArrayValueType<InputType>>["includes"]>
  ): Readonly<ReactivePrimitive<boolean>> {
    return this.pipe(
      () => this.#value.includes(...args),
    );
  }

  //#endregion
}
