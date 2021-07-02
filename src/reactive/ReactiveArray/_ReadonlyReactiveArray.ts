import { ReactiveArray } from "./_ReactiveArray.js";
import { weaklyHeldDependencies, stronglyHeldDependencies } from "./arrayDependencyCaches.js";
import { makeNonPrimitiveItemsReactive } from "./makeNonPrimitiveItemsReactive.js";
import { internalArrays } from "./internalArrays.js";
import { splicers } from "./splicers.js";
import { flatten } from "./flatten.js";
import { updateFilteredArray } from "./updateFilteredArray.js";
import { computed, computedConsumer } from "../computed.js";
import { ReactiveValue } from "../ReactiveValue/_ReactiveValue.js";
import { internalSetReactiveValue } from "../ReactiveValue/internalSetReactiveValue.js";
import { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.js";
import { concatIterators } from "../../utils/concatIterators.js";
import { throwExpression } from "../../utils/throwExpression.js";
import { IterableWeakMap } from "../../utils/IterableWeakMap.js";
import { WeakMultiRef } from "../../utils/WeakMultiRef.js";
import type { TReactiveArrayCallback } from "./TReactiveArrayCallback.js";
import type { TArrayUpdateArguments } from "./TArrayUpdateArguments.js";
import type { TUnwrapReactiveArray } from "./TUnwrapReactiveArray.js";
import type { TArrayValueType } from "./TArrayValueType.js";
import type { TReactiveEntity } from "../types/TReactiveEntity.js";
import type { TMask } from "./TMask.js";

/**
 * `ReadonlyReactiveArray`s are reactive values that contain multiple values and whose updates can be listened to. In general, `ReadonlyReactiveArray`s behave very similar to native `ReadonlyArray`s. The main difference is, that most primitive values are given as `ReactiveValue`s and methods will return a new `ReadonlyReactiveArray`, whose values are tied to the original `ReadonlyReactiveArray`. The class also provides a few custom convenience methods.
 */
 export class ReadonlyReactiveArray<InputType> {
  /** An Array containing the current values of the ReactiveArray */
  readonly #__value: Array<TArrayValueType<InputType>>;
  /** A getter for an Array containing the current values of the ReactiveArray. Notifies computed values when it's being accessed. */
  get #value (): Array<TArrayValueType<InputType>> {
    if (computedConsumer) {
      const {fn, consumer} = computedConsumer;
      consumer.dependencies.set(this, fn);
      this.#consumers.set(
        consumer, 
        fn,
      );

      // this.#callbacks.add(computedConsumer.fn);
    }

    return this.#__value;
  }

  /** An Array containing ReactiveValues for each index of the ReadonlyReactiveArray */
  readonly #indices: Array<ReactiveValue<number>>;

  /** A Set containing all the callbacks to be called whenever the ReadonlyReactiveArray is updated */
  readonly #callbacks: Set<TReactiveArrayCallback<TArrayValueType<InputType>>> = new Set;

  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly #consumers = new IterableWeakMap<object, TReactiveArrayCallback<TArrayValueType<InputType>>>();

  /** Size of the ReactiveArray as a ReactiveValue */
  readonly #length: ReadonlyReactiveValue<number>;

  constructor (
    ...input: Array<InputType>
  ) {
    this.#__value = makeNonPrimitiveItemsReactive(
      input,
      this,
    );
    this.#length = computed(() => this.#value.length);
    this.#indices = input.map(
      (_, i) => new ReactiveValue(i),
    );
    splicers.set(this, (...args) => this.#splice(...args));
    internalArrays.set(this, this.#__value);
  }

  /**
   * When the object is attempted to be serialized using JSON.serialize(), the current value of `this.value` is returned.
   */
  toJSON (): Array<TArrayValueType<InputType>> {
    return this.value;
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
   * The length of the ReactiveArray, as a ReactiveValue which updates as the array is modified.
   */
  get length (): ReadonlyReactiveValue<number> {
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
    this.#splice(
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
  ): TArrayValueType<InputType> | undefined {
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
    this.#splice(index, 1, value);

    return this;
  }

  /**
   * Returns the arguments that a full, forced, update would for a callback. I.E. first item in the array is the index (`0`), second argument is delte count (current array length), and 3...n are the items currently in the array.
   */
  #argsForFullUpdate (): Parameters<TReactiveArrayCallback<TArrayValueType<InputType>>> {
    return [0, this.#value.length, ...this.#value];
  }
  
  /**
   * Creates a new `ReactiveValue` which is bound to the array it's called on. The value of the `ReactiveValue` is determined by the callback function provided, and is called every time theh array updates to update the value of the returned `ReactiveValue`.
   * 
   * @param callback The function to be called when the array is updated. It's called with `(startIndex, deleteCount, ...addedItems)`.
   */
  pipe <
    F extends TReactiveArrayCallback<TArrayValueType<InputType>, ReturnType<F>>,
  > (
    callback: F,
  ): ReadonlyReactiveValue<ReturnType<F>> {
    const reactor = new ReadonlyReactiveValue(callback(...this.#argsForFullUpdate()));
    const fn = () => internalSetReactiveValue.get(reactor)(callback(...this.#argsForFullUpdate()));
    reactor.dependencies.set(this, fn);
    this.#consumers.set(
      reactor,
      fn,
    );

    return reactor;
  }

  /**
   * Adds a listener to the array, which is called when the array is modified in some capacity.
   * 
   * @param callback The function to be called when the array is updated. It's called with `(startIndex, deleteCount, ...addedItems)`.
   * @param noFirstRun Default: false. Determines whether the callback function should be called once when the listener is first added.
   */
  bind (
    callback: TReactiveArrayCallback<TArrayValueType<InputType>>,
    options: {
      noFirstRun?: boolean,
      // eslint-disable-next-line @typescript-eslint/ban-types
      dependents?: ReadonlyArray<object>,
    } = {},
  ): this {
    if (!options.noFirstRun) {
      callback(0, 0, ...this.#value);
    }

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

  /**
   * Removes a listener that was added using `ReactiveArray::bind()`.
   * 
   * @param callback The callback function to be unbound (removed from the array's update callbacks). Similar to EventListeners, it needs to be a reference to the same callaback function that was previously added.
   */
  unbind (
    callback: TReactiveArrayCallback<TArrayValueType<InputType>>,
  ): this {
    this.#callbacks.delete(callback);
    stronglyHeldDependencies.delete(callback);

    return this;
  }

 /**
  * Similar to `Array::splice()`. Added items are implicitly made recursively reactive.
  * 
  * @param start        Where to start modifying the array
  * @param deleteCount  How many items to remove
  * @param items        Items to add to the array
  */
  #splice (
    start: number,
    deleteCount: number = this.#value.length - start,
    ...items: Array<InputType | TArrayValueType<InputType>>
  ): Array<TArrayValueType<InputType>> {
    if (start > this.#value.length) {
      throw new RangeError(`Out of bounds assignment: tried to assign to index ${start}, but array length was only ${this.#value.length}. Sparse arrays are not allowed. Consider using .push() instead.`);
    }

    if (start < 0) {
      start += this.#value.length;
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
    newItems: ReadonlyArray<TArrayValueType<InputType>> = [],
  ): void {
    const callbacks = concatIterators(
      this.#callbacks.values(),
      this.#consumers.values(),
    );
    for (const callback of callbacks) {
      callback(start, deleteCount, ...newItems);
    }
  }
 
  /**
   * Updates the indices of each item whose index changed due to the update. Indices of removed items will become `-1`. Also inserts in new indices as `ReactiveValue<number>` for any added items.
   * 
   * @param start Index at which the ReactiveArray started changing
   * @param deleteCount How many items were deleted
   * @param items Items that were added
   */
  #adjustIndices (
    start: number,
    deleteCount: number,
    items: ReadonlyArray<InputType | TArrayValueType<InputType>>,
  ): void {
    const shiftedBy = items.length - deleteCount;
    if (shiftedBy) {
      for (let i = start + deleteCount; i < this.#indices.length; i++) {
        this.#indices[i]!.value += shiftedBy;
      }
    }
 
    const removedIndices = this.#indices.splice(
      start,
      deleteCount,
      ...items.map((_, i) => new ReactiveValue(i + start)),
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
   * Similar to `Array::filter()`, except that it returns a `ReadonlyReactiveArray`, which is updated as the originating array is mutated. If you don't want this begavior, use `ReadonlyReactiveArray.prototype.value.filter()` instead.
   */
  filter (
    callback: (
      value: TArrayValueType<InputType>,
      index: number,
      array: Array<TArrayValueType<InputType>>,
    ) => boolean,
    dependencies: ReadonlyArray<TReactiveEntity<any>> = [],
  ): ReadonlyReactiveArray<TArrayValueType<InputType>> {
    
    const filteredArray: ReactiveArray<TArrayValueType<InputType>> = new ReactiveArray;

    const maskArray: TMask = [];

    dependencies.forEach(dependency => {
      dependency.bind(
        () => updateFilteredArray(
          callback,
          this.#value,
          filteredArray,
          maskArray,
        ), 
        {
          noFirstRun: true,
          dependents: [filteredArray],
        },
      );
    });

    this.bind(
      (start, deletes, ...items) => {
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
          filteredArray.#splice(
            (lastInMask?.index ?? -1) + 1,
            deletedItemCount,
            ...newItems,
          );
        }
        const shiftTailBy = newItems.length - deletedItemCount;
        if (shiftTailBy) {
          for (let i = start + items.length; i < maskArray.length; i++) {
            maskArray[i]!.index += shiftTailBy;
          }
        }
      },
      {
        dependents: [filteredArray],
      },
    );
    
    return filteredArray.readonly;
  }

  /**
   * Similar to `Array::flat()`, except that it does **not** accept a depth parameter, and it returns a `ReadonlyReactiveArray` which gets gets updated with new values as the originating array is updated.
   * 
   * ! This metod does not optimize changes. When source canges in any way, it recomputes every value, even when it theoretically wouldn't need to.
   */
  flat (): ReadonlyReactiveArray<TUnwrapReactiveArray<TArrayValueType<InputType>>> {
    const newArray = new ReactiveArray(...flatten(this.#value));
    this.bind(
      () => newArray.value = flatten(this.#value),
      {
        noFirstRun: false,
        dependents: [newArray],
      },
    );
    return newArray.readonly;
  }
  
  /**
   * Similar to `Array::flatMap()`, except that it returns a `ReadonlyReactiveArray`, which gets gets updated with new values as the originating array is updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.flatMap()` instead.
   * 
   * ! This metod does not optimize changes. When source canges in any way, it recomputes every value, even when it theoretically wouldn't need to.
   */
  flatMap<U> (
    callback: (
      value: TArrayValueType<InputType>,
      index: number,
      array: Array<TArrayValueType<InputType>>,
    ) => U | ReadonlyArray<U>,
  ): ReadonlyReactiveArray<TUnwrapReactiveArray<U>> {
    const flatMap = () => flatten(this.#value.flatMap(callback));

    const newArray = new ReactiveArray(...flatMap());
    this.bind(
      () => newArray.value = flatMap(),
      {
        noFirstRun: false,
        dependents: [newArray],
      },
    );

    return newArray.readonly;
  }

  /**
   * Similar to `Array::map()`, except that it returns a `ReadonlyReactiveArray`, which gets gets updated with mapped values as the originating array is updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.map()` instead.
   */
  map<U> (
    callback: (
      value: TArrayValueType<InputType>,
      index: ReadonlyReactiveValue<number>,
      array: this,
    ) => U,
  ): ReadonlyReactiveArray<U> {
    const cb = (
      v: TArrayValueType<InputType>,
      i: number
    ) => callback(
      v,
      this.#indices[i]?.readonly ?? throwExpression("Internal error: lost track of index"),
      this,
    );

    const newArray = new ReadonlyReactiveArray(
      ...this.#value.map(cb),
    );
    this.#callbacks.add(
      (
        index,
        deleteCount,
        ...values
      ) => splicers.get(newArray)(
        index,
        deleteCount,
        ...values.map(
          (v, i) => cb(v, i + index),
        ),
      ),
    );

    return newArray;
  }

  /**
   * Returns a new reactive array with all the values of the array it's called on, without any of its callbacks. The new array is not tied to the original one in any capacity. This is a custom method, and an equivalent is not available in native Arrays.
   */
  clone (): ReactiveArray<TArrayValueType<InputType>> {
    return new ReactiveArray(...this.#value);
  }

  /**
   * Similar to `Array::slice()`, except that it returns a `ReadonlyReactiveArray`, whose values are bound to the orignating array. Furthermore, if the orignating array gets items inserted or removed in the range of the spliced section (inclusive), those items will get inserted to the returned array as well. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.slice()` instead.
   * 
   * **Note:** `ReactiveArray::slice(0)` is not a suitable way to clone a reactive array. The output array is readonly, and values from the original array are piped into it. Use `ReactiveArray::clone()` instead.
   */
  slice (
    start = 0,
    end = this.#value.length - 1,
  ): ReadonlyReactiveArray<TArrayValueType<InputType>> {
    const newArray = new ReactiveArray(
      ...this.#value.slice(start, end),
    );
    this.bind(
      () => newArray.value = this.#value.slice(start, end),
      {
        dependents: [newArray],
      },
    );
    return newArray.readonly;
  }

  /**
   * Similar to `Array::indexOf()`, except that it returns a `ReadonlyReactiveValue<number>`, which is updated as the array changes. The array is not searched again when the array changes. If nothing is found, `ReadonlyReactiveValue<-1>` is returned, and it will never change. If something _is_ found, the index of that specific item will be kept up to date even when items are added or removed in a way that changes its index. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.indexOf()` instead. 
   * 
   * **NOTE:** _This method should **not** be used for checking if an array includes something: use `ReactiveArray::includes()` instead._
   */
  indexOf (
    ...args: Parameters<Array<TArrayValueType<InputType>>["indexOf"]>
  ): ReadonlyReactiveValue<number> {
    const index = this.#value.indexOf(...args);
    return this.#indices[index]?.readonly ?? new ReadonlyReactiveValue(-1);
  }

  /**
   * Similar to `Array::lastIndexOf()`, except that it returns a `ReadonlyReactiveValue<number>`, which is updated as the array changes. The array is not searched again when the array changes. If nothing is found, `ReadonlyReactiveValue<-1>` is returned, and it will never change. If something _is_ found, the index of that specific item will be kept up to date even when items are added or removed in a way that changes its index. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.lastIndexOf()` instead.
   */
  lastIndexOf (
    ...args: Parameters<Array<TArrayValueType<InputType>>["lastIndexOf"]>
  ): ReadonlyReactiveValue<number> {
    const index = this.#value.lastIndexOf(...args);
    return this.#indices[index]?.readonly ?? new ReadonlyReactiveValue(-1);
  }

  /**
   * Similar to `Array::join()`, except that it returns a `ReadonlyReactiveValue<string>`, which is updated as the array changes. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.join()` instead.
   */
  join (
    ...args: Parameters<Array<TArrayValueType<InputType>>["join"]>
  ): ReadonlyReactiveValue<string> {
    return this.pipe(
      () => this.#value.join(...args),
    );
  }

  /**
   * Similar to `Array::every()`, except that it returns a `ReadonlyReactiveValue<boolean>`, which is updated as the array changes. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.every()` instead.
   */
  every (
    ...args: Parameters<Array<TArrayValueType<InputType>>["every"]>
  ): ReadonlyReactiveValue<boolean> {
    return this.pipe(
      () => this.#value.every(...args),
    );
  }

  /**
   * Similar to `Array::some()`, except that it returns a `ReadonlyReactiveValue<boolean>`, which is updated as the array changes. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.some()` instead.
   */
  some (
    ...args: Parameters<Array<TArrayValueType<InputType>>["some"]>
  ): ReadonlyReactiveValue<boolean> {
    return this.pipe(
      () => this.#value.some(...args),
    );
  }

  /**
   * Returns a `ReadonlyReactiveValue<boolean>`, which is set to true when the callback returns true for some, but not all items in the array. Is updated as the array updates. This is a custom method, and a non-reactive variant is not available on the native Array prototype.
   */
  exclusiveSome (
    cb: (
      value: TArrayValueType<InputType>,
      index: number,
      array: Array<TArrayValueType<InputType>>,
    ) => boolean,
  ): ReadonlyReactiveValue<boolean> {
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
   * Behaves akin to `Array::forEach()`, except will call the callback on newly added items as they're added. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.forEach()` instead.
   */
  forEach (
    ...args: Parameters<Array<TArrayValueType<InputType>>["forEach"]>
  ): void {
    this.bind(
      (
        _index,
        _deleteCount,
        ...addedItems
      ) => addedItems.forEach(...args),
    );
  }

  /**
   * Similar to `Array::reduce()`, except that its return value is a `ReadonlyReactiveValue` and will be reevaluated every time the array changes. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.reduce()` for a non-reactive result.
   */
  reduce (
    ...args: Parameters<Array<TArrayValueType<InputType>>["reduce"]>
  ): ReadonlyReactiveValue<ReturnType<Array<TArrayValueType<InputType>>["reduce"]>> {
    return this.pipe(() => this.#value.reduce(...args));
  }

  /**
   * Similar to `Array::reduceRight()`, except that its return value is a `ReadonlyReactiveValue` and will be reevaluated every time the array changes. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.reduceRight()` for a non-reactive result.
   */
  reduceRight (
    ...args: Parameters<Array<TArrayValueType<InputType>>["reduceRight"]>
  ): ReadonlyReactiveValue<ReturnType<Array<TArrayValueType<InputType>>["reduceRight"]>> {
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
   * Similar to `Array::findIndex`, except that it returns a `ReactiveValue<number>` whose value is updated if the index of the item changes as other items are added or removed from the array. The array is not searched again as it's mutated, however. If nothing is found, `ReadonlyReactiveValue<-1>` is returned, and its value will never be updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.findIndex()` instead.
   */
  findIndex (
    ...args: Parameters<Array<TArrayValueType<InputType>>["findIndex"]>
  ): ReadonlyReactiveValue<ReturnType<Array<TArrayValueType<InputType>>["findIndex"]>> {
    const index = this.#value.findIndex(...args);

    return index === -1
      ? new ReadonlyReactiveValue(-1)
      : this.#indices[index]?.readonly ?? throwExpression("Internal error: lost track of index");
  }

  /**
   * Works similar to `Array::entries()`. The difference is that it returns a `ReadonlyReactiveArray` containing the entries and is updated as the original array is updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.entries()` for an iterator of non-reactive values instead.
   */
  entries (): ReadonlyReactiveArray<[
    index: ReadonlyReactiveValue<number>,
    value: TArrayValueType<InputType>,
  ]> {
    type TEntryType = [
      index: ReadonlyReactiveValue<number>,
      value: TArrayValueType<InputType>,
    ];

    const newArray = new ReactiveArray(
      ...this.#value.map((value, i): TEntryType => [
        this.#indices[i]?.readonly ?? throwExpression("Internal error: lost track of index"),
        value,
      ]),
    );
    this.bind(
      (index, deleteCount, ...addedItems) => {
        newArray.#splice(
          index,
          deleteCount,
          ...addedItems.map((value, i): TEntryType => [
            this.#indices[index + i]?.readonly ?? throwExpression("Internal error: lost track of index"),
            value,
          ]),
        );
      },
      {
        noFirstRun: true,
        dependents: [newArray],
      },
    );

    return newArray.readonly;
  }

  /**
   * Works similar to `Array::keys()`. The difference is that it returns a `ReadonlyReactiveArray` containing the keys and is updated as the original array is updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.keys()` for an iterator of non-reactive values instead.
   */
  keys (): ReadonlyReactiveArray<ReadonlyReactiveValue<number>> {
    const newArray = new ReactiveArray(
      ...this.#indices.map(index => index.readonly),
    );
    this.bind(
      (index, deleteCount, ...addedItems) => {
        newArray.#splice(
          index,
          deleteCount,
          ...addedItems.map((_, i) => 
            this.#indices[index + i]?.readonly ?? throwExpression("Internal error: lost track of index")
          ),
        );
      },
      {
        noFirstRun: true,
        dependents: [newArray],
      },
    );

    return newArray.readonly;
  }

  /**
   * Works similar to `Array::values()`. The difference is that it returns a `ReadonlyReactiveArray` containing the values and is updated as the original array is updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.values()` for an iterator of non-reactive values instead.
   */
  values (): ReadonlyReactiveArray<TArrayValueType<InputType>> {
    const newArray = new ReactiveArray(...this.#value.values());
    this.bind(
      (index, deleteCount, ...addedItems) => {
        newArray.#splice(index, deleteCount, ...addedItems.values());
      },
      {
        noFirstRun: true,
        dependents: [newArray],
      },
    );

    return newArray.readonly;
  }

  /**
   * Works similar to `Array::includes()`. The difference is that it returns a `ReadonlyReactiveValue<boolean>` containing the result and is updated as the original array is updated. If you don't want this behavior, use `ReadonlyReactiveArray.prototype.value.includes()` for a plain boolean instead.
   */
  includes (
    ...args: Parameters<Array<TArrayValueType<InputType>>["includes"]>
  ): ReadonlyReactiveValue<boolean> {
    return this.pipe(
      () => this.#value.includes(...args),
    );
  }

  /**
   * Conbines the array with one or more other arrays, or other values.
   * 
   * Similar to `Array::concat()`, except that it returns a `ReadonlyReactiveArray`. It accepts arrays, `ReactiveArray`s, `ReactiveValue`s, or other items as parameters. Any `ReactiveArray`s or `ReactiveValue`s will be tracked, and the resulting `ReadonlyReactiveArray` will be updated whenever they get updated.
   * 
   * @param items The items to be tacked onto the original array.
   */
  concat<
    U,
    K extends TArrayValueType<InputType> | U,
  > (
    ...items: Array<K | Array<K> | ReactiveValue<K> | ReactiveArray<K>>
  ): ReadonlyReactiveArray<U | TArrayValueType<InputType>> {
    const newArray = this.clone() as ReactiveArray<TArrayValueType<InputType> | U>;
    this.bind(
      (...args) => splicers.get(newArray)(...args),
      {
        dependents: [newArray],
      },
    );
    const lengthTally: Array<{value: number}> = [
      this.length,
    ];
    function currentOffset (
      cutoff: number,
      index = 0,
    ) {
      let tally = index;
      for (let i = 0; i < cutoff; i++) {
        tally += lengthTally[i]?.value ?? throwExpression("Internal error: failed to concatenate", RangeError);
      }
      return tally;
    }
    for (const [i, item] of items.entries()) {
      if (item instanceof ReadonlyReactiveArray) {
        item.bind(
          (
            index,
            deleteCount,
            ...values
          ) => newArray.splice(
            currentOffset(i, index),
            deleteCount,
            ...values
          ),
          {
            dependents: [newArray],
          }
        );
        lengthTally.push(item.length);
      } else if (item instanceof ReadonlyReactiveValue) {
        item.bind(
          value => newArray.splice(
            currentOffset(i),
            1,
            value,
          ),
          {
            dependents: [newArray],
          }
        );
        lengthTally.push({
          value: 1,
        });
      } else if (Array.isArray(item)) {
        newArray.splice(
          currentOffset(i),
          0,
          ...item,
        );
        lengthTally.push({
          value: item.length,
        });
      } else {
        newArray.splice(
          currentOffset(i),
          0,
          item,
        );
        lengthTally.push({
          value: 1,
        });
      }
    }
    return newArray;
  }
}
