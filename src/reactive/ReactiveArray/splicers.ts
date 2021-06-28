import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";
import type { ReactiveArray } from "./_ReactiveArray.js";
import type { TArrayValueType } from "./TArrayValueType.js";

export type TSplice<InputType> = (
  start: number,
  deleteCount?: number,
  ...items: ReadonlyArray<InputType | TArrayValueType<InputType>>
) => Array<TArrayValueType<InputType>>;

export const splicers = new class {
  #inner = new WeakMap<
    ReadonlyReactiveArray<any>
  >();

  get<InputType>(
    key: ReadonlyReactiveArray<InputType> | ReactiveArray<InputType>,
  ) {
    return this.#inner.get(key) as TSplice<InputType>;
  }

  set<InputType>(
    key: ReadonlyReactiveArray<InputType>,
    value: TSplice<InputType>,
  ) {
    this.#inner.set(key, value);
  }
};
