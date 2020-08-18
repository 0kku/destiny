import { reactive, ReactivePrimitive } from "../../mod.js";
import type { TReactiveEntity } from "../types/IReactiveEntity.js";

type TPropertyDescriptorEntry = [
  key: string,
  descriptor: PropertyDescriptor,
];

/**
 * Modifies a `PropertyDescriptor` to have its value reactive and sets it to unconfigurable.
 * 
 * @param parent Another reactive entity to which any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function propertyDescriptorToReactive<T> (
  parent?: TReactiveEntity<T>,
) {
  return (
    propertyDescriptorEntry: TPropertyDescriptorEntry,
  ): TPropertyDescriptorEntry => {
    const [key, descriptor] = propertyDescriptorEntry;
    const get = descriptor.get?.bind(descriptor) as (() => unknown) | undefined;
    const set = descriptor.set?.bind(descriptor) as ((v: unknown) => void) | undefined;
  
    if (
      (get && !set) ||  // No point observing readonly properties
      (!get && set)     // No point observing writeonly properties
    ) {
      return propertyDescriptorEntry;
    }
    descriptor.configurable = false;
    
    const ref = reactive(
      descriptor.value as unknown,
      {parent},
    );

    if (!(get && set)) {
      /* No getters/setters to worry about */
      descriptor.value = ref;
    } else {
      /* Try avoid breaking existing getters & setters */
      if (!(ref instanceof ReactivePrimitive)) {
        descriptor.writable = false;
      }
      descriptor.get = () => {
        get(); // in case setter has side-effects
        return ref;
      };
      descriptor.set = value => {
        if (ref instanceof ReactivePrimitive) {
          set(value);
          ref.value = get(); // in case se resulting value is different from what's given to the setter
        } else {
          throw new TypeError(`Illegal assignment to reactive object field ${key}`);
        }
      };
    }
    
    return propertyDescriptorEntry;
  };
}
