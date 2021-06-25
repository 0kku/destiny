import type { ReadonlyReactiveValue } from "./ReactiveValue.js";

export class PassReactiveValue<T> {
  deref: ReadonlyReactiveValue<T>;

  constructor (ref: ReadonlyReactiveValue<T>) {
    this.deref = ref;
  }
}
