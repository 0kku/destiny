import { internalSetReactiveValue } from "./internalSetReactiveValue.js";
import { ReadonlyReactiveValue } from "./_ReadonlyReactiveValue.js";
import type { TReactiveValueUpdaterOptions } from "./TReactiveValueUpdaterOptions.js";

export class ReactiveValue<T> extends ReadonlyReactiveValue<T> {
  /**
   * Forces an update event to be dispatched.
   */
  update (): this {
    this.set(
      this.value,
      { force: true },
    );

    return this;
  }
    
  /**
   * Can be used to functionally update the value.
   * @param value New value to be set
   * @param noUpdate One or more callback methods you don't want to be called on this update. This can be useful for example when responding to DOM events: you wouldn't want to update the DOM with the new value on the same element that caused the udpate in the first place.
   */
  set (
    value: T,
    options?: Partial<TReactiveValueUpdaterOptions<T>>,
  ): this {
    internalSetReactiveValue.get(this)(value, options);

    return this;
  }
  
  /** The current value of the ReactiveValue. */
  override get value (): T {
    return super.value; 
  }

  /** The current `value` of the `ReactiveValue` */
  override set value (
    value: T,
  ) {
    this.set(value);
  }

  /** Cache for readonly getter */
  #readonly: ReadonlyReactiveValue<T> | undefined;

  /** Readonly version of the instance that can't be mutated from the outside, but will be updated as the original instance updates. */
  get readonly (): ReadonlyReactiveValue<T> {
    return this.#readonly ?? (this.#readonly = this.pipe(v => v));
  }
}
