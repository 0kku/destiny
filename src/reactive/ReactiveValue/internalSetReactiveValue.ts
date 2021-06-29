import type { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.js";
import type { TReactiveValueUpdater } from "./TReactiveValueUpdater";

export const internalSetReactiveValue = new class {
  #inner = new WeakMap<
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
