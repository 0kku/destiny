import { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";
import { splicers } from "./splicers.js";
import { internalArrays } from "./internalArrays.js";
import type { TArrayValueType } from "./TArrayValueType.js";
import type { ReadonlyReactiveValue } from "../ReactiveValue/_ReadonlyReactiveValue.js";

/**
 * `ReactiveArray`s are reactive values that contain multiple values which can be updated and whose updates can be listened to. In general, `ReactiveArray`s behave very similar to native `Array`s. The main difference is, that most primitive values are given as `ReactiveValue`s and any immutable methods will return a new `ReadonlyReactiveArray`, whose values are tied to the original `ReactiveArray`. The class also provides a few custom convenience methods.
 */
export class ReactiveArray<InputType> extends ReadonlyReactiveArray<InputType> {
  #value: ReadonlyArray<TArrayValueType<InputType>>;

  /** Cache for readonly getter */
  #readonly: ReadonlyReactiveArray<InputType> | undefined = undefined;

   /** Readonly version of the instance that can't be mutated from the outside, but will be updated as the original instance updates. */
  get readonly (): ReadonlyReactiveArray<InputType> {
    return this.#readonly ?? (this.#readonly = (() => {
      const newArray = new ReadonlyReactiveArray<InputType>();
      this.bind(
        (...args) => splicers.get(newArray)(...args),
        {
          dependents: [newArray],
        },
      );

      return newArray;
    })());
  }

  constructor (...input: ReadonlyArray<InputType>) {
    super(...input);

    this.#value = internalArrays.get(this);
  }


  splice (
    start: number,
    deleteCount?: number,
    ...items: Array<InputType | TArrayValueType<InputType>>
  ): Array<TArrayValueType<InputType>> {
    return splicers.get(this)(start, deleteCount, ...items);
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
          const [first] = acc;
          if (!first || first[0] + first[1] !== indexToDelete) {
            acc.unshift([indexToDelete,  1]);
          } else {
            first[1]++;
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
          if (!acc.length || acc[0]![0] + acc[0]![1] !== index) {
            acc.unshift([index, 1, value]);
          } else {
            acc[0]![1]++;
            acc[0]!.push(value);
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
  pop (): TArrayValueType<InputType> | undefined {
    return this.splice(-1, 1)[0];
  }
 
  /**
   * Similar to `Array::push()`. Appends new element(s) to an array, and returns the new length of the array as a reactive number.
   */
  push (
    ...items: Array<InputType>
  ): ReadonlyReactiveValue<number> {
    this.splice(this.#value.length, 0, ...items);
 
    return this.length;
  }
 
  /**
   * Works just like `Array::reverse()`. Reverses the elements of the array in place.
   */
  reverse (): this {
    this.value = this.value.reverse();
 
    return this;
  }
 
  /**
   * Works just like `Array.shift()`. Removes the first element from an array and returns it.
   */
  shift (): TArrayValueType<InputType> | undefined {
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
    this.value = this.value.sort(compareFn);
 
    return this;
  }

  /**
   * Similar to `Array::unshift()`. Returns the new length after the item(s) have been inserted.
   */
  unshift (
    ...items: Array<InputType>
  ): ReadonlyReactiveValue<number> {
    this.splice(0, 0, ...items);
    return this.length;
  }
}
