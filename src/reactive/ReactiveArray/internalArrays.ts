import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";
import type { TArrayValueType } from "./TArrayValueType.js";
import type { ReactiveArray } from "./_ReactiveArray.js";

export const internalArrays = new class {
  #inner = new WeakMap<
    ReadonlyReactiveArray<any>
  >();

  get<InputType>(
    key: ReadonlyReactiveArray<InputType> | ReactiveArray<InputType>
  ) {
    return this.#inner.get(key) as ReadonlyArray<TArrayValueType<InputType>>;
  }

  set<InputType>(
    key: ReadonlyReactiveArray<InputType>,
    value: ReadonlyArray<TArrayValueType<InputType>>,
  ) {
    this.#inner.set(key, value);
  }
};
