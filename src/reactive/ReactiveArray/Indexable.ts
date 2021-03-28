import { toNumber } from "../../utils/toNumber.js";
import type { TArrayValueType } from "../types/IArrayValueType.js";

export abstract class Indexable<T> {
  /** The keys are enabled by the Proxy defined in the constructor */
  [key: number]: TArrayValueType<T>;

  constructor () {
    const proxy: Indexable<T> = new Proxy(this, {
      get (target, key, receiver: Indexable<T>) {
        const index = toNumber(key);
        if (!Number.isNaN(index)) {
          return receiver.get(index);
        }
        return Reflect.get(target, key, receiver) as typeof target[keyof typeof target];
      },
      set (target, key, value, receiver: Indexable<T>) {
        const index = toNumber(key);
        if (!Number.isNaN(index)) {
          receiver.set(index, value);
          return true;
        }
        return Reflect.set(target, key, value, receiver);
      },
      deleteProperty () {
        throw new TypeError("Illegal use of delete keyword");
      },
    });
    return proxy;
  }
  
  abstract get (index: number): TArrayValueType<T>;
  abstract set (index: number, value: T): void;
}
