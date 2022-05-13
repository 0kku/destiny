import type { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.ts";
import type { TReactiveValueUpdater } from "./TReactiveValueUpdater.ts";

export const internalSetReactiveValue = new class {
  #inner = new WeakMap<
    // deno-lint-ignore no-explicit-any People can pass literally anything into ReactiveArray
    ReadonlyReactiveValue<any>
  >();

  get<T>(
    key: ReadonlyReactiveValue<T>
  ) {
    return this.#inner.get(key) as TReactiveValueUpdater<T>;
  }

  set<T>(
    key: ReadonlyReactiveValue<T>,
    value: TReactiveValueUpdater<T>,
  ) {
    this.#inner.set(key, value);
  }
};
