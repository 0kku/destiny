import { TReactiveEntity } from "../types/IReactiveEntity";
import { TReactiveObject } from "../types/IReactiveObject.js";
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
export function reactiveObject<T extends Record<string, unknown>, K = unknown> (
  input: T,
  parent?: TReactiveEntity<K>,
): TReactiveObject<T> {
  let current: Record<string, unknown> | undefined = input;
  const prototypeChain: Array<{
    [x: string]: PropertyDescriptor,
  }> = [];
  do {
    prototypeChain.unshift(Object.getOwnPropertyDescriptors(current));
  // eslint-disable-next-line no-cond-assign
  } while (current = Reflect.getPrototypeOf(current) as Record<string, unknown> | undefined);

  Object.seal(
    Object.defineProperties(input,
      Object.fromEntries(
        Object.entries(
          Object.assign(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            prototypeChain.shift()!,
            ...prototypeChain,
            {
              [reactiveObjectFlag]: {
                writable: false,
                enumerable: false,
                value: true,
              },
            },
          ) as {
            [x: string]: PropertyDescriptor,
          },
        )
        .filter(([, {value, configurable}]) => (
          typeof value !== "function" && 
          configurable
        ))
        .map(propertyDescriptorToReactive(parent)),
      ),
    ),
  );

  return input as TReactiveObject<T>;
}
