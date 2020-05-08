import { toNumber } from "../utils/toNumber.js";
import { ReactiveArray } from "./ReactiveArray";

export const reactiveArrayProxyConfig = {
  deleteProperty<InputType>(
    target: ReactiveArray<InputType>,
    property: keyof ReactiveArray<InputType> | string,
  ) {
    const index = toNumber(property);
    if (!Number.isNaN(index)) {
      target.splice(index, 1);
      return true;
    }
    else
      return false;
  },

  get<InputType>(
    target: ReactiveArray<InputType>,
    property: keyof ReactiveArray<InputType>,
  ) {
    const index = toNumber(property);
    if (!Number.isNaN(index)) { // Was valid number key (i.e. array index)
      return target.get(index);
    }
    else { // Was a string or symbol key
      const value = target[property];
      return typeof value === "function"
        ? value.bind(target) // Without binding, #private fields break in Proxies
        : value;
    }
  },

  set<InputType>(
    target: ReactiveArray<InputType>,
    property: keyof ReactiveArray<InputType> | string,
    value: InputType,
  ) {
    const index = toNumber(property);
    if (!Number.isNaN(index)) {
      target.set(index, value);
      return true;
    }
    else {
      return false;
    }
  },
};
