import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.ts";
import type { ReactiveArray } from "./_ReactiveArray.ts";
import type { TArrayValueType } from "./TArrayValueType.ts";

export type TSplice<InputType> = (
  start: number,
  deleteCount?: number,
  ...items: ReadonlyArray<InputType | TArrayValueType<InputType>>
) => Array<TArrayValueType<InputType>>;

export const splicers = new class {
  #inner = new WeakMap<
    // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
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
