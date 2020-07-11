import { IReactiveEntity } from "../types/IReactiveEntity";
import { IReactiveObject } from "../types/IReactiveObject.js";
import { propertyDescriptorToReactive } from "./propertyDescriptorToReactive.js";
import { reactiveObjectFlag } from "./reactiveObjectFlag.js";

/**
 * Takes an object, and passes each of its non-function properties to `reactive()`, which makes the entire structure reactive recursively.
 * 
 * !Note: this method modifies the original object. It may break code that relies on that not happening. There may be cases where objects (either the top level one, or one further down) misbehaves or breaks. To avoid an inner object from being converted, wrap it in `new ReactivePrimitive()`.
 * 
 * @param input The object whose properties are to be made reactive
 * @param parent Another reactive entity to which any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function reactiveObject<T extends object> (
  input: T,
  parent?: IReactiveEntity<unknown>,
): IReactiveObject<T> {
  let current: object = input;
  const prototypeChain = [];
  do {
    prototypeChain.unshift(Object.getOwnPropertyDescriptors(current));
  } while (current = Reflect.getPrototypeOf(current));

  Object.seal(
    Object.defineProperties(input,
      Object.fromEntries(
        Object.entries(
          Object.assign(
            prototypeChain.shift()!,
            ...prototypeChain,
            {
              [reactiveObjectFlag]: {
                writable: false,
                enumerable: false,
                value: true,
              },
            },
          ) as (object & {
            [x: string]: PropertyDescriptor,
          }),
        )
        .filter(([, {value, configurable}]) => (
          typeof value !== "function" && 
          configurable
        ))
        .map(propertyDescriptorToReactive(parent)),
      ),
    ),
  );

  return input as IReactiveObject<T>;
}
