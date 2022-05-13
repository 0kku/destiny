import type { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.ts";
import type { TArrayValueType } from "./TArrayValueType.ts";
import type { ReactiveArray } from "./_ReactiveArray.ts";

export const internalArrays = new class {
  #inner = new WeakMap<
    // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
    ReadonlyReactiveArray<any>
  >();

  get<InputType>(
    key: ReadonlyReactiveArray<InputType> | ReactiveArray<InputType>,
  ) {
    return this.#inner.get(key) as ReadonlyArray<TArrayValueType<InputType>>;
  }

  set<InputType>(
    key: ReadonlyReactiveArray<InputType>,
    value: ReadonlyArray<TArrayValueType<InputType>>,
  ) {
    this.#inner.set(key, value);
  }
}();
