import type { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.ts";

export class PassReactiveValue<T> {
  deref: ReadonlyReactiveValue<T>;

  constructor(ref: ReadonlyReactiveValue<T>) {
    this.deref = ref;
  }
}
