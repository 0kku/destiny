import { reactive } from "../reactive.js";
import { reactiveObjectFlag } from "./reactiveObjectFlag.js";
import type { TReactiveEntity } from "../types/IReactiveEntity.js";
import type { TReactiveObject } from "../types/IReactiveObject.js";

/**
 * Takes an object, and passes each of its enumerable properties to `reactive()`, which makes the entire structure reactive recursively.
 * 
 * @param input The object whose properties are to be made reactive
 * @param parent Another reactive entity to which any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function reactiveObject<
  T extends Readonly<Record<string, unknown>>,
  K = unknown,
> (
  input: T,
  parent?: TReactiveEntity<K>,
): TReactiveObject<T> {
  // TS is incapable of figuring out the type correctly here, so it will throw a runtime error instead.
  if (![null, Object].includes(input.constructor as ObjectConstructor)) {
    throw new TypeError(`Illegal object passed to reactiveObject. Reactive objects must be made with objects that have \`Object\` or \`null\` as their prototype, but it was \`${input.constructor.name}\`. Alternatively, wrap the object using ReactivePrimitive.`);
  }
  
  const result = Object.fromEntries(
    Object
    .entries(input)
    .map(entry => (entry[1] = reactive(entry[1], {parent}), entry))
  ) as {
    [key: string]: unknown,
    [reactiveObjectFlag]: true,
  };
  result[reactiveObjectFlag] = true;

  return Object.freeze(result) as TReactiveObject<T>;
}
