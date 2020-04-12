import { reactive } from "./reactive.js";
import { IReactive } from "./types/IReactive.js";
import { IReactiveObject } from "./types/IReactiveObject";

export function reactiveObject<T extends object> (
  input: T,
  parent?: IReactive<unknown>,
): IReactiveObject<T> {
  return Object.fromEntries(
    Object
    .entries(input)
    .map(([k, v]) => [
      k,
      reactive(
        v,
        {parent}
      ),
    ]),
  ) as IReactiveObject<T>;
}
